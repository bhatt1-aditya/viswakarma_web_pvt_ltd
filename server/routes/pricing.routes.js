import { Router } from "express";
import {
  getAllPricing,
  createTier,
  updateTier,
  deleteTier,
  createFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/pricing.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getAllPricing);

// Tiers
router.post("/create", protect, createTier);
router.put("/update/:id", protect, updateTier);
router.delete("/delete/:id", protect, deleteTier);

// FAQs
router.post("/faqs/create", protect, createFaq);
router.put("/faqs/update/:id", protect, updateFaq);
router.delete("/faqs/delete/:id", protect, deleteFaq);

export default router;
