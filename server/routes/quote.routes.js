import { Router } from "express";
import {
  createQuoteRequest,
  getAllQuoteRequests,
  updateQuoteStatus,
  deleteQuoteRequest,
} from "../controllers/quote.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public submission
router.post("/submit", createQuoteRequest);

// Admin protected
router.get("/all", protect, getAllQuoteRequests);
router.put("/status/:id", protect, updateQuoteStatus);
router.delete("/:id", protect, deleteQuoteRequest);

export default router;
