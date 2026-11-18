import { Router } from "express";
import {
  getAllPortfolio,
  getPortfolioBySlug,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolio.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getAllPortfolio);
router.get("/:slug", getPortfolioBySlug);

router.post("/create", protect, createPortfolio);
router.put("/update/:id", protect, updatePortfolio);
router.delete("/delete/:id", protect, deletePortfolio);

export default router;
