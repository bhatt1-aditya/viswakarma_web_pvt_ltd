import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/dashboard-stats", protect, getDashboardStats);

export default router;
