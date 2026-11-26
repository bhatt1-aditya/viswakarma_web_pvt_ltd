import DailyReport from "../models/dailyReport.model.js";
import AuditLog from "../models/auditLog.model.js";
import Notification from "../models/notification.model.js";
import Project from "../models/project.model.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// SUBMIT DAILY WORK REPORT (DEVELOPER)
export const submitDailyReport = async (req, res) => {
  try {
    const { projectId } = req.params;
    const {
      completedTasks,
      workInProgress,
      pendingWork,
      technicalProblems,
      blockers,
      timeSpentHours,
      screenshotUrls = [],
      tomorrowsPlan,
    } = req.body;

    const toArray = (v) => {
      if (!v) return [];
      if (Array.isArray(v)) return v;
      return v.split("\n").map((s) => s.trim()).filter(Boolean);
    };

    const report = await DailyReport.create({
      project: projectId,
      developer: req.user._id,
      reportDate: new Date(),
      completedTasks: toArray(completedTasks),
      workInProgress: toArray(workInProgress),
      pendingWork: toArray(pendingWork),
      technicalProblems: toArray(technicalProblems),
      blockers: toArray(blockers),
      timeSpentHours: Number(timeSpentHours) || 0,
      screenshotUrls,
      tomorrowsPlan: tomorrowsPlan || "",
      status: "SUBMITTED",
      publishedToClient: false,
    });

    const populated = await DailyReport.findById(report._id).populate("developer", "name email");

    // Notify Project Manager
    const project = await Project.findById(projectId);
    if (project?.assignedProjectManager) {
      const notif = await Notification.create({
        recipient: project.assignedProjectManager,
        title: "New Daily Report Submitted",
        message: `${req.user.name} submitted daily progress report for ${project.name}`,
        type: "DAILY_REPORT_SUBMITTED",
        link: `/projects/${projectId}?tab=reports`,
      });
      emitToUser(project.assignedProjectManager.toString(), "new_notification", notif);
    }

    emitToProject(projectId, "daily_report_submitted", populated);

    res.status(201).json({
      message: "Daily report submitted successfully for review",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET DAILY REPORTS (ROLE FILTERED)
export const getDailyReports = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userRole = (req.user.roleName || "").toLowerCase().trim();

    let query = { project: projectId };

    // Client only sees reports that are published by PM/Admin
    if (userRole === "client" || req.user.isClient) {
      query.publishedToClient = true;
    } else if (userRole === "developer") {
      // Developer can see all reports or their own
      const { myOnly } = req.query;
      if (myOnly === "true") query.developer = req.user._id;
    }

    const reports = await DailyReport.find(query)
      .populate("developer", "name email")
      .populate("reviewedBy", "name email")
      .sort({ reportDate: -1 });

    res.status(200).json({
      count: reports.length,
      data: reports,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REVIEW DAILY REPORT (PM / ADMIN)
export const reviewDailyReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, reviewNotes } = req.body;

    const report = await DailyReport.findById(reportId).populate("developer", "name email");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status; // APPROVED, REJECTED, CHANGES_REQUESTED
    report.reviewedBy = req.user._id;
    report.reviewedAt = new Date();
    if (reviewNotes) report.reviewNotes = reviewNotes;

    await report.save();

    emitToUser(report.developer._id.toString(), "daily_report_reviewed", {
      reportId: report._id,
      status,
      reviewNotes,
    });

    res.status(200).json({
      message: `Daily report marked as ${status}`,
      data: report,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TOGGLE PUBLISH TO CLIENT
export const togglePublishReportToClient = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { publish } = req.body;

    const report = await DailyReport.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.publishedToClient = publish !== undefined ? publish : !report.publishedToClient;
    if (report.publishedToClient) {
      report.publishedAt = new Date();
    }

    await report.save();

    const populated = await DailyReport.findById(report._id)
      .populate("developer", "name email")
      .populate("reviewedBy", "name email");

    emitToProject(report.project.toString(), "daily_report_published", {
      report: populated,
      publishedToClient: report.publishedToClient,
    });

    res.status(200).json({
      message: report.publishedToClient
        ? "Report published to Client Portal"
        : "Report hidden from Client Portal",
      data: populated,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
