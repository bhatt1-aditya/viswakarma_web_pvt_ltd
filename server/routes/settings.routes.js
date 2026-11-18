import { Router } from "express";
import {
  getWebsiteSettings,
  updateWebsiteSettings,
  getTestimonials,
} from "../controllers/settings.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", getWebsiteSettings);
router.put("/", protect, updateWebsiteSettings);
router.get("/testimonials", getTestimonials);

export default router;
