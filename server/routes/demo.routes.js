import { Router } from "express";
import {
  getAllDemos,
  getDemoById,
  trackDemoInteraction,
} from "../controllers/demo.controller.js";

const router = Router();

router.get("/all", getAllDemos);
router.get("/:demoId", getDemoById);
router.post("/:demoId/interact", trackDemoInteraction);

export default router;
