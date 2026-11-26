import { Router } from "express";
import {
  getProjectChatHistory,
  sendMessage,
  toggleReaction,
  togglePinMessage,
} from "../controllers/chat.controller.js";
import { protect, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Get project chat messages
router.get("/project/:projectId", protect, verifyProjectMember, getProjectChatHistory);

// Send message to project chat
router.post("/project/:projectId", protect, verifyProjectMember, sendMessage);

// React to message
router.post("/:messageId/react", protect, toggleReaction);

// Pin/unpin message
router.put("/:messageId/pin", protect, togglePinMessage);

export default router;
