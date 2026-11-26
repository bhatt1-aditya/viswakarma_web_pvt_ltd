import { Router } from "express";
import {
  scheduleMeeting,
  getProjectMeetings,
  updateMeetingStatus,
  publishMeetingMinutes,
  getMeetingMinutes,
} from "../controllers/meeting.controller.js";
import { protect, verifyProjectMember } from "../middleware/auth.middleware.js";

const router = Router();

// Schedule meeting
router.post("/project/:projectId", protect, verifyProjectMember, scheduleMeeting);

// Get meetings for project
router.get("/project/:projectId", protect, verifyProjectMember, getProjectMeetings);

// Update meeting status
router.put("/:meetingId/status", protect, updateMeetingStatus);

// Publish Minutes of Meeting (MoM)
router.post("/:meetingId/minutes", protect, publishMeetingMinutes);

// Get Minutes of Meeting
router.get("/:meetingId/minutes", protect, getMeetingMinutes);

export default router;
