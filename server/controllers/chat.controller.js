import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";
import { emitToProject } from "../socket/socketHandler.js";

// GET PROJECT CHAT HISTORY
export const getProjectChatHistory = async (req, res) => {
  try {
    const { projectId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    let conversation = await Conversation.findOne({ project: projectId, isGroup: true });
    if (!conversation) {
      conversation = await Conversation.create({
        project: projectId,
        name: "Project Workspace Chat",
        isGroup: true,
        members: [{ user: req.user._id, roleName: req.user.roleName || "user" }],
      });
    }

    const messages = await Message.find({ project: projectId })
      .populate("sender", "name email phone clientId")
      .populate("replyTo")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      conversationId: conversation._id,
      count: messages.length,
      data: messages.reverse(),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SEND MESSAGE TO PROJECT WORKSPACE
export const sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      content = "",
      messageType = "TEXT",
      attachments = [],
      replyTo,
      voiceDuration,
    } = req.body;

    let conversation = await Conversation.findOne({ project: projectId, isGroup: true });
    if (!conversation) {
      conversation = await Conversation.create({
        project: projectId,
        name: "Project Workspace Chat",
        isGroup: true,
        members: [{ user: req.user._id, roleName: req.user.roleName || "user" }],
      });
    }

    const message = await Message.create({
      project: projectId,
      conversation: conversation._id,
      sender: req.user._id,
      senderRole: req.user.roleName || "user",
      senderName: req.user.name,
      messageType,
      content,
      attachments,
      replyTo,
      voiceDuration,
      readBy: [{ user: req.user._id, readAt: new Date() }],
    });

    conversation.lastMessage = message._id;
    conversation.lastMessageAt = new Date();
    await conversation.save();

    const populated = await Message.findById(message._id)
      .populate("sender", "name email phone clientId")
      .populate("replyTo");

    emitToProject(projectId, "new_message", populated);

    res.status(201).json({
      message: "Message sent",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE EMOJI REACTION
export const toggleReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;

    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    const existingIndex = msg.reactions.findIndex(
      (r) => r.user?.toString() === req.user._id.toString() && r.emoji === emoji
    );

    if (existingIndex > -1) {
      msg.reactions.splice(existingIndex, 1);
    } else {
      msg.reactions.push({ emoji, user: req.user._id, userName: req.user.name });
    }

    await msg.save();

    emitToProject(msg.project.toString(), "message_reaction", {
      messageId: msg._id,
      reactions: msg.reactions,
    });

    res.status(200).json({ data: msg.reactions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PIN / UNPIN MESSAGE
export const togglePinMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const msg = await Message.findById(messageId);
    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    msg.isPinned = !msg.isPinned;
    await msg.save();

    emitToProject(msg.project.toString(), "message_pinned", {
      messageId: msg._id,
      isPinned: msg.isPinned,
    });

    res.status(200).json({ data: msg });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
