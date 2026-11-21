import { Router } from "express";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  getHomeSettings,
  updateHomeSettings,
  getTestimonials,
} from "../controllers/settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public Settings & Dynamic Home Screen Data
router.get("/", getWebsiteSettings);
router.get("/home", getHomeSettings);
router.get("/testimonials", getTestimonials);

// Protected Admin / Authorized Staff Updates
router.put("/", protect, updateWebsiteSettings);
router.put("/home", protect, updateHomeSettings);

export default router;
