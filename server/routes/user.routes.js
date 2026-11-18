import { Router } from "express";
import * as controller from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login-user", controller.loginUser);
router.post("/login", controller.loginUser);

router.use(protect);
router.post("/create-user", controller.createUser);
router.get("/get-all-user", controller.getUsers);
router.get("/get-user-by-id/:id", controller.getUserById);
router.put("/update-user/:id", controller.updateUser);
router.delete("/delete-user/:id", controller.deleteUser);

export default router;
