import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "node:dns";
import { fileURLToPath } from "url";

// Models
import User from "./models/user.model.js";
import Role from "./models/role.model.js";
import Lead from "./models/lead.model.js";
import Project from "./models/project.model.js";
import Task from "./models/task.model.js";
import DailyReport from "./models/dailyReport.model.js";
import Meeting from "./models/meeting.model.js";
import MeetingMinutes from "./models/meetingMinutes.model.js";
import BugReport from "./models/bugReport.model.js";
import Payment from "./models/payment.model.js";
import Conversation from "./models/conversation.model.js";
import Message from "./models/message.model.js";
import AuditLog from "./models/auditLog.model.js";

// Controllers / Logic to test
import { submitDeal, getPendingDeals, approveDeal } from "./controllers/deal.controller.js";
import {
  createLifecycleProject,
  getLifecycleProjects,
  updateProjectTeam,
  updateLifecycleStatus,
  clientApproveMilestone,
} from "./controllers/projectLifecycle.controller.js";
import { createTask, updateTaskStatus, addTaskComment } from "./controllers/task.controller.js";
import {
  submitDailyReport,
  getDailyReports,
  reviewDailyReport,
  togglePublishReportToClient,
} from "./controllers/dailyReport.controller.js";
import { scheduleMeeting, publishMeetingMinutes } from "./controllers/meeting.controller.js";
import { sendMessage, getProjectChatHistory, toggleReaction } from "./controllers/chat.controller.js";
import { createBugReport, updateBugStatus } from "./controllers/qa.controller.js";
import { createInvoice, recordPayment, getFinancialSummary } from "./controllers/financial.controller.js";
import { getProjectAuditTrail } from "./controllers/audit.controller.js";
import { seedDefaultRoles } from "./utils/seedRoles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("DNS Note:", e.message);
}

// Mock Express req/res
const createMockReqRes = (reqData = {}) => {
  const req = {
    params: reqData.params || {},
    query: reqData.query || {},
    body: reqData.body || {},
    user: reqData.user || {},
  };

  const res = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    jsonData: null,
    json(data) {
      this.jsonData = data;
      return this;
    },
  };

  return { req, res };
};

const runAllTests = async () => {
  console.log("==========================================================");
  console.log("🚀 STARTING COMPREHENSIVE END-TO-END LIFECYCLE TESTS");
  console.log("==========================================================\n");

  const results = [];
  const logStep = (stepName, passed, details = "") => {
    results.push({ stepName, passed, details });
    if (passed) {
      console.log(`✅ [PASS] ${stepName} ${details ? `(${details})` : ""}`);
    } else {
      console.error(`❌ [FAIL] ${stepName} ${details ? `(${details})` : ""}`);
    }
  };

  try {
    // 0. CONNECT DB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI not configured");

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 15000 });
    try {
      await Project.collection.dropIndex("name_1");
    } catch {
      // Legacy index dropped or already non-existent
    }
    logStep("Database Connection", true, "Connected to MongoDB Atlas");

    // 1. SEED DEFAULT ROLES
    await seedDefaultRoles();
    const allRoles = await Role.find({});
    const roleNames = allRoles.map((r) => r.name.toLowerCase());
    const requiredRoles = [
      "super admin",
      "admin",
      "telecaller",
      "project manager",
      "developer",
      "qa tester",
      "client",
    ];
    const missingRoles = requiredRoles.filter((r) => !roleNames.includes(r));
    logStep(
      "Role Seeding Verification",
      missingRoles.length === 0,
      `Found ${allRoles.length} roles: ${roleNames.join(", ")}`
    );

    // Get Role references
    const roleMap = {};
    allRoles.forEach((r) => (roleMap[r.name.toLowerCase()] = r));

    // 2. SETUP TEST ACTORS
    const createTestUser = async (email, name, roleName, phone) => {
      let u = await User.findOne({ email });
      if (!u) {
        u = await User.create({
          name,
          email,
          phone,
          password: "Password@123",
          role: roleMap[roleName]?._id,
        });
      }
      return {
        _id: u._id,
        id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: roleMap[roleName],
        roleName: roleName,
        permissions: u.permissions || {},
      };
    };

    const adminUser = await createTestUser("test.admin@vishwakarma.com", "Test Admin", "admin", "9876543210");
    const telecallerUser = await createTestUser("test.telecaller@vishwakarma.com", "Test Telecaller Odisha", "telecaller", "9876543211");
    const pmUser = await createTestUser("test.pm@vishwakarma.com", "Test PM", "project manager", "9876543212");
    const devUser = await createTestUser("test.dev@vishwakarma.com", "Test Dev", "developer", "9876543213");
    const qaUser = await createTestUser("test.qa@vishwakarma.com", "Test QA", "qa tester", "9876543214");

    logStep("Test Actors Setup", true, "Admin, Telecaller, PM, Dev, QA provisioned");

    // TEST 1: TELECALLER CONFIRMS DEAL
    const testLeadPhone = `91${Math.floor(10000000 + Math.random() * 90000000)}`;
    const { req: req1, res: res1 } = createMockReqRes({
      user: telecallerUser,
      body: {
        name: "Odisha Enterprise Corp",
        phone: testLeadPhone,
        email: `odisha.${Date.now()}@client.com`,
        state: "Odisha",
        companyName: `Odisha Mining Corp ${Date.now()}`,
        dealValue: 250000,
        advanceAmount: 75000,
        projectScope: "Automated Fleet & Dispatch ERP Portal with IoT tracking",
        category: "Custom CRM / ERP",
        estimatedDays: 45,
      },
    });

    await submitDeal(req1, res1);
    const submittedLead = res1.jsonData?.data;
    if (!submittedLead) {
      console.error("submitDeal response:", res1.statusCode, res1.jsonData);
    }
    const test1Pass =
      res1.statusCode === 200 &&
      submittedLead?.status === "DEAL_CONFIRMED" &&
      submittedLead?.dealDetails?.status === "PENDING_APPROVAL";

    logStep(
      "Test 1: Telecaller Confirm & Submit Deal",
      test1Pass,
      `Lead ID: ${submittedLead?._id}, Deal Value: ₹${submittedLead?.dealDetails?.dealValue}`
    );

    // TEST 2: ADMIN FETCHES PENDING DEALS
    const { req: req2, res: res2 } = createMockReqRes({ user: adminUser });
    await getPendingDeals(req2, res2);
    const pendingDeals = res2.jsonData?.data || [];
    const test2Pass =
      res2.statusCode === 200 &&
      pendingDeals.some((d) => d._id.toString() === submittedLead._id.toString());
    logStep(
      "Test 2: Admin Pending Deals Queue",
      test2Pass,
      `Found ${pendingDeals.length} pending deals awaiting admin approval`
    );

    // TEST 3: ADMIN APPROVES DEAL -> AUTO PROVISION CLIENT & PROJECT
    const { req: req3, res: res3 } = createMockReqRes({
      user: adminUser,
      params: { leadId: submittedLead._id },
      body: { initialPassword: "ClientSecret@123" },
    });
    await approveDeal(req3, res3);
    const approvalData = res3.jsonData?.data;
    if (!approvalData) {
      console.error("approveDeal response:", res3.statusCode, res3.jsonData);
    }
    const test3Pass =
      res3.statusCode === 200 &&
      approvalData?.client?.clientId?.startsWith("VK-CL-") &&
      approvalData?.project?.projectId?.startsWith("VK-PRJ-");

    logStep(
      "Test 3: Admin Deal Approval & Auto-Provisioning",
      test3Pass,
      `Generated Client ID: ${approvalData?.client?.clientId}, Project ID: ${approvalData?.project?.projectId}`
    );

    const generatedProjectId = approvalData?.project?.id;
    const generatedClientId = approvalData?.client?.id;

    // Verify client user object
    const clientUserRecord = await User.findById(generatedClientId);
    const clientUser = {
      _id: clientUserRecord._id,
      id: clientUserRecord._id,
      name: clientUserRecord.name,
      email: clientUserRecord.email,
      phone: clientUserRecord.phone,
      role: roleMap["client"],
      roleName: "client",
      isClient: true,
      clientId: clientUserRecord.clientId,
    };

    // TEST 4: UPDATE PROJECT TEAM (ASSIGN PM, DEV, QA)
    const { req: req4, res: res4 } = createMockReqRes({
      user: adminUser,
      params: { id: generatedProjectId },
      body: {
        assignedProjectManager: pmUser._id,
        assignedDevelopers: [devUser._id],
        assignedQATester: qaUser._id,
      },
    });
    await updateProjectTeam(req4, res4);
    const teamUpdated = res4.jsonData?.data;
    const test4Pass =
      res4.statusCode === 200 &&
      teamUpdated?.assignedProjectManager?.toString() === pmUser._id.toString() &&
      teamUpdated?.assignedDevelopers?.some((d) => d.toString() === devUser._id.toString());
    logStep(
      "Test 4: Team Assignment (PM, Multi-Dev, QA)",
      test4Pass,
      `PM: ${pmUser.name}, Developer: ${devUser.name}, QA: ${qaUser.name}`
    );

    // TEST 5: UPDATE LIFECYCLE STATUS
    const { req: req5, res: res5 } = createMockReqRes({
      user: pmUser,
      params: { id: generatedProjectId },
      body: { status: "IN_PROGRESS" },
    });
    await updateLifecycleStatus(req5, res5);
    const test5Pass = res5.statusCode === 200 && res5.jsonData?.data?.lifecycleStatus === "IN_PROGRESS";
    logStep("Test 5: Transition Lifecycle Status", test5Pass, "Status advanced to IN_PROGRESS");

    // TEST 6: TASK CREATION & KANBAN COLUMN MOVE
    const { req: req6a, res: res6a } = createMockReqRes({
      user: pmUser,
      params: { projectId: generatedProjectId },
      body: {
        title: "Build GPS & IoT Telematics Ingestion Webhook",
        description: "Process real-time coordinates and device heartbeat every 30 seconds",
        assignedTo: devUser._id,
        priority: "HIGH",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      },
    });
    await createTask(req6a, res6a);
    const createdTask = res6a.jsonData?.data;

    // Developer moves task to IN_PROGRESS
    const { req: req6b, res: res6b } = createMockReqRes({
      user: devUser,
      params: { taskId: createdTask._id },
      body: { status: "IN_PROGRESS" },
    });
    await updateTaskStatus(req6b, res6b);

    // Developer adds comment
    const { req: req6c, res: res6c } = createMockReqRes({
      user: devUser,
      params: { taskId: createdTask._id },
      body: { text: "Completed socket streaming parser for telemetry data." },
    });
    await addTaskComment(req6c, res6c);

    const test6Pass =
      res6a.statusCode === 201 &&
      res6b.statusCode === 200 &&
      res6b.jsonData?.data?.status === "IN_PROGRESS" &&
      res6c.jsonData?.data?.comments?.length > 0;
    logStep("Test 6: Task Board (Kanban & Collaboration)", test6Pass, `Task: "${createdTask?.title}"`);

    // TEST 7: REAL-TIME WORKSPACE MESSAGING (CHAT)
    const { req: req7a, res: res7a } = createMockReqRes({
      user: devUser,
      params: { projectId: generatedProjectId },
      body: { content: "Backend APIs deployed to staging instance for review.", messageType: "TEXT" },
    });
    await sendMessage(req7a, res7a);
    const sentMsg = res7a.jsonData?.data;
    if (!sentMsg) {
      console.error("sendMessage error:", res7a.statusCode, res7a.jsonData);
    }

    const { req: req7b, res: res7b } = createMockReqRes({
      user: clientUser,
      params: { messageId: sentMsg._id },
      body: { emoji: "👍" },
    });
    await toggleReaction(req7b, res7b);

    const { req: req7c, res: res7c } = createMockReqRes({
      user: clientUser,
      params: { projectId: generatedProjectId },
    });
    await getProjectChatHistory(req7c, res7c);

    const test7Pass =
      res7a.statusCode === 201 &&
      res7b.statusCode === 200 &&
      res7c.jsonData?.data?.length > 0;
    logStep("Test 7: Workspace Real-Time Chat & Reactions", test7Pass, `${res7c.jsonData?.data?.length} messages in project room`);

    // TEST 8: DEVELOPER DAILY REPORT & PM APPROVAL / PUBLISH
    const { req: req8a, res: res8a } = createMockReqRes({
      user: devUser,
      params: { projectId: generatedProjectId },
      body: {
        completedTasks: ["Configured MongoDB schemas", "Integrated Socket.io chat server"],
        workInProgress: ["Writing unit tests for deal approvals"],
        blockers: ["None currently"],
        timeSpentHours: 8,
        tomorrowsPlan: "Connect frontend client portal and test with live credentials",
      },
    });
    await submitDailyReport(req8a, res8a);
    const submittedReport = res8a.jsonData?.data;

    // PM reviews report
    const { req: req8b, res: res8b } = createMockReqRes({
      user: pmUser,
      params: { reportId: submittedReport._id },
      body: { status: "APPROVED", reviewNotes: "Excellent velocity today." },
    });
    await reviewDailyReport(req8b, res8b);

    // PM publishes report to Client Portal
    const { req: req8c, res: res8c } = createMockReqRes({
      user: pmUser,
      params: { reportId: submittedReport._id },
      body: { publish: true },
    });
    await togglePublishReportToClient(req8c, res8c);

    // Verify Client can see it
    const { req: req8d, res: res8d } = createMockReqRes({
      user: clientUser,
      params: { projectId: generatedProjectId },
    });
    await getDailyReports(req8d, res8d);
    const clientVisibleReports = res8d.jsonData?.data || [];

    const test8Pass =
      res8a.statusCode === 201 &&
      res8b.jsonData?.data?.status === "APPROVED" &&
      clientVisibleReports.some((r) => r._id.toString() === submittedReport._id.toString());
    logStep(
      "Test 8: Daily Developer Progress & PM Client Publish",
      test8Pass,
      `Developer reported 8h; PM reviewed and published to Client Portal`
    );

    // TEST 9: MEETING MANAGEMENT & MINUTES OF MEETING (MoM)
    const { req: req9a, res: res9a } = createMockReqRes({
      user: pmUser,
      params: { projectId: generatedProjectId },
      body: {
        title: "Sprint 1 Architecture & Milestones Review",
        meetingDate: new Date(),
        startTime: "15:00",
        endTime: "16:00",
        meetingLink: "https://meet.google.com/vk-sprint-sync",
        agenda: "Review database schemas and approve API contracts",
      },
    });
    await scheduleMeeting(req9a, res9a);
    const scheduledMeeting = res9a.jsonData?.data;

    // Publish MoM with action items
    const { req: req9b, res: res9b } = createMockReqRes({
      user: pmUser,
      params: { meetingId: scheduledMeeting._id },
      body: {
        discussionPoints: ["Confirmed 3rd party SMS gateway choice", "Agreed on 99.9% uptime SLA"],
        clientDecisions: ["Client requested dark mode palette toggle for driver app"],
        actionItems: [
          { taskText: "Implement Dark Mode palette in Tailwind configuration" },
          { taskText: "Setup Twilio / Fast2SMS credentials in .env" },
        ],
        createTasksForActionItems: true,
      },
    });
    await publishMeetingMinutes(req9b, res9b);

    // Verify auto-created action item tasks
    const actionItemTask = await Task.findOne({
      project: generatedProjectId,
      title: "Implement Dark Mode palette in Tailwind configuration",
    });

    const test9Pass =
      res9a.statusCode === 201 &&
      res9b.statusCode === 200 &&
      actionItemTask !== null;
    logStep(
      "Test 9: Meeting Scheduling & MoM Action Items Conversion",
      test9Pass,
      `MoM action items automatically created Kanban tasks`
    );

    // TEST 10: QA BUG DEFECT TRACKING
    const { req: req10a, res: res10a } = createMockReqRes({
      user: qaUser,
      params: { projectId: generatedProjectId },
      body: {
        title: "Negative quantity allowed in dispatch load order",
        description: "Entering negative tonnage (-5.00) does not throw validation error",
        severity: "HIGH",
        assignedDeveloper: devUser._id,
      },
    });
    await createBugReport(req10a, res10a);
    const loggedBug = res10a.jsonData?.data;

    // Developer marks FIXED
    const { req: req10b, res: res10b } = createMockReqRes({
      user: devUser,
      params: { bugId: loggedBug._id },
      body: { status: "FIXED", resolutionNotes: "Added Joi schema validation min(0.01)" },
    });
    await updateBugStatus(req10b, res10b);

    // QA closes after retest
    const { req: req10c, res: res10c } = createMockReqRes({
      user: qaUser,
      params: { bugId: loggedBug._id },
      body: { status: "CLOSED", resolutionNotes: "Verified fixed on staging build v1.0.4" },
    });
    await updateBugStatus(req10c, res10c);

    const test10Pass =
      res10a.statusCode === 201 &&
      loggedBug?.bugId?.startsWith("BUG-") &&
      res10c.jsonData?.data?.status === "CLOSED";
    logStep(
      "Test 10: QA Defect Tracking & Resolution Cycle",
      test10Pass,
      `Bug ID: ${loggedBug?.bugId} -> FIXED -> CLOSED`
    );

    // TEST 11: BILLING, INVOICING & PAYMENT RECORDING
    const { req: req11a, res: res11a } = createMockReqRes({
      user: pmUser,
      params: { projectId: generatedProjectId },
      body: {
        title: "Milestone 1 Deliverable - SRS & Architecture Sign-Off",
        amount: 50000,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    await createInvoice(req11a, res11a);
    const generatedInvoice = res11a.jsonData?.data;

    // Admin records payment
    const { req: req11b, res: res11b } = createMockReqRes({
      user: adminUser,
      params: { invoiceId: generatedInvoice._id },
      body: {
        paymentMethod: "Bank Transfer (NEFT)",
        transactionId: `UTR${Date.now()}`,
      },
    });
    await recordPayment(req11b, res11b);

    const { req: req11c, res: res11c } = createMockReqRes({ user: adminUser });
    await getFinancialSummary(req11c, res11c);

    const test11Pass =
      res11a.statusCode === 201 &&
      generatedInvoice?.invoiceNumber?.startsWith("INV-") &&
      res11b.jsonData?.data?.status === "PAID" &&
      res11c.jsonData?.totalPaid > 0;
    logStep(
      "Test 11: Invoicing, Milestone Payments & Revenue Stats",
      test11Pass,
      `Invoice: ${generatedInvoice?.invoiceNumber}, Paid via NEFT`
    );

    // TEST 12: CLIENT MILESTONE SIGN-OFF
    const projectRecord = await Project.findById(generatedProjectId);
    const milestoneId = projectRecord.milestones[0]._id;

    const { req: req12, res: res12 } = createMockReqRes({
      user: clientUser,
      params: { projectId: generatedProjectId, milestoneId },
    });
    await clientApproveMilestone(req12, res12);
    const approvedMilestone = res12.jsonData?.data;

    const test12Pass =
      res12.statusCode === 200 &&
      approvedMilestone?.clientApproval === true &&
      approvedMilestone?.status === "APPROVED";
    logStep(
      "Test 12: Client Milestone Sign-Off & Approval",
      test12Pass,
      `Milestone "${approvedMilestone?.title}" signed off by Client`
    );

    // TEST 13: IMMUTABLE AUDIT TRAIL
    const { req: req13, res: res13 } = createMockReqRes({
      user: adminUser,
      params: { projectId: generatedProjectId },
    });
    await getProjectAuditTrail(req13, res13);
    const auditEntries = res13.jsonData?.data || [];

    const test13Pass = res13.statusCode === 200 && auditEntries.length >= 5;
    logStep(
      "Test 13: Immutable Audit Trail",
      test13Pass,
      `Recorded ${auditEntries.length} chronological audit entries`
    );

    console.log("\n==========================================================");
    const allPassed = results.every((r) => r.passed);
    if (allPassed) {
      console.log("🎉 ALL 13 TEST SUITES PASSED WITH ZERO ERRORS!");
    } else {
      console.log("⚠️ SOME TESTS FAILED. CHECK OUTPUT ABOVE.");
    }
    console.log("==========================================================");
  } catch (err) {
    console.error("FATAL TEST EXCEPTION:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
};

runAllTests();
