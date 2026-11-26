import { Router } from "express";
import { getProjectAuditTrail } from "../controllers/audit.controller.js";
import { protect, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/project/:projectId", protect, verifyProjectMember, getProjectAuditTrail);

export default router;
