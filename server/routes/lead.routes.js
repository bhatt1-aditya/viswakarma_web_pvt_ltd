import { Router } from "express";
import * as controller from "../controllers/lead.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = Router();

router.use(protect);

router.post("/create-lead", controller.createLead);
router.get("/get-all-lead", controller.getLeads);
router.get("/get-lead-by-id/:id", controller.getLeadById);
router.put("/update-lead-by-id/:id", controller.updateLead);
router.delete("/delete-lead/:id", controller.deleteLead);
router.put("/transfer-lead/:id", controller.transferLead);

router.post("/bulk-upload", controller.bulkUploadLeads);
router.get("/lead-stats", controller.getLeadStats);
router.post("/bulk-assign", controller.bulkAssignLeads);
router.post("/bulk-delete", controller.bulkDeleteLeads);

export default router;
