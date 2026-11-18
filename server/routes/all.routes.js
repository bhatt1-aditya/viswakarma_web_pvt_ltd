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
import blogRoutes from "./blog.routes.js";
import settingsRoutes from "./settings.routes.js";
import adminRoutes from "./admin.routes.js";

import { getAllCategories } from "../controllers/service.controller.js";

const router = Router();

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
router.use("/blogs", blogRoutes);
router.use("/settings", settingsRoutes);
router.use("/admin", adminRoutes);

export default router;
