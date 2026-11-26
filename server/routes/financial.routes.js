import { Router } from "express";
import {
  getProjectInvoices,
  createInvoice,
  recordPayment,
  getFinancialSummary,
} from "../controllers/financial.controller.js";
import { protect, authorizeRoles, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Get invoices for a project
router.get("/project/:projectId", protect, verifyProjectMember, getProjectInvoices);

// Create new invoice (Admin / PM)
router.post(
  "/project/:projectId",
  protect,
  authorizeRoles("super admin", "superadmin", "admin", "project manager"),
  createInvoice
);

// Record payment (Admin / Super Admin)
router.put(
  "/:invoiceId/pay",
  protect,
  authorizeRoles("super admin", "superadmin", "admin"),
  recordPayment
);

// High-level financial summary
router.get(
  "/summary",
  protect,
  authorizeRoles("super admin", "superadmin", "admin"),
  getFinancialSummary
);

export default router;
