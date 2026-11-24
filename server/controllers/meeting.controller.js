import Meeting from "../models/meeting.model.js";
import MeetingMinutes from "../models/meetingMinutes.model.js";
import Task from "../models/task.model.js";
import AuditLog from "../models/auditLog.model.js";
import Notification from "../models/notification.model.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// SCHEDULE MEETING
export const scheduleMeeting = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      agenda = "",
      meetingDate,
      startTime,
      endTime,
      meetingLink = "",
      participants = [],
    } = req.body;

    const meeting = await Meeting.create({
      project: projectId,
      title,
      agenda,
      meetingDate,
      startTime,
      endTime,
      meetingLink,
      requestedBy: req.user._id,
      participants,
      status: "SCHEDULED",
    });

    const populated = await Meeting.findById(meeting._id)
      .populate("requestedBy", "name email")
      .populate("participants.user", "name email");

    // Audit Log
    await AuditLog.create({
      project: projectId,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "User",
      action: "MEETING_SCHEDULED",
      description: `Meeting '${title}' scheduled for ${meetingDate} at ${startTime}`,
    });

    emitToProject(projectId, "meeting_scheduled", populated);

    res.status(201).json({
      message: "Meeting scheduled successfully",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROJECT MEETINGS
export const getProjectMeetings = async (req, res) => {
  try {
    const { projectId } = req.params;

    const meetings = await Meeting.find({ project: projectId })
      .populate("requestedBy", "name email")
      .populate("participants.user", "name email")
      .populate("meetingMinutes")
      .sort({ meetingDate: -1 });

    res.status(200).json({
      count: meetings.length,
      data: meetings,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE MEETING STATUS
export const updateMeetingStatus = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { status } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    meeting.status = status;
    await meeting.save();

    emitToProject(meeting.project.toString(), "meeting_status_updated", {
      meetingId: meeting._id,
      status,
    });

    res.status(200).json({
      message: `Meeting marked as ${status}`,
      data: meeting,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUBLISH MINUTES OF MEETING (MoM)
export const publishMeetingMinutes = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const {
      discussionPoints = [],
      clientDecisions = [],
      actionItems = [],
      nextMeetingDate,
      notes = "",
      createTasksForActionItems = false,
    } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    let minutes = await MeetingMinutes.findOne({ meeting: meetingId });

    if (minutes) {
      minutes.discussionPoints = discussionPoints;
      minutes.clientDecisions = clientDecisions;
      minutes.actionItems = actionItems;
      minutes.nextMeetingDate = nextMeetingDate;
      minutes.notes = notes;
      minutes.publishedBy = req.user._id;
      await minutes.save();
    } else {
      minutes = await MeetingMinutes.create({
        meeting: meetingId,
        project: meeting.project,
        publishedBy: req.user._id,
        discussionPoints,
        clientDecisions,
        actionItems,
        nextMeetingDate,
        notes,
      });

      meeting.meetingMinutes = minutes._id;
      meeting.status = "COMPLETED";
      await meeting.save();
    }

    // Optionally auto-create Tasks from Action Items
    if (createTasksForActionItems && Array.isArray(actionItems)) {
      for (const item of actionItems) {
        if (item.taskText) {
          await Task.create({
            project: meeting.project,
            title: item.taskText,
            description: `Action item from meeting '${meeting.title}'`,
            assignedTo: item.assignedTo,
            deadline: item.deadline,
            createdBy: req.user._id,
            status: "TODO",
          });
        }
      }
    }

    // Audit Log
    await AuditLog.create({
      project: meeting.project,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "User",
      action: "MOM_PUBLISHED",
      description: `Minutes of Meeting published for '${meeting.title}' by ${req.user.name}`,
    });

    emitToProject(meeting.project.toString(), "mom_published", {
      meetingId: meeting._id,
      minutes,
    });

    res.status(200).json({
      message: "Minutes of Meeting published successfully",
      data: minutes,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET MEETING MINUTES
export const getMeetingMinutes = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const minutes = await MeetingMinutes.findOne({ meeting: meetingId })
      .populate("publishedBy", "name email")
      .populate("actionItems.assignedTo", "name email");

    if (!minutes) {
      return res.status(404).json({ message: "Minutes of Meeting not found" });
    }

    res.status(200).json({ data: minutes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
