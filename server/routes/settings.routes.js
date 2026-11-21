import { Router } from "express";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  getHomeSettings,
  updateHomeSettings,
  getAboutSettings,
  updateAboutSettings,
  getTestimonials,
} from "../controllers/settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

// Public Settings & Dynamic Screen Data
router.get("/", getWebsiteSettings);
router.get("/home", getHomeSettings);
router.get("/about", getAboutSettings);
router.get("/testimonials", getTestimonials);

// Protected Admin / Authorized Staff Updates
router.put("/", protect, updateWebsiteSettings);
router.put("/home", protect, updateHomeSettings);
router.put("/about", protect, updateAboutSettings);

export default router;
