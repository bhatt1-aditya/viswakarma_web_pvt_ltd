import { Router } from "express";
import {
  getAllIndustries,
  getIndustryBySlug,
  createIndustry,
  updateIndustry,
  deleteIndustry,
} from "../controllers/industry.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getAllIndustries);
router.get("/:slug", getIndustryBySlug);

router.post("/create", protect, createIndustry);
router.put("/update/:id", protect, updateIndustry);
router.delete("/delete/:id", protect, deleteIndustry);

export default router;
