import { Router } from "express";
import userRoutes from "./user.routes.js";
import roleRoutes from "./role.routes.js";
import leadRoutes from "./lead.routes.js";
import projectRoutes from "./project.route.js";
import serviceRoutes from "./service.routes.js";
import demoRoutes from "./demo.routes.js";
import inquiryRoutes from "./inquiry.routes.js";
import quoteRoutes from "./quote.routes.js";
import portfolioRoutes from "./portfolio.routes.js";
import industryRoutes from "./industry.routes.js";
import pricingRoutes from "./pricing.routes.js";
import blogRoutes from "./blog.routes.js";
import settingsRoutes from "./settings.routes.js";
import adminRoutes from "./admin.routes.js";

// Client Project Lifecycle Management Routes
import dealRoutes from "./deal.routes.js";
import projectLifecycleRoutes from "./projectLifecycle.routes.js";
import taskRoutes from "./task.routes.js";
import dailyReportRoutes from "./dailyReport.routes.js";
import meetingRoutes from "./meeting.routes.js";
import chatRoutes from "./chat.routes.js";
import qaRoutes from "./qa.routes.js";
import financialRoutes from "./financial.routes.js";
import auditRoutes from "./audit.routes.js";
import notificationRoutes from "./notification.routes.js";

import { getAllCategories } from "../controllers/service.controller.js";

const router = Router();

// Existing Routes
router.get("/category/fetch-all", getAllCategories);
router.use("/users", userRoutes);
router.use("/role", roleRoutes);
router.use("/lead", leadRoutes);
router.use("/project", projectRoutes);
router.use("/services", serviceRoutes);
router.use("/service", serviceRoutes);
router.use("/demos", demoRoutes);
router.use("/inquiries", inquiryRoutes);
router.use("/quotes", quoteRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/industries", industryRoutes);
router.use("/industry", industryRoutes);
router.use("/pricing", pricingRoutes);
router.use("/blogs", blogRoutes);
router.use("/settings", settingsRoutes);
router.use("/admin", adminRoutes);

// Client Project Lifecycle Management Routes
router.use("/deals", dealRoutes);
router.use("/lifecycle-projects", projectLifecycleRoutes);
router.use("/tasks", taskRoutes);
router.use("/daily-reports", dailyReportRoutes);
router.use("/meetings", meetingRoutes);
router.use("/chat", chatRoutes);
router.use("/qa", qaRoutes);
router.use("/financial", financialRoutes);
router.use("/audit", auditRoutes);
router.use("/notifications", notificationRoutes);

export default router;
