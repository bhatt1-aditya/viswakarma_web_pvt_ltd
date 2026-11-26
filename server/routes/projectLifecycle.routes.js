import { Router } from "express";
import {
  createLifecycleProject,
  getLifecycleProjects,
  getLifecycleProjectById,
  updateProjectTeam,
  updateLifecycleStatus,
  addProjectMilestone,
  clientApproveMilestone,
  uploadProjectDocument,
} from "../controllers/projectLifecycle.controller.js";
import { protect, authorizeRoles, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Create new project (Admin, Super Admin, PM)
router.post(
  "/",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  createLifecycleProject
);

// Get projects for current user based on role
router.get("/", protect, getLifecycleProjects);

// Get single project details (must be authorized member or admin)
router.get("/:id", protect, verifyProjectMember, getLifecycleProjectById);

// Update project team assignments
router.put(
  "/:id/team",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  updateProjectTeam
);

// Update project lifecycle status
router.put(
  "/:id/status",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  updateLifecycleStatus
);

// Add milestone
router.post(
  "/:id/milestones",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  addProjectMilestone
);

// Client signs off milestone
router.put("/:projectId/milestones/:milestoneId/approve", protect, clientApproveMilestone);

// Upload document
router.post("/:id/documents", protect, verifyProjectMember, uploadProjectDocument);

export default router;
