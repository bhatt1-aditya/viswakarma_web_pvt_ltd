import { Router } from "express";
import {
  getAllBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/all", getAllBlogs);
router.get("/:slug", getBlogBySlug);

router.post("/create", protect, createBlog);
router.put("/update/:id", protect, updateBlog);
router.delete("/delete/:id", protect, deleteBlog);

export default router;
