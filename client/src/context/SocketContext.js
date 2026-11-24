import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeProjectRoom, setActiveProjectRoom] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

    const s = io(socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    s.on("connect", () => {
      // Socket connected
    });

    s.on("user_status", ({ userId, status }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        if (status === "online") next.add(userId);
        else next.delete(userId);
        return next;
      });
    });

    // Real-time notification toast
    s.on("new_notification", (notif) => {
      toast(notif.title || "New notification", {
        icon: "🔔",
        style: {
          borderRadius: "12px",
          background: "#082B59",
          color: "#fff",
          fontSize: "13px",
        },
      });
    });

    socketRef.current = s;
    setSocket(s);

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  const joinProject = useCallback((projectId) => {
    if (socketRef.current && projectId) {
      socketRef.current.emit("join_project", { projectId }, (res) => {
        if (res?.success) {
          setActiveProjectRoom(projectId);
        }
      });
    }
  }, []);

  const leaveProject = useCallback((projectId) => {
    if (socketRef.current && projectId) {
      socketRef.current.emit("leave_project", { projectId });
      setActiveProjectRoom(null);
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
        activeProjectRoom,
        joinProject,
        leaveProject,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketProvider;
