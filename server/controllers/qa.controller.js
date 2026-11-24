import BugReport from "../models/bugReport.model.js";
import AuditLog from "../models/auditLog.model.js";
import Notification from "../models/notification.model.js";
import { generateBugId } from "../utils/idGenerator.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// CREATE BUG REPORT (QA / CLIENT / PM)
export const createBugReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      title,
      description,
      stepsToReproduce = "",
      expectedBehavior = "",
      actualBehavior = "",
      screenshots = [],
      severity = "MEDIUM",
      assignedDeveloper,
    } = req.body;

    const bugId = await generateBugId();

    const bug = await BugReport.create({
      project: projectId,
      bugId,
      title,
      description,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      screenshots,
      severity,
      status: assignedDeveloper ? "ASSIGNED" : "OPEN",
      reportedBy: req.user._id,
      assignedDeveloper,
    });

    const populated = await BugReport.findById(bug._id)
      .populate("reportedBy", "name email")
      .populate("assignedDeveloper", "name email");

    // Audit Log
    await AuditLog.create({
      project: projectId,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "QA",
      action: "BUG_REPORTED",
      description: `Bug ${bug.bugId}: '${title}' reported [${severity} severity]`,
    });

    emitToProject(projectId, "bug_created", populated);

    if (assignedDeveloper) {
      emitToUser(assignedDeveloper.toString(), "bug_assigned", populated);
    }

    res.status(201).json({
      message: "Bug report created successfully",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROJECT BUGS
export const getProjectBugs = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, severity, assignedDeveloper } = req.query;

    let query = { project: projectId };
    if (status && status !== "ALL") query.status = status;
    if (severity && severity !== "ALL") query.severity = severity;
    if (assignedDeveloper && assignedDeveloper !== "ALL") query.assignedDeveloper = assignedDeveloper;

    const bugs = await BugReport.find(query)
      .populate("reportedBy", "name email")
      .populate("assignedDeveloper", "name email")
      .populate("retestedBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: bugs.length,
      data: bugs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE BUG STATUS (DEVELOPER RESOLVES OR QA CLOSES/REOPENS)
export const updateBugStatus = async (req, res) => {
  try {
    const { bugId } = req.params;
    const { status, resolutionNotes, assignedDeveloper } = req.body;

    const bug = await BugReport.findById(bugId);
    if (!bug) {
      return res.status(404).json({ message: "Bug report not found" });
    }

    const oldStatus = bug.status;
    bug.status = status;

    if (resolutionNotes) bug.resolutionNotes = resolutionNotes;
    if (assignedDeveloper) bug.assignedDeveloper = assignedDeveloper;

    if (status === "FIXED") {
      bug.resolvedAt = new Date();
    } else if (status === "CLOSED" || status === "REOPENED") {
      bug.retestedBy = req.user._id;
      bug.retestedAt = new Date();
    }

    await bug.save();

    const populated = await BugReport.findById(bug._id)
      .populate("reportedBy", "name email")
      .populate("assignedDeveloper", "name email")
      .populate("retestedBy", "name email");

    emitToProject(bug.project.toString(), "bug_status_updated", {
      bugId: bug._id,
      oldStatus,
      newStatus: status,
      bug: populated,
      updatedBy: req.user.name,
    });

    res.status(200).json({
      message: `Bug ${bug.bugId} status changed to ${status}`,
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
