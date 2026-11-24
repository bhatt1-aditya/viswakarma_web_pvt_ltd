import { Router } from "express";
import {
  createBugReport,
  getProjectBugs,
  updateBugStatus,
} from "../controllers/qa.controller.js";
import { protect, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Create bug report
router.post("/project/:projectId", protect, verifyProjectMember, createBugReport);

// Get bugs for project
router.get("/project/:projectId", protect, verifyProjectMember, getProjectBugs);

// Update bug status (Fix, Retest, Close, Reopen)
router.put("/:bugId/status", protect, updateBugStatus);

export default router;
