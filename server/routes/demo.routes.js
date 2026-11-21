import { Router } from "express";
import {
  getAllDemos,
  getDemoById,
  createDemo,
  updateDemo,
  deleteDemo,
} from "../controllers/demo.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getAllDemos);
router.post("/create", protect, createDemo);
router.put("/update/:id", protect, updateDemo);
router.delete("/delete/:id", protect, deleteDemo);
router.get("/:demoId", getDemoById);

export default router;
