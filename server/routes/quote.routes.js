import { Router } from "express";
import {
  createQuoteRequest,
  getAllQuoteRequests,
  updateQuoteStatus,
} from "../controllers/quote.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public submission
router.post("/submit", createQuoteRequest);

// Admin protected
router.get("/all", protect, getAllQuoteRequests);
router.put("/status/:id", protect, updateQuoteStatus);

export default router;
