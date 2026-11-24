import { Router } from "express";
import {
  submitDeal,
  getPendingDeals,
  getAllDeals,
  approveDeal,
  rejectDeal,
} from "../controllers/deal.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";

const router = Router();

// Telecaller or Admin submits deal
router.post("/submit", protect, submitDeal);

// Admin or Super Admin views pending deals
router.get("/pending", protect, authorizeRoles("super admin", "superadmin", "admin"), getPendingDeals);

// Admin or Super Admin views all deals
router.get("/all", protect, authorizeRoles("super admin", "superadmin", "admin", "telecaller"), getAllDeals);

// Admin or Super Admin approves deal
router.post("/approve/:leadId", protect, authorizeRoles("super admin", "superadmin", "admin"), approveDeal);

// Admin or Super Admin rejects deal
router.post("/reject/:leadId", protect, authorizeRoles("super admin", "superadmin", "admin"), rejectDeal);

export default router;
