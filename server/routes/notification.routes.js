import { Router } from "express";
import {
  getUserNotifications,
  markNotificationRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getUserNotifications);
router.put("/:id/read", protect, markNotificationRead);

export default router;
