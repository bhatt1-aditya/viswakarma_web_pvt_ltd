import { Router } from "express";
import {
  getAllServices,
  getServiceBySlug,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
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

// Category routes
router.post("/categories/create", protect, createCategory);
router.put("/categories/update/:id", protect, updateCategory);
router.delete("/categories/delete/:id", protect, deleteCategory);

// Admin protected service routes
router.post("/create", protect, createService);
router.post("/create-service", protect, createService);
router.put("/update/:id", protect, updateService);
router.put("/update-service/:id", protect, updateService);
router.delete("/delete/:id", protect, deleteService);
router.delete("/delete-service/:id", protect, deleteService);

export default router;
