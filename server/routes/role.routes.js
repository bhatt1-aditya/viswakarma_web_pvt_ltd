import { Router } from "express";
import * as controller from "../controllers/role.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect);

router.post("/create-role", controller.createRole);
router.get("/get-all-role", controller.getRoles);
router.get("/get-role-by-id/:id", controller.getRoleById);
router.put("/update-role-by-id/:id", controller.updateRole);
router.delete("/delete-role/:id", controller.deleteRole);

export default router;
