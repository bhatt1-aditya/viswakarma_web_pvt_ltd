import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Project from "../models/project.model.js";
import ClientProfile from "../models/clientProfile.model.js";
import Conversation from "../models/conversation.model.js";
import Payment from "../models/payment.model.js";
import AuditLog from "../models/auditLog.model.js";
import Notification from "../models/notification.model.js";
import { generateClientId, generateProjectId, generateInvoiceNumber } from "../utils/idGenerator.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// TELECALLER SUBMIT DEAL FOR APPROVAL
export const submitDeal = async (req, res) => {
  try {
    const {
      leadId,
      name,
      phone,
      email,
      dealValue,
      advanceAmount = 0,
      projectScope,
      category = "Web Development",
      estimatedDays = 30,
      state,
      companyName,
    } = req.body;

    let lead = null;
    if (leadId) {
      try {
        lead = await Lead.findById(leadId);
      } catch {
        lead = null;
      }
    }

    if (!lead && phone) {
      lead = await Lead.findOne({ phone });
    }

    if (!lead) {
      lead = await Lead.create({
        name: name || "Valued Client",
        phone: phone || "9999999999",
        email: email || "",
        companyName: companyName || "",
        state: state || "All",
        requirement: projectScope || "",
        status: "DEAL_CONFIRMED",
        assignedTo: req.user._id,
        createdBy: req.user._id,
      });
    }

    lead.status = "DEAL_CONFIRMED";
    if (state) lead.state = state;
    if (companyName) lead.companyName = companyName;

    lead.dealDetails = {
      dealValue: Number(dealValue) || 0,
      advanceAmount: Number(advanceAmount) || 0,
      projectScope: projectScope || lead.requirement || "Client Software Project",
      category,
      estimatedDays: Number(estimatedDays) || 30,
      submittedBy: req.user._id,
      submittedAt: new Date(),
      status: "PENDING_APPROVAL",
    };

    // Add note to lead history
    lead.notes.push({
      text: `Deal confirmed by Telecaller ${req.user.name}. Submitted for Admin approval. Value: ₹${dealValue}, Advance: ₹${advanceAmount}`,
      callOutcome: "Deal Confirmed",
      createdBy: req.user._id,
      createdAt: new Date(),
    });

    await lead.save();

    // Notify all admins via in-app notification
    const adminRoles = await Role.find({ name: { $in: ["admin", "super admin", "superadmin"] } });
    const adminRoleIds = adminRoles.map((r) => r._id);
    const admins = await User.find({ role: { $in: adminRoleIds } });

    for (const admin of admins) {
      const notif = await Notification.create({
        recipient: admin._id,
        title: "New Deal Submitted for Approval",
        message: `${req.user.name} submitted a deal for ${lead.name} (${lead.companyName || "No Company"}) of ₹${dealValue}`,
        type: "DEAL_SUBMITTED",
        link: "/admin/deals",
      });
      emitToUser(admin._id.toString(), "new_notification", notif);
    }

    res.status(200).json({
      message: "Deal submitted successfully for Admin approval",
      data: lead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PENDING DEALS (ADMIN / SUPER ADMIN)
export const getPendingDeals = async (req, res) => {
  try {
    const deals = await Lead.find({ "dealDetails.status": "PENDING_APPROVAL" })
      .populate("dealDetails.submittedBy", "name email phone")
      .populate("assignedTo", "name email phone state")
      .sort({ "dealDetails.submittedAt": -1 });

    res.status(200).json({
      count: deals.length,
      data: deals,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL CONFIRMED & APPROVED DEALS
export const getAllDeals = async (req, res) => {
  try {
    const { status, state } = req.query;
    let query = {
      "dealDetails.status": { $in: ["PENDING_APPROVAL", "APPROVED", "REJECTED"] },
    };

    if (status && status !== "ALL") {
      query["dealDetails.status"] = status;
    }
    if (state && state !== "All") {
      query.state = state;
    }

    const deals = await Lead.find(query)
      .populate("dealDetails.submittedBy", "name email phone")
      .populate("dealDetails.approvedBy", "name email phone")
      .populate("dealDetails.createdClientUser", "name email phone clientId")
      .populate("dealDetails.createdProjectId", "name projectId lifecycleStatus")
      .populate("assignedTo", "name email phone state")
      .sort({ updatedAt: -1 });

    res.status(200).json({
      count: deals.length,
      data: deals,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN APPROVE DEAL -> CREATE CLIENT ACCOUNT & PROJECT AUTOMATICALLY
export const approveDeal = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { initialPassword } = req.body;

    const lead = await Lead.findById(leadId).populate("dealDetails.submittedBy");
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    if (lead.dealDetails?.status !== "PENDING_APPROVAL") {
      return res.status(400).json({ message: "Deal is not in pending approval status" });
    }

    // 1. Find or create Client Role
    let clientRole = await Role.findOne({ name: "client" });
    if (!clientRole) {
      clientRole = await Role.create({ name: "client" });
    }

    // 2. Generate unique Client ID
    const uniqueClientId = await generateClientId();

    // 3. Find or Create User Account
    let clientUser = await User.findOne({
      $or: [{ phone: lead.phone }, { email: lead.email ? lead.email.toLowerCase() : "" }],
    });

    const tempPassword = initialPassword || lead.phone || "Client@1234";

    if (!clientUser) {
      const email = lead.email && lead.email.trim() !== ""
        ? lead.email.toLowerCase().trim()
        : `${lead.phone}@client.vishwakarma.com`;

      clientUser = await User.create({
        name: lead.name,
        email,
        phone: lead.phone,
        password: tempPassword,
        role: clientRole._id,
        clientId: uniqueClientId,
        companyName: lead.companyName || lead.name,
        state: lead.state || "All",
        city: lead.city || "",
        isClient: true,
        isActivated: true,
        assignedTelecaller: lead.assignedTo || lead.dealDetails.submittedBy?._id,
        permissions: {
          sidebar: {
            dashboard: true,
            clientPortal: true,
            telecaller: false,
            websiteControl: false,
            staff: false,
            leads: false,
            projects: false,
          },
        },
      });
    } else {
      // User exists, link client details and ensure credentials match tempPassword
      clientUser.isClient = true;
      clientUser.isActivated = true;
      clientUser.password = tempPassword;
      if (!clientUser.clientId) clientUser.clientId = uniqueClientId;
      if (lead.companyName) clientUser.companyName = lead.companyName;
      if (lead.state) clientUser.state = lead.state;
      clientUser.role = clientRole._id;
      if (!clientUser.permissions) clientUser.permissions = {};
      if (!clientUser.permissions.sidebar) clientUser.permissions.sidebar = {};
      clientUser.permissions.sidebar.clientPortal = true;
      clientUser.permissions.sidebar.dashboard = true;
      await clientUser.save();
    }

    // 4. Create or Update Client Profile
    let clientProfile = await ClientProfile.findOne({ user: clientUser._id });
    if (!clientProfile) {
      clientProfile = await ClientProfile.create({
        user: clientUser._id,
        clientId: clientUser.clientId || uniqueClientId,
        companyName: clientUser.companyName || lead.name,
        state: lead.state || "All",
        city: lead.city || "",
        assignedTelecaller: lead.assignedTo || lead.dealDetails.submittedBy?._id,
        leadSource: lead._id,
        notes: `Created from approved deal. Scope: ${lead.dealDetails?.projectScope || "N/A"}`,
      });
    }

    // 5. Generate unique Project ID & Create Project Workspace
    const uniqueProjectId = await generateProjectId();
    const projectName = lead.companyName
      ? `${lead.companyName} - Solution (${uniqueProjectId})`
      : `${lead.name} - Project (${uniqueProjectId})`;

    const project = await Project.create({
      name: projectName,
      projectId: uniqueProjectId,
      client: clientUser._id,
      category: lead.dealDetails.category || "Web Development",
      description: lead.dealDetails.projectScope || lead.requirement || "Custom Software Implementation",
      requirements: [lead.dealDetails.projectScope || lead.requirement || "Initial client requirements"],
      assignedTelecaller: lead.assignedTo || lead.dealDetails.submittedBy?._id,
      contractAmount: lead.dealDetails.dealValue || 0,
      advancePaid: lead.dealDetails.advanceAmount || 0,
      lifecycleStatus: "PLANNING",
      milestones: [
        {
          title: "Phase 1: Project Kickoff & SRS Approval",
          description: "System architecture, requirements sign-off, design wireframes.",
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          amount: Math.round((lead.dealDetails.dealValue || 0) * 0.3),
          status: "IN_PROGRESS",
        },
        {
          title: "Phase 2: Core Development & Alpha Testing",
          description: "Frontend components, backend APIs, database integration.",
          targetDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          amount: Math.round((lead.dealDetails.dealValue || 0) * 0.4),
          status: "PENDING",
        },
        {
          title: "Phase 3: QA Retesting, Client Review & Deployment",
          description: "UAT, bug fixing, deployment to production domain.",
          targetDate: new Date(Date.now() + (lead.dealDetails.estimatedDays || 30) * 24 * 60 * 60 * 1000),
          amount: Math.round((lead.dealDetails.dealValue || 0) * 0.3),
          status: "PENDING",
        },
      ],
    });

    // 6. Create Workspace Group Chat Conversation
    const conversation = await Conversation.create({
      project: project._id,
      name: `${project.name} Workspace Group`,
      isGroup: true,
      members: [
        { user: clientUser._id, roleName: "client" },
        { user: req.user._id, roleName: "admin" },
      ],
    });

    if (lead.assignedTo) {
      conversation.members.push({ user: lead.assignedTo, roleName: "telecaller" });
      await conversation.save();
    }

    // 7. If Advance paid > 0, generate Invoice record
    if (lead.dealDetails.advanceAmount > 0) {
      const invoiceNo = await generateInvoiceNumber();
      await Payment.create({
        project: project._id,
        client: clientUser._id,
        invoiceNumber: invoiceNo,
        title: "Initial Advance Payment (Deal Booking)",
        amount: lead.dealDetails.advanceAmount,
        status: "PAID",
        paidAt: new Date(),
        paymentMethod: "Bank Transfer",
        notes: "Advance payment collected at deal confirmation",
      });
    }

    // 8. Update Lead Status
    lead.dealDetails.status = "APPROVED";
    lead.dealDetails.approvedBy = req.user._id;
    lead.dealDetails.approvedAt = new Date();
    lead.dealDetails.createdClientId = clientUser.clientId;
    lead.dealDetails.createdClientUser = clientUser._id;
    lead.dealDetails.createdProjectId = project._id;
    lead.status = "DEAL_CONFIRMED";

    lead.notes.push({
      text: `Deal approved by Admin ${req.user.name}. Generated Client ID: ${clientUser.clientId}, Project ID: ${project.projectId}`,
      callOutcome: "Deal Approved",
      createdBy: req.user._id,
      createdAt: new Date(),
    });

    await lead.save();

    // 9. Create Immutable Audit Log
    await AuditLog.create({
      project: project._id,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: "Admin",
      action: "DEAL_APPROVED",
      description: `Admin approved deal for ${clientUser.name}. Created Project ${project.projectId}.`,
      metadata: { clientId: clientUser.clientId, contractAmount: project.contractAmount },
    });

    // 10. Notify Telecaller who submitted the deal
    const submitterId = lead.dealDetails?.submittedBy?._id || lead.dealDetails?.submittedBy;
    if (submitterId) {
      const telecallerNotif = await Notification.create({
        recipient: submitterId,
        title: "Deal Approved!",
        message: `Your deal for ${lead.name} has been approved by ${req.user.name}. Project: ${project.projectId}`,
        type: "DEAL_APPROVED",
        link: `/admin/projects/${project._id}`,
      });
      emitToUser(submitterId.toString(), "new_notification", telecallerNotif);
    }

    res.status(200).json({
      message: "Deal approved successfully! Client account and Project workspace initialized.",
      data: {
        client: {
          id: clientUser._id,
          name: clientUser.name,
          email: clientUser.email,
          phone: clientUser.phone,
          clientId: clientUser.clientId,
          tempPassword,
        },
        project: {
          id: project._id,
          projectId: project.projectId,
          name: project.name,
          lifecycleStatus: project.lifecycleStatus,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADMIN REJECT DEAL
export const rejectDeal = async (req, res) => {
  try {
    const { leadId } = req.params;
    const { rejectionReason } = req.body;

    const lead = await Lead.findById(leadId).populate("dealDetails.submittedBy");
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.dealDetails.status = "REJECTED";
    lead.dealDetails.rejectionReason = rejectionReason || "Deal parameters not approved";
    lead.dealDetails.approvedBy = req.user._id;
    lead.dealDetails.approvedAt = new Date();
    lead.status = "NEGOTIATION"; // Revert back to negotiation

    lead.notes.push({
      text: `Deal rejected by Admin ${req.user.name}. Reason: ${lead.dealDetails.rejectionReason}`,
      callOutcome: "Deal Rejected",
      createdBy: req.user._id,
      createdAt: new Date(),
    });

    await lead.save();

    const submitterId = lead.dealDetails?.submittedBy?._id || lead.dealDetails?.submittedBy;
    if (submitterId) {
      const telecallerNotif = await Notification.create({
        recipient: submitterId,
        title: "Deal Rejected",
        message: `Deal for ${lead.name} was rejected: ${lead.dealDetails.rejectionReason}`,
        type: "DEAL_REJECTED",
        link: "/admin/telecaller",
      });
      emitToUser(submitterId.toString(), "new_notification", telecallerNotif);
    }

    res.status(200).json({
      message: "Deal rejected and returned to negotiation.",
      data: lead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
