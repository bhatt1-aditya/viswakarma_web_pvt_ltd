import { Router } from "express";
import {
  getProjectTasks,
  createTask,
  updateTaskStatus,
  updateTask,
  addTaskComment,
  deleteTask,
} from "../controllers/task.controller.js";
import { protect, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Get tasks for a project
router.get("/project/:projectId", protect, verifyProjectMember, getProjectTasks);

// Create task in a project
router.post("/project/:projectId", protect, verifyProjectMember, createTask);

// Update status (Kanban column move)
router.put("/:taskId/status", protect, updateTaskStatus);

// Edit task details
router.put("/:taskId", protect, updateTask);

// Add task discussion comment
router.post("/:taskId/comment", protect, addTaskComment);

// Delete task
router.delete("/:taskId", protect, deleteTask);

export default router;
