import { Router } from "express";
import {
  createInquiry,
  getAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from "../controllers/inquiry.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public submission
router.post("/submit", createInquiry);

// Admin protected
router.get("/all", protect, getAllInquiries);
router.put("/status/:id", protect, updateInquiryStatus);
router.delete("/:id", protect, deleteInquiry);

export default router;
