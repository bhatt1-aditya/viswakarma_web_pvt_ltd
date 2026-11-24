import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import Project from "../models/project.model.js";
import Notification from "../models/notification.model.js";

// Store active socket connections: userId -> Set of socket IDs
const activeUsers = new Map();
let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password").populate("role");
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role?.name || "staff",
      };
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id;

    // Track active user sockets
    if (!activeUsers.has(userId)) {
      activeUsers.set(userId, new Set());
    }
    activeUsers.get(userId).add(socket.id);

    // Join user's personal notification room
    socket.join(`user:${userId}`);

    // Broadcast user online status
    io.emit("user_status", { userId, status: "online" });

    // Join Project Room with authorization check
    socket.on("join_project", async ({ projectId }, callback) => {
      try {
        if (!projectId) return;

        // Verify user belongs to this project or is Admin/SuperAdmin
        const role = (socket.user.role || "").toLowerCase().replace(/[\s_-]+/g, "");
        const isAdmin = ["admin", "superadmin"].includes(role);

        if (!isAdmin) {
          const project = await Project.findById(projectId);
          if (!project) {
            if (callback) callback({ success: false, message: "Project not found" });
            return;
          }

          const isClient = project.client?.toString() === userId || project.clientId?.toString() === userId;
          const isTelecaller = project.assignedTelecaller?.toString() === userId;
          const isPM = project.assignedProjectManager?.toString() === userId;
          const isQA = project.assignedQATester?.toString() === userId;
          const isDeveloper = Array.isArray(project.assignedDevelopers) &&
            project.assignedDevelopers.some((d) => d.toString() === userId);

          if (!isClient && !isTelecaller && !isPM && !isQA && !isDeveloper) {
            if (callback) callback({ success: false, message: "Access denied to this project workspace" });
            return;
          }
        }

        const roomName = `project:${projectId}`;
        socket.join(roomName);

        if (callback) callback({ success: true, room: roomName });
      } catch (err) {
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Leave Project Room
    socket.on("leave_project", ({ projectId }) => {
      if (projectId) {
        socket.leave(`project:${projectId}`);
      }
    });

    // Send Message Event
    socket.on("send_message", async (data, callback) => {
      try {
        const { projectId, content, attachments = [], messageType = "TEXT" } = data;
        if (!projectId || (!content && attachments.length === 0)) {
          if (callback) callback({ success: false, message: "Invalid message data" });
          return;
        }

        // Find or create conversation for project
        let conversation = await Conversation.findOne({ project: projectId, isGroup: true });
        if (!conversation) {
          conversation = await Conversation.create({
            project: projectId,
            name: "Project Workspace Chat",
            isGroup: true,
            members: [{ user: userId, roleName: socket.user.role }],
          });
        }

        // Save message to MongoDB
        const message = await Message.create({
          conversation: conversation._id,
          project: projectId,
          sender: userId,
          senderName: socket.user.name,
          senderRole: socket.user.role,
          content: content || "",
          attachments,
          messageType,
          readBy: [{ user: userId, readAt: new Date() }],
        });

        // Update conversation last message
        conversation.lastMessage = message._id;
        conversation.lastMessageAt = new Date();
        await conversation.save();

        const populatedMessage = await Message.findById(message._id)
          .populate("sender", "name email role clientId");

        // Broadcast to all room members
        io.to(`project:${projectId}`).emit("new_message", populatedMessage);

        if (callback) callback({ success: true, message: populatedMessage });
      } catch (err) {
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Typing Indicators
    socket.on("typing_start", ({ projectId }) => {
      socket.to(`project:${projectId}`).emit("user_typing", {
        projectId,
        userId,
        userName: socket.user.name,
        isTyping: true,
      });
    });

    socket.on("typing_stop", ({ projectId }) => {
      socket.to(`project:${projectId}`).emit("user_typing", {
        projectId,
        userId,
        userName: socket.user.name,
        isTyping: false,
      });
    });

    // Message Reaction
    socket.on("add_reaction", async ({ messageId, emoji, projectId }, callback) => {
      try {
        const msg = await Message.findById(messageId);
        if (!msg) return;

        const existingIdx = msg.reactions.findIndex(
          (r) => r.user.toString() === userId && r.emoji === emoji
        );

        if (existingIdx > -1) {
          msg.reactions.splice(existingIdx, 1);
        } else {
          msg.reactions.push({ user: userId, userName: socket.user.name, emoji });
        }

        await msg.save();
        io.to(`project:${projectId}`).emit("reaction_updated", {
          messageId,
          reactions: msg.reactions,
        });

        if (callback) callback({ success: true });
      } catch (err) {
        if (callback) callback({ success: false, message: err.message });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      if (activeUsers.has(userId)) {
        activeUsers.get(userId).delete(socket.id);
        if (activeUsers.get(userId).size === 0) {
          activeUsers.delete(userId);
          io.emit("user_status", { userId, status: "offline" });
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  return ioInstance;
};

export const emitToProject = (projectId, event, data) => {
  if (ioInstance && projectId) {
    ioInstance.to(`project:${projectId}`).emit(event, data);
  }
};

export const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user:${userId}`).emit(event, data);
  }
};

export const emitNotificationToUser = async (io, targetUserId, notificationData) => {
  try {
    const notification = await Notification.create({
      recipient: targetUserId,
      ...notificationData,
    });

    const activeIo = io || ioInstance;
    if (activeIo) {
      activeIo.to(`user:${targetUserId}`).emit("new_notification", notification);
    }
    return notification;
  } catch (err) {
    console.error("Failed to emit notification:", err);
  }
};
