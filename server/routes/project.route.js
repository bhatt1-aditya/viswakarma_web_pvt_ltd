import { Router } from "express";
import * as controller from "../controllers/project.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/create-project", controller.createProject);
router.get("/get-all-project", controller.getProjects);
router.get("/get-project-by-id/:id", controller.getProjectById);
router.put("/update-project/:id", controller.updateProject);
router.delete("/delete-project/:id", controller.deleteProject);

export default router;
