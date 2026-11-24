import { Router } from "express";
import {
  submitDailyReport,
  getDailyReports,
  reviewDailyReport,
  togglePublishReportToClient,
} from "../controllers/dailyReport.controller.js";
import { protect, authorizeRoles, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Submit daily report (Developers / PM)
router.post(
  "/project/:projectId",
  protect,
  verifyProjectMember,
  submitDailyReport
);

// Get daily reports for a project
router.get("/project/:projectId", protect, verifyProjectMember, getDailyReports);

// PM / Admin review daily report
router.put(
  "/:reportId/review",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  reviewDailyReport
);

// PM / Admin toggle publish to client
router.put(
  "/:reportId/publish",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  togglePublishReportToClient
);

export default router;
