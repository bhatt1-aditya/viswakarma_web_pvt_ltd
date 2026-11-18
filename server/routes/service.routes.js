import { Router } from "express";
import {
  getAllServices,
  getServiceBySlug,
  getAllCategories,
  createService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getAllServices);
router.get("/categories", getAllCategories);
router.get("/get-all-services", getAllServices); // backward compatibility
router.get("/:slug", getServiceBySlug);

// Admin protected routes
router.post("/create", protect, createService);
router.put("/update/:id", protect, updateService);
router.delete("/delete/:id", protect, deleteService);

export default router;
