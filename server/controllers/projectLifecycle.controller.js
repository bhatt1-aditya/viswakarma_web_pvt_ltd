import Project from "../models/project.model.js";
import User from "../models/user.model.js";
import Conversation from "../models/conversation.model.js";
import AuditLog from "../models/auditLog.model.js";
import Notification from "../models/notification.model.js";
import { generateProjectId } from "../utils/idGenerator.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// CREATE LIFECYCLE PROJECT (ADMIN / PM)
export const createLifecycleProject = async (req, res) => {
  try {
    const {
      name,
      clientId,
      category = "Web Development",
      description = "",
      requirements = [],
      assignedTelecaller,
      assignedProjectManager,
      assignedDevelopers = [],
      assignedQATester,
      startDate,
      expectedDeliveryDate,
      priority = "MEDIUM",
      contractAmount = 0,
      advancePaid = 0,
      milestones = [],
    } = req.body;

    const uniqueProjectId = await generateProjectId();

    const project = await Project.create({
      name,
      projectId: uniqueProjectId,
      client: clientId,
      category,
      description,
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      assignedTelecaller,
      assignedProjectManager,
      assignedDevelopers,
      assignedQATester,
      startDate: startDate || new Date(),
      expectedDeliveryDate,
      priority,
      contractAmount: Number(contractAmount) || 0,
      advancePaid: Number(advancePaid) || 0,
      lifecycleStatus: "PLANNING",
      milestones: milestones.length > 0 ? milestones : [
        {
          title: "Milestone 1: Architecture & UI/UX Design",
          description: "System design, wireframes and prototype approval.",
          targetDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          status: "IN_PROGRESS",
        },
      ],
    });

    // Create Project Workspace Conversation
    const members = [{ user: req.user._id, roleName: req.user.roleName || "admin" }];
    if (clientId) members.push({ user: clientId, roleName: "client" });
    if (assignedProjectManager) members.push({ user: assignedProjectManager, roleName: "project manager" });
    if (assignedQATester) members.push({ user: assignedQATester, roleName: "qa tester" });
    if (assignedTelecaller) members.push({ user: assignedTelecaller, roleName: "telecaller" });
    if (Array.isArray(assignedDevelopers)) {
      assignedDevelopers.forEach((devId) => {
        members.push({ user: devId, roleName: "developer" });
      });
    }

    await Conversation.create({
      project: project._id,
      name: `${project.name} Workspace Group`,
      isGroup: true,
      members,
    });

    // Audit Log
    await AuditLog.create({
      project: project._id,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "Admin",
      action: "PROJECT_CREATED",
      description: `Project ${project.projectId} - ${project.name} created.`,
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROJECTS FILTERED BY ROLE
export const getLifecycleProjects = async (req, res) => {
  try {
    const userRole = (req.user.roleName || "").toLowerCase().trim();
    const userId = req.user._id;
    let query = {};

    if (userRole === "client" || req.user.isClient) {
      query.client = userId;
    } else if (userRole === "developer" || userRole === "dev") {
      query.assignedDevelopers = userId;
    } else if (userRole === "project manager" || userRole === "projectmanager" || userRole === "pm") {
      query.assignedProjectManager = userId;
    } else if (userRole === "qa tester" || userRole === "qatester" || userRole === "qa") {
      query.assignedQATester = userId;
    } else if (userRole === "telecaller") {
      query.assignedTelecaller = userId;
    }
    // Super Admin & Admin see all projects

    const { status, category, search } = req.query;
    if (status && status !== "ALL") {
      query.lifecycleStatus = status;
    }
    if (category && category !== "ALL") {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { projectId: { $regex: search, $options: "i" } },
      ];
    }

    const projects = await Project.find(query)
      .populate("client", "name email phone clientId companyName")
      .populate("assignedProjectManager", "name email phone")
      .populate("assignedDevelopers", "name email phone")
      .populate("assignedQATester", "name email phone")
      .populate("assignedTelecaller", "name email phone")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      count: projects.length,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PROJECT LIFECYCLE DETAILS
export const getLifecycleProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "name email phone clientId companyName city state address")
      .populate("assignedProjectManager", "name email phone")
      .populate("assignedDevelopers", "name email phone")
      .populate("assignedQATester", "name email phone")
      .populate("assignedTelecaller", "name email phone")
      .populate("documents.uploadedBy", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROJECT TEAM ASSIGNMENTS
export const updateProjectTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedProjectManager, assignedDevelopers, assignedQATester, assignedTelecaller } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (assignedProjectManager !== undefined) project.assignedProjectManager = assignedProjectManager;
    if (assignedDevelopers !== undefined) project.assignedDevelopers = assignedDevelopers;
    if (assignedQATester !== undefined) project.assignedQATester = assignedQATester;
    if (assignedTelecaller !== undefined) project.assignedTelecaller = assignedTelecaller;

    await project.save();

    // Update members in Project Workspace Conversation
    const conversation = await Conversation.findOne({ project: project._id, isGroup: true });
    if (conversation) {
      const memberMap = new Map();
      conversation.members.forEach((m) => memberMap.set(m.user.toString(), m.roleName));

      if (project.client) memberMap.set(project.client.toString(), "client");
      if (project.assignedProjectManager) memberMap.set(project.assignedProjectManager.toString(), "project manager");
      if (project.assignedQATester) memberMap.set(project.assignedQATester.toString(), "qa tester");
      if (project.assignedTelecaller) memberMap.set(project.assignedTelecaller.toString(), "telecaller");
      if (Array.isArray(project.assignedDevelopers)) {
        project.assignedDevelopers.forEach((devId) => memberMap.set(devId.toString(), "developer"));
      }

      conversation.members = Array.from(memberMap.entries()).map(([userId, roleName]) => ({
        user: userId,
        roleName,
      }));
      await conversation.save();
    }

    // Audit Log
    await AuditLog.create({
      project: project._id,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "Admin",
      action: "TEAM_UPDATED",
      description: `Project team assignments updated by ${req.user.name}.`,
    });

    emitToProject(project._id.toString(), "project_team_updated", {
      projectId: project._id,
      updatedBy: req.user.name,
    });

    res.status(200).json({
      message: "Project team updated successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE LIFECYCLE STATUS
export const updateLifecycleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "NOT_STARTED",
      "PLANNING",
      "IN_PROGRESS",
      "ON_HOLD",
      "UNDER_REVIEW",
      "TESTING",
      "CLIENT_APPROVAL",
      "COMPLETED",
      "DELIVERED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid project status" });
    }

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const oldStatus = project.lifecycleStatus;
    project.lifecycleStatus = status;

    if (status === "DELIVERED") {
      project.actualDeliveryDate = new Date();
    }

    await project.save();

    // Audit Log
    await AuditLog.create({
      project: project._id,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "User",
      action: "STATUS_CHANGE",
      description: `Status changed from ${oldStatus} to ${status} by ${req.user.name}`,
    });

    emitToProject(project._id.toString(), "project_status_changed", {
      projectId: project._id,
      oldStatus,
      newStatus: status,
    });

    res.status(200).json({
      message: `Project status updated to ${status}`,
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD / UPDATE MILESTONES
export const addProjectMilestone = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate, amount } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.milestones.push({
      title,
      description,
      targetDate,
      amount: Number(amount) || 0,
      status: "PENDING",
    });

    await project.save();

    await AuditLog.create({
      project: project._id,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "User",
      action: "MILESTONE_ADDED",
      description: `New milestone '${title}' added by ${req.user.name}`,
    });

    res.status(200).json({
      message: "Milestone added successfully",
      data: project.milestones,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CLIENT SIGN-OFF / APPROVE MILESTONE
export const clientApproveMilestone = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const milestone = project.milestones.id(milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: "Milestone not found" });
    }

    milestone.clientApproval = true;
    milestone.clientApprovedAt = new Date();
    milestone.status = "APPROVED";
    milestone.approvedBy = req.user._id;

    await project.save();

    await AuditLog.create({
      project: project._id,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: "Client",
      action: "MILESTONE_APPROVED",
      description: `Milestone '${milestone.title}' approved & signed off by client ${req.user.name}`,
    });

    emitToProject(project._id.toString(), "milestone_approved", {
      projectId: project._id,
      milestoneId: milestone._id,
      title: milestone.title,
    });

    res.status(200).json({
      message: "Milestone signed off and approved successfully",
      data: milestone,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ATTACH DOCUMENT
export const uploadProjectDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, fileUrl, fileType, visibleToClient = true } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.documents.push({
      title,
      fileUrl,
      fileType,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
      visibleToClient,
    });

    await project.save();

    res.status(200).json({
      message: "Document uploaded successfully",
      data: project.documents,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
