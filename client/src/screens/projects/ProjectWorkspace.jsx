import React, { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import {
  FolderGit2,
  Clock,
  Send,
  Video,
  DollarSign,
  ShieldAlert,
  History,
  CheckSquare,
  ArrowLeft,
  Plus,
  Eye,
  EyeOff,
  Users,
  UserCheck,
  Mail,
  Phone,
  Edit3,
  X,
  Check,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import API_BASE_URL from "../../utils/apiConfig";

const TABS = [
  { id: "overview", label: "Overview", icon: FolderGit2 },
  { id: "tasks", label: "Tasks (Kanban)", icon: CheckSquare },
  { id: "chat", label: "Team Chat", icon: Send },
  { id: "reports", label: "Daily Reports", icon: Clock },
  { id: "meetings", label: "Meetings & MoM", icon: Video },
  { id: "qa", label: "QA Bug Tracker", icon: ShieldAlert },
  { id: "financials", label: "Invoices & Billing", icon: DollarSign },
  { id: "audit", label: "Audit Trail", icon: History },
];

const ProjectWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isPM, isAdmin, isSuperAdmin, isDeveloper } = useAuth();
  const { socket, joinProject, leaveProject } = useSocket();

  const [activeTab, setActiveTab] = useState("overview");
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tab Data States
  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dailyReports, setDailyReports] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Chat Input State
  const [chatInput, setChatInput] = useState("");
  const [typingUsers, setTypingUsers] = useState(new Set());
  const chatBottomRef = useRef(null);

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskDev, setNewTaskDev] = useState("");
  const [newTaskPriority] = useState("MEDIUM");
  const [newTaskDeadline] = useState("");

  const [meetingModalOpen, setMeetingModalOpen] = useState(false);
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingDate, setNewMeetingDate] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newMeetingLink, setNewMeetingLink] = useState("");
  const [newMeetingAgenda, setNewMeetingAgenda] = useState("");
  const [sendMeetingWhatsApp, setSendMeetingWhatsApp] = useState(true);

  const [momModalOpen, setMomModalOpen] = useState(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState("");
  const [momPoints, setMomPoints] = useState("");
  const [momDecisions, setMomDecisions] = useState("");
  const [momActionItems, setMomActionItems] = useState("");

  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invTitle, setInvTitle] = useState("");
  const [invAmount, setInvAmount] = useState("");
  const [sendInvoiceWhatsApp, setSendInvoiceWhatsApp] = useState(true);

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [repCompleted, setRepCompleted] = useState("");
  const [repWip, setRepWip] = useState("");
  const [repBlockers, setRepBlockers] = useState("");
  const [repHours] = useState(8);
  const [repTomorrow] = useState("");

  const [bugModalOpen, setBugModalOpen] = useState(false);
  const [bugTitle, setBugTitle] = useState("");
  const [bugDesc, setBugDesc] = useState("");
  const [bugSteps] = useState("");
  const [bugSeverity, setBugSeverity] = useState("MEDIUM");

  // Team Assignment Modal State
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [availableStaff, setAvailableStaff] = useState([]);
  const [selectedPM, setSelectedPM] = useState("");
  const [selectedQA, setSelectedQA] = useState("");
  const [selectedTelecaller, setSelectedTelecaller] = useState("");
  const [selectedDevs, setSelectedDevs] = useState([]);
  const [sendTeamWhatsApp, setSendTeamWhatsApp] = useState(true);
  const [savingTeam, setSavingTeam] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(false);

  // Lock background page scroll while any modal is open
  useEffect(() => {
    if (
      !teamModalOpen &&
      !meetingModalOpen &&
      !invoiceModalOpen &&
      !taskModalOpen &&
      !momModalOpen &&
      !bugModalOpen &&
      !reportModalOpen
    ) {
      return;
    }
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [
    teamModalOpen,
    meetingModalOpen,
    invoiceModalOpen,
    taskModalOpen,
    momModalOpen,
    bugModalOpen,
    reportModalOpen,
  ]);

  const fetchProjectDetails = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.get(`${API_BASE_URL}/lifecycle-projects/${id}`, { headers });
      setProject(res.data.data);

      // Fetch Sub-resources in parallel
      const [tasksRes, chatRes, reportsRes, meetingsRes, bugsRes, invRes, auditRes] =
        await Promise.all([
          axios.get(`${API_BASE_URL}/tasks/project/${id}`, { headers }),
          axios.get(`${API_BASE_URL}/chat/project/${id}`, { headers }),
          axios.get(`${API_BASE_URL}/daily-reports/project/${id}`, { headers }),
          axios.get(`${API_BASE_URL}/meetings/project/${id}`, { headers }),
          axios.get(`${API_BASE_URL}/qa/project/${id}`, { headers }),
          axios.get(`${API_BASE_URL}/financial/project/${id}`, { headers }),
          axios.get(`${API_BASE_URL}/audit/project/${id}`, { headers }),
        ]);

      setTasks(tasksRes.data.data || []);
      setMessages(chatRes.data.data || []);
      setDailyReports(reportsRes.data.data || []);
      setMeetings(meetingsRes.data.data || []);
      setBugs(bugsRes.data.data || []);
      setInvoices(invRes.data.data || []);
      setAuditLogs(auditRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load project workspace");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch Project & Setup
  useEffect(() => {
    fetchProjectDetails();
    joinProject(id);

    return () => {
      leaveProject(id);
    };
  }, [id, joinProject, leaveProject, fetchProjectDetails]);

  // Socket Real-time listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    socket.on("task_created", (task) => {
      setTasks((prev) => [task, ...prev]);
    });

    socket.on("task_status_changed", ({ taskId, newStatus }) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    });

    socket.on("project_status_changed", ({ newStatus }) => {
      setProject((prev) => (prev ? { ...prev, lifecycleStatus: newStatus } : prev));
      toast.success(`Project moved to ${newStatus}`);
    });

    socket.on("user_typing", ({ userId, userName, isTyping }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        if (isTyping && userId !== user?._id) next.add(userName);
        else next.delete(userName);
        return next;
      });
    });

    return () => {
      socket.off("new_message");
      socket.off("task_created");
      socket.off("task_status_changed");
      socket.off("project_status_changed");
      socket.off("user_typing");
    };
  }, [socket, user?._id]);

  // Status Change (Admin / PM)
  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/lifecycle-projects/${id}/status`,
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setProject((prev) => ({ ...prev, lifecycleStatus: newStatus }));
      toast.success(`Project status changed to ${newStatus}`);
    } catch {
      toast.error("Failed to update project status");
    }
  };

  // Send Chat Message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      const token = localStorage.getItem("token");
      const content = chatInput;
      setChatInput("");

      if (socket) {
        socket.emit("typing_stop", { projectId: id });
      }

      await axios.post(
        `${API_BASE_URL}/chat/project/${id}`,
        { content, messageType: "TEXT" },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
    } catch {
      toast.error("Failed to send message");
    }
  };

  // Create Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/tasks/project/${id}`,
        {
          title: newTaskTitle,
          description: newTaskDesc,
          assignedTo: newTaskDev || undefined,
          priority: newTaskPriority,
          deadline: newTaskDeadline || undefined,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Task created successfully!");
      setTaskModalOpen(false);
      setNewTaskTitle("");
      setNewTaskDesc("");
      fetchProjectDetails();
    } catch {
      toast.error("Failed to create task");
    }
  };

  // Move Task Column
  const handleMoveTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/tasks/${taskId}/status`,
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch {
      toast.error("Failed to move task");
    }
  };

  // Schedule Meeting
  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/meetings/project/${id}`,
        {
          title: newMeetingTitle,
          meetingDate: newMeetingDate,
          startTime: newMeetingTime,
          meetingLink: newMeetingLink,
          agenda: newMeetingAgenda,
          sendWhatsApp: sendMeetingWhatsApp,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (sendMeetingWhatsApp) {
        if (res.data?.whatsappSent) {
          toast.success(`Meeting scheduled & WhatsApp sent (${res.data.whatsappSentCount})!`);
        } else {
          toast.success("Meeting scheduled (no WhatsApp notifications sent).");
        }
      } else {
        toast.success("Meeting scheduled!");
      }
      setMeetingModalOpen(false);
      setNewMeetingTitle("");
      setNewMeetingDate("");
      setNewMeetingTime("");
      setNewMeetingLink("");
      setNewMeetingAgenda("");
      setSendMeetingWhatsApp(true);
      fetchProjectDetails();
    } catch {
      toast.error("Failed to schedule meeting");
    }
  };

  // Publish MoM
  const handlePublishMom = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const actionItemsArray = momActionItems
        .split("\n")
        .filter(Boolean)
        .map((text) => ({ taskText: text.trim() }));

      await axios.post(
        `${API_BASE_URL}/meetings/${selectedMeetingId}/minutes`,
        {
          discussionPoints: momPoints.split("\n").filter(Boolean),
          clientDecisions: momDecisions.split("\n").filter(Boolean),
          actionItems: actionItemsArray,
          createTasksForActionItems: true,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Minutes of Meeting published & tasks generated!");
      setMomModalOpen(false);
      fetchProjectDetails();
    } catch {
      toast.error("Failed to publish Minutes of Meeting");
    }
  };

  // Submit Daily Report
  const handleSubmitReport = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/daily-reports/project/${id}`,
        {
          completedTasks: repCompleted,
          workInProgress: repWip,
          blockers: repBlockers,
          timeSpentHours: repHours,
          tomorrowsPlan: repTomorrow,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Daily report submitted to PM!");
      setReportModalOpen(false);
      fetchProjectDetails();
    } catch {
      toast.error("Failed to submit daily report");
    }
  };

  // Toggle Publish Daily Report to Client (PM / Admin)
  const handleTogglePublishReport = async (reportId, currentPublishStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/daily-reports/${reportId}/publish`,
        { publish: !currentPublishStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setDailyReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, publishedToClient: !currentPublishStatus } : r
        )
      );
      toast.success(!currentPublishStatus ? "Report published to Client" : "Report hidden from Client");
    } catch {
      toast.error("Failed to update report publication");
    }
  };

  // Create Bug
  const handleCreateBug = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/qa/project/${id}`,
        {
          title: bugTitle,
          description: bugDesc,
          stepsToReproduce: bugSteps,
          severity: bugSeverity,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      toast.success("Defect logged successfully!");
      setBugModalOpen(false);
      fetchProjectDetails();
    } catch {
      toast.error("Failed to log bug");
    }
  };

  // Create Invoice
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/financial/project/${id}`,
        { title: invTitle, amount: invAmount, sendWhatsApp: sendInvoiceWhatsApp },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (sendInvoiceWhatsApp) {
        if (res.data?.whatsappSent) {
          toast.success("Invoice generated & WhatsApp sent to client!");
        } else {
          toast.success("Invoice generated (WhatsApp delivery could not be confirmed).");
        }
      } else {
        toast.success("Invoice generated!");
      }
      setInvoiceModalOpen(false);
      setInvTitle("");
      setInvAmount("");
      setSendInvoiceWhatsApp(true);
      fetchProjectDetails();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  // Team Management Handlers
  const handleOpenTeamModal = async () => {
    setSelectedPM(project?.assignedProjectManager?._id || project?.assignedProjectManager || "");
    setSelectedQA(project?.assignedQATester?._id || project?.assignedQATester || "");
    setSelectedTelecaller(project?.assignedTelecaller?._id || project?.assignedTelecaller || "");
    setSelectedDevs(
      Array.isArray(project?.assignedDevelopers)
        ? project.assignedDevelopers.map((d) => d._id || d)
        : []
    );
    setSendTeamWhatsApp(true);
    setTeamModalOpen(true);

    try {
      setLoadingStaff(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/get-all-user?limit=200`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAvailableStaff(res.data.data || []);
    } catch {
      toast.error("Failed to load staff list");
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleToggleDev = (devId) => {
    setSelectedDevs((prev) =>
      prev.includes(devId) ? prev.filter((i) => i !== devId) : [...prev, devId]
    );
  };

  const handleSaveTeam = async (e) => {
    e.preventDefault();
    setSavingTeam(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/lifecycle-projects/${id}/team`,
        {
          assignedProjectManager: selectedPM || null,
          assignedDevelopers: selectedDevs,
          assignedQATester: selectedQA || null,
          assignedTelecaller: selectedTelecaller || null,
          sendWhatsApp: sendTeamWhatsApp,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (sendTeamWhatsApp) {
        if (res.data?.whatsappSent) {
          toast.success(`Team updated & WhatsApp notification sent (${res.data.whatsappSentCount})!`);
        } else {
          toast.success("Team assignments updated (no WhatsApp notifications sent).");
        }
      } else {
        toast.success("Team assignments updated successfully!");
      }
      setTeamModalOpen(false);
      fetchProjectDetails();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update team assignments");
    } finally {
      setSavingTeam(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-[#0756A5] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs font-bold text-[#082B59]">Loading Project Workspace...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F5F8FC] p-8 text-center">
        <p className="text-sm font-bold text-gray-600">Project Workspace not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 rounded-xl bg-[#0756A5] text-white text-xs font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-4 lg:p-8 space-y-6">
      {/* TOP WORKSPACE BANNER */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 hover:text-[#0756A5] hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors mt-0.5"
            >
              <ArrowLeft size={16} />
            </button>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#0756A5] border border-blue-200">
                  {project.projectId || "VK-PRJ-2026"}
                </span>
                <span className="text-xs font-semibold text-gray-400">
                  • {project.category || "Software Solution"}
                </span>
              </div>
              <h1 className="text-2xl font-black text-[#082B59] mt-1">
                {project.name}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Client: <span className="font-bold text-gray-800">{project.client?.name || "Client"}</span>
                {project.client?.companyName && ` (${project.client.companyName})`}
              </p>
            </div>
          </div>

          {/* Status Controls & Manage Team */}
          <div className="flex items-center gap-3 self-end lg:self-center flex-wrap">
            {(isAdmin || isSuperAdmin || isPM) && (
              <button
                onClick={handleOpenTeamModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all"
              >
                <Users size={14} />
                <span>Manage Team</span>
              </button>
            )}

            {isAdmin || isSuperAdmin || isPM ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400">Status:</span>
                <select
                  value={project.lifecycleStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-[#0756A5] border border-blue-200 focus:outline-none"
                >
                  <option value="PLANNING">Planning</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="UNDER_REVIEW">Under Review</option>
                  <option value="TESTING">Testing</option>
                  <option value="CLIENT_APPROVAL">Client Approval</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            ) : (
              <span className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#0756A5] border border-blue-200">
                {project.lifecycleStatus?.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        {/* TEAM MEMBERS AVATARS ROW */}
        <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Project Manager</span>
              <span className="font-bold text-gray-700">
                {project.assignedProjectManager?.name || "Unassigned"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">QA Tester</span>
              <span className="font-bold text-gray-700">
                {project.assignedQATester?.name || "Unassigned"}
              </span>
            </div>

            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-bold">Developers</span>
              <span className="font-bold text-gray-700">
                {Array.isArray(project.assignedDevelopers) && project.assignedDevelopers.length > 0
                  ? project.assignedDevelopers.map((d) => d.name).join(", ")
                  : "Unassigned"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Contract</span>
              <span className="font-bold text-[#082B59]">
                ₹{(project.contractAmount || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-sans font-bold">Paid</span>
              <span className="font-bold text-emerald-600">
                ₹{(project.advancePaid || 0).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* WORKSPACE NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-[#0756A5] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Scope / Requirements */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm text-[#082B59]">Project Scope & Requirements</h3>
              <div className="text-xs text-gray-600 leading-relaxed space-y-1.5">
                {project.requirements && project.requirements.length > 0 ? (
                  project.requirements.map((req, i) => (
                    <p key={i} className="flex items-start gap-2">
                      <span className="text-[#0756A5] font-bold">•</span>
                      <span>{req}</span>
                    </p>
                  ))
                ) : (
                  <p className="italic text-gray-400">{project.description || "No requirements documented"}</p>
                )}
              </div>
            </div>

            {/* Milestones Card */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-[#082B59]">Project Milestones</h3>
              <div className="space-y-3">
                {project.milestones?.map((m, i) => (
                  <div
                    key={m._id || i}
                    className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#0756A5] text-white text-[10px] font-bold flex items-center justify-center">
                          {i + 1}
                        </span>
                        <h4 className="text-xs font-bold text-[#082B59]">{m.title}</h4>
                      </div>
                      <p className="text-[11px] text-gray-500 pl-7 mt-0.5">{m.description}</p>
                    </div>

                    <div className="flex items-center gap-3 pl-7 sm:pl-0">
                      <span className="font-mono font-bold text-xs text-gray-700">
                        ₹{(m.amount || 0).toLocaleString("en-IN")}
                      </span>
                      {m.clientApproval ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          {m.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* ASSIGNED PROJECT TEAM CARD */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#082B59]">Project Team & Roles</h3>
                  <p className="text-[11px] text-gray-400">Assigned engineers & personnel</p>
                </div>
                {(isAdmin || isSuperAdmin || isPM) && (
                  <button
                    onClick={handleOpenTeamModal}
                    className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-[#0756A5] hover:bg-blue-50 transition-colors"
                    title="Edit Team Assignments"
                  >
                    <Edit3 size={14} />
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {/* Project Manager */}
                <div className="p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-[#0756A5] tracking-wider">
                      Project Manager
                    </span>
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                  </div>
                  {project.assignedProjectManager ? (
                    <div className="mt-1">
                      <p className="text-xs font-bold text-gray-800">{project.assignedProjectManager.name}</p>
                      <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-gray-500 font-mono">
                        {project.assignedProjectManager.email && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail size={11} className="text-gray-400" />
                            {project.assignedProjectManager.email}
                          </span>
                        )}
                        {project.assignedProjectManager.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={11} className="text-gray-400" />
                            {project.assignedProjectManager.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400 mt-1">No PM assigned</p>
                  )}
                </div>

                {/* Developers */}
                <div className="p-3 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                      Developers ({Array.isArray(project.assignedDevelopers) ? project.assignedDevelopers.length : 0})
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  {Array.isArray(project.assignedDevelopers) && project.assignedDevelopers.length > 0 ? (
                    <div className="mt-2 space-y-2">
                      {project.assignedDevelopers.map((dev, idx) => (
                        <div key={dev._id || idx} className="pb-2 border-b border-emerald-100/60 last:border-b-0 last:pb-0">
                          <p className="text-xs font-bold text-gray-800">{dev.name}</p>
                          <div className="mt-0.5 flex flex-col gap-0.5 text-[11px] text-gray-500 font-mono">
                            {dev.email && (
                              <span className="flex items-center gap-1.5 truncate">
                                <Mail size={11} className="text-gray-400" />
                                {dev.email}
                              </span>
                            )}
                            {dev.phone && (
                              <span className="flex items-center gap-1.5">
                                <Phone size={11} className="text-gray-400" />
                                {dev.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400 mt-1">No Developers assigned</p>
                  )}
                </div>

                {/* QA Tester */}
                <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-purple-700 tracking-wider">
                      QA Tester
                    </span>
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                  </div>
                  {project.assignedQATester ? (
                    <div className="mt-1">
                      <p className="text-xs font-bold text-gray-800">{project.assignedQATester.name}</p>
                      <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-gray-500 font-mono">
                        {project.assignedQATester.email && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail size={11} className="text-gray-400" />
                            {project.assignedQATester.email}
                          </span>
                        )}
                        {project.assignedQATester.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={11} className="text-gray-400" />
                            {project.assignedQATester.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs italic text-gray-400 mt-1">No QA Tester assigned</p>
                  )}
                </div>

                {/* Telecaller */}
                {project.assignedTelecaller && (
                  <div className="p-3 rounded-2xl bg-amber-50/50 border border-amber-100">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                        Assigned Telecaller
                      </span>
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    </div>
                    <div className="mt-1">
                      <p className="text-xs font-bold text-gray-800">{project.assignedTelecaller.name}</p>
                      <div className="mt-1 flex flex-col gap-0.5 text-[11px] text-gray-500 font-mono">
                        {project.assignedTelecaller.email && (
                          <span className="flex items-center gap-1.5 truncate">
                            <Mail size={11} className="text-gray-400" />
                            {project.assignedTelecaller.email}
                          </span>
                        )}
                        {project.assignedTelecaller.phone && (
                          <span className="flex items-center gap-1.5">
                            <Phone size={11} className="text-gray-400" />
                            {project.assignedTelecaller.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {(isAdmin || isSuperAdmin || isPM) && (
                <button
                  onClick={handleOpenTeamModal}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-50 text-[#0756A5] hover:bg-blue-100 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                >
                  <Users size={13} />
                  <span>Manage Team Assignments</span>
                </button>
              )}
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
              <h3 className="font-extrabold text-sm text-[#082B59]">Quick Project Stats</h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Tasks Completed:</span>
                  <span className="font-bold text-emerald-600">
                    {tasks.filter((t) => t.status === "COMPLETED").length} / {tasks.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Open QA Bugs:</span>
                  <span className="font-bold text-red-600">
                    {bugs.filter((b) => b.status === "OPEN" || b.status === "ASSIGNED").length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Scheduled Meetings:</span>
                  <span className="font-bold text-gray-700">{meetings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Daily Updates Published:</span>
                  <span className="font-bold text-[#0756A5]">
                    {dailyReports.filter((r) => r.publishedToClient).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. KANBAN TASKS TAB */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#082B59]">Project Task Board</h3>
              <p className="text-xs text-gray-400">Drag or select stage to transition tasks through sprint phases</p>
            </div>

            {(isAdmin || isSuperAdmin || isPM || isDeveloper) && (
              <button
                onClick={() => setTaskModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0756A5] text-white text-xs font-bold shadow-xs hover:shadow-sm"
              >
                <Plus size={15} />
                <span>Add Task</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"].map((col) => {
              const colTasks = tasks.filter((t) => t.status === col);
              return (
                <div
                  key={col}
                  className="bg-gray-100/70 p-4 rounded-2xl border border-gray-200/60 min-h-[450px] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                    <span className="text-xs font-extrabold text-gray-700">
                      {col.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-2xs space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === "HIGH" || task.priority === "URGENT"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                          {task.assignedTo && (
                            <span className="text-[10px] font-bold text-gray-500">
                              {task.assignedTo.name?.split(" ")[0]}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-[#082B59] leading-snug">
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-gray-400 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <select
                            value={task.status}
                            onChange={(e) => handleMoveTask(task._id, e.target.value)}
                            className="text-[10px] font-bold bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700"
                          >
                            <option value="TODO">To-Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REVIEW">Review</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. LIVE CHAT TAB */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs h-[650px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <h3 className="font-extrabold text-sm text-[#082B59]">
                Project Collaboration Channel
              </h3>
              <p className="text-[11px] text-gray-400">
                End-to-end authorized workspace room • Real-time socket delivery
              </p>
            </div>

            {typingUsers.size > 0 && (
              <span className="text-[11px] font-semibold text-[#0756A5] italic animate-pulse">
                {Array.from(typingUsers).join(", ")} is typing...
              </span>
            )}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-gray-400 text-xs">
                No messages yet. Send the first message to kickoff project collaboration!
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender?._id === user?._id || msg.sender === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 text-[10px] text-gray-400">
                      <span className="font-bold text-gray-600">
                        {isMe ? "You" : msg.senderName || msg.sender?.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-gray-100 uppercase font-bold text-[8px]">
                        {msg.senderRole || "Member"}
                      </span>
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isMe
                          ? "bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white rounded-tr-none shadow-xs"
                          : "bg-gray-100 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Composer */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type your message to the project group..."
              value={chatInput}
              onChange={(e) => {
                setChatInput(e.target.value);
                if (socket) socket.emit("typing_start", { projectId: id });
              }}
              className="flex-1 text-xs border border-gray-200 rounded-2xl px-4 py-2.5 focus:outline-none focus:border-[#0756A5]"
            />
            <button
              type="submit"
              className="p-2.5 rounded-2xl bg-[#0756A5] text-white hover:bg-[#082B59] transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* 4. DAILY REPORTS TAB */}
      {activeTab === "reports" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#082B59]">Daily Developer Progress</h3>
              <p className="text-xs text-gray-400">Daily reports submitted by developers, reviewed by PM, and published to client</p>
            </div>

            {(isDeveloper || isAdmin || isSuperAdmin) && (
              <button
                onClick={() => setReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6900] text-white text-xs font-bold"
              >
                <Plus size={15} />
                <span>Submit Daily Report</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dailyReports.map((r) => (
              <div key={r._id} className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#082B59]">
                      {r.developer?.name || "Developer"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(r.reportDate).toLocaleDateString()}
                    </span>
                  </div>

                  {/* PM / Admin Publish to Client Toggle */}
                  {(isAdmin || isSuperAdmin || isPM) && (
                    <button
                      onClick={() => handleTogglePublishReport(r._id, r.publishedToClient)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        r.publishedToClient
                          ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                          : "bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {r.publishedToClient ? <Eye size={12} /> : <EyeOff size={12} />}
                      <span>{r.publishedToClient ? "Visible to Client" : "Hidden from Client"}</span>
                    </button>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Completed Tasks
                  </span>
                  <ul className="list-disc list-inside text-xs text-gray-700 space-y-0.5">
                    {r.completedTasks?.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>

                {r.blockers && r.blockers.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs">
                    <span className="font-bold">Blockers: </span>
                    {r.blockers.join(", ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MEETINGS & MOM TAB */}
      {activeTab === "meetings" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#082B59]">Meetings & MoM</h3>
              <p className="text-xs text-gray-400">Scheduled client meetings and published Minutes of Meeting</p>
            </div>

            <button
              onClick={() => {
                setSendMeetingWhatsApp(true);
                setMeetingModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0756A5] text-white text-xs font-bold"
            >
              <Plus size={15} />
              <span>Schedule Meeting</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meetings.map((m) => (
              <div key={m._id} className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-sm text-[#082B59]">{m.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0756A5]">
                    {m.status}
                  </span>
                </div>

                <p className="text-xs text-gray-500">{m.agenda || "Regular sprint sync"}</p>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">
                    {new Date(m.meetingDate).toLocaleDateString()} at {m.startTime}
                  </span>

                  <div className="flex items-center gap-2">
                    {m.meetingLink && (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-[#0756A5] text-white text-[10px] font-bold inline-flex items-center gap-1"
                      >
                        <Video size={12} />
                        <span>Join</span>
                      </a>
                    )}

                    {(isAdmin || isSuperAdmin || isPM) && (
                      <button
                        onClick={() => {
                          setSelectedMeetingId(m._id);
                          setMomModalOpen(true);
                        }}
                        className="px-3 py-1.5 rounded-xl border border-[#0756A5] text-[#0756A5] text-[10px] font-bold hover:bg-blue-50"
                      >
                        Publish MoM
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. QA BUG TRACKER TAB */}
      {activeTab === "qa" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#082B59]">Quality Assurance Bug Tracker</h3>
              <p className="text-xs text-gray-400">Defects reported by QA or Client awaiting developer fix & verification</p>
            </div>

            <button
              onClick={() => setBugModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
            >
              <Plus size={15} />
              <span>Report Bug</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                  <th className="py-3 px-4">Bug ID</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reported By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bugs.map((b) => (
                  <tr key={b._id}>
                    <td className="py-3 px-4 font-mono font-bold text-[#0756A5]">{b.bugId}</td>
                    <td className="py-3 px-4 font-bold text-[#082B59]">{b.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700">
                        {b.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{b.reportedBy?.name || "QA"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. FINANCIALS TAB */}
      {activeTab === "financials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-[#082B59]">Invoices & Billing</h3>
              <p className="text-xs text-gray-400">Milestone invoices, receipts, and payment status</p>
            </div>

            {(isAdmin || isSuperAdmin || isPM) && (
              <button
                onClick={() => {
                  setSendInvoiceWhatsApp(true);
                  setInvoiceModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                <Plus size={15} />
                <span>Create Invoice</span>
              </button>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <tr key={inv._id}>
                    <td className="py-3 px-4 font-mono font-bold text-[#0756A5]">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{inv.title}</td>
                    <td className="py-3 px-4 font-mono font-bold text-gray-900">
                      ₹{inv.amount?.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{new Date(inv.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. AUDIT TRAIL TAB */}
      {activeTab === "audit" && (
        <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-[#082B59]">Immutable Activity Audit Stream</h3>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log._id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 text-xs">
                <span className="w-2 h-2 rounded-full bg-[#0756A5] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{log.description}</p>
                  <span className="text-[10px] text-gray-400">
                    By {log.actorName} ({log.actorRole}) • {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {taskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-base text-[#082B59]">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <input
                type="text"
                placeholder="Task Title *"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                required
              />
              <textarea
                placeholder="Description"
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-3"
              />
              <select
                value={newTaskDev}
                onChange={(e) => setNewTaskDev(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
              >
                <option value="">Assign Developer</option>
                {project.assignedDevelopers?.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setTaskModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0756A5] text-white text-xs font-bold"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE MEETING */}
      {typeof document !== "undefined" &&
        meetingModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div
              onClick={() => setMeetingModalOpen(false)}
              className="fixed inset-0 bg-gray-900/40"
            />
            <div className="relative z-10 bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_60px_-15px_rgba(8,43,89,0.28)] border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-[#082B59]">
                    Schedule Project Meeting
                  </h3>
                  <p className="text-xs text-gray-400">
                    {project.name} ({project.projectId})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setMeetingModalOpen(false)}
                  className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleScheduleMeeting} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Meeting Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sprint Review & Demo"
                    value={newMeetingTitle}
                    onChange={(e) => setNewMeetingTitle(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={newMeetingDate}
                      onChange={(e) => setNewMeetingDate(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={newMeetingTime}
                      onChange={(e) => setNewMeetingTime(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Google Meet Link
                  </label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={newMeetingLink}
                    onChange={(e) => setNewMeetingLink(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Meeting Agenda
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key discussion topics..."
                    value={newMeetingAgenda}
                    onChange={(e) => setNewMeetingAgenda(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                  />
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendMeetingWhatsApp}
                    onChange={(e) => setSendMeetingWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-900 block">
                      Send meeting link & details on WhatsApp
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Notifies client and assigned project team via WhatsApp
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMeetingModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-sm"
                  >
                    Schedule
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* MODAL: PUBLISH MOM */}
      {momModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-base text-[#082B59]">Publish Minutes of Meeting (MoM)</h3>
            <form onSubmit={handlePublishMom} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Discussion Points (One per line)</label>
                <textarea
                  rows={2}
                  value={momPoints}
                  onChange={(e) => setMomPoints(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Client Decisions</label>
                <textarea
                  rows={2}
                  value={momDecisions}
                  onChange={(e) => setMomDecisions(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Action Items (Auto-converts into Kanban Tasks!)
                </label>
                <textarea
                  rows={3}
                  value={momActionItems}
                  onChange={(e) => setMomActionItems(e.target.value)}
                  placeholder="e.g. Implement payment gateway webhook&#10;Update mobile header navigation"
                  className="w-full text-xs border border-gray-200 rounded-xl p-2.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMomModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0756A5] text-white text-xs font-bold"
                >
                  Publish MoM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: REPORT BUG */}
      {bugModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-base text-[#082B59]">Report QA Defect</h3>
            <form onSubmit={handleCreateBug} className="space-y-3">
              <input
                type="text"
                placeholder="Defect Summary *"
                value={bugTitle}
                onChange={(e) => setBugTitle(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                required
              />
              <select
                value={bugSeverity}
                onChange={(e) => setBugSeverity(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
              <textarea
                placeholder="Defect Description *"
                value={bugDesc}
                onChange={(e) => setBugDesc(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-3"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setBugModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Log Defect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SUBMIT DAILY REPORT */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-base text-[#082B59]">Submit Daily Work Progress</h3>
            <form onSubmit={handleSubmitReport} className="space-y-3">
              <textarea
                rows={2}
                placeholder="Completed Work Today *"
                value={repCompleted}
                onChange={(e) => setRepCompleted(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-3"
                required
              />
              <textarea
                rows={2}
                placeholder="Work In Progress"
                value={repWip}
                onChange={(e) => setRepWip(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-3"
              />
              <textarea
                rows={2}
                placeholder="Blockers or Impediments"
                value={repBlockers}
                onChange={(e) => setRepBlockers(e.target.value)}
                className="w-full text-xs border border-gray-200 rounded-xl p-3"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#FF6900] text-white text-xs font-bold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE INVOICE */}
      {typeof document !== "undefined" &&
        invoiceModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div
              onClick={() => setInvoiceModalOpen(false)}
              className="fixed inset-0 bg-gray-900/40"
            />
            <div className="relative z-10 bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_60px_-15px_rgba(8,43,89,0.28)] border border-gray-200 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-[#082B59]">
                    Generate Invoice
                  </h3>
                  <p className="text-xs text-gray-400">
                    {project.name} ({project.projectId})
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setInvoiceModalOpen(false)}
                  className="w-7 h-7 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateInvoice} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Invoice Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Milestone 2 Deliverable"
                    value={invTitle}
                    onChange={(e) => setInvTitle(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={invAmount}
                    onChange={(e) => setInvAmount(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                    required
                  />
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendInvoiceWhatsApp}
                    onChange={(e) => setSendInvoiceWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-900 block">
                      Send invoice details on WhatsApp
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Automatically notifies {project.client?.name || "client"}
                      {project.client?.phone ? ` (${project.client.phone})` : ""} via WhatsApp
                    </span>
                  </div>
                </label>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setInvoiceModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold shadow-sm"
                  >
                    Generate
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
      {/* MODAL: ASSIGN PROJECT TEAM & ROLES */}
      {typeof document !== "undefined" &&
        teamModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
            <div
              onClick={() => setTeamModalOpen(false)}
              className="fixed inset-0 bg-gray-900/40"
            />
            <div className="relative z-10 bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-[0_20px_60px_-15px_rgba(8,43,89,0.28)] border border-gray-200 space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#082B59]">
                  Assign Project Team & Roles
                </h3>
                <p className="text-xs text-gray-500">
                  Manage assigned Project Manager, Developers, QA Tester, and Telecaller for {project.projectId}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTeamModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {loadingStaff ? (
              <div className="py-12 text-center text-gray-400">
                <div className="animate-spin w-8 h-8 border-4 border-[#0756A5] border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-xs font-semibold">Loading personnel directory...</p>
              </div>
            ) : (
              <form onSubmit={handleSaveTeam} className="space-y-4">
                {/* 1. PROJECT MANAGER */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Project Manager
                  </label>
                  <select
                    value={selectedPM}
                    onChange={(e) => setSelectedPM(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                  >
                    <option value="">-- Select Project Manager (Optional) --</option>
                    {availableStaff.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role?.name || "Staff"}) - {u.email} {u.phone ? `| ${u.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. QA TESTER */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    QA Tester
                  </label>
                  <select
                    value={selectedQA}
                    onChange={(e) => setSelectedQA(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                  >
                    <option value="">-- Select QA Tester (Optional) --</option>
                    {availableStaff.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role?.name || "Staff"}) - {u.email} {u.phone ? `| ${u.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. ASSIGNED TELECALLER */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Assigned Telecaller
                  </label>
                  <select
                    value={selectedTelecaller}
                    onChange={(e) => setSelectedTelecaller(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                  >
                    <option value="">-- Select Telecaller (Optional) --</option>
                    {availableStaff.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.name} ({u.role?.name || "Staff"}) - {u.email} {u.phone ? `| ${u.phone}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. DEVELOPERS (MULTI-SELECT) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Assigned Developers ({selectedDevs.length} Selected)
                    </label>
                    <span className="text-[11px] text-gray-400">Click to select multiple</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-2xl p-2.5 space-y-1.5 bg-gray-50/50">
                    {availableStaff.length === 0 ? (
                      <p className="text-xs text-gray-400 italic p-2">No staff users available</p>
                    ) : (
                      availableStaff.map((dev) => {
                        const isSelected = selectedDevs.includes(dev._id);
                        return (
                          <div
                            key={dev._id}
                            onClick={() => handleToggleDev(dev._id)}
                            className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer border transition-all ${
                              isSelected
                                ? "bg-blue-50 border-blue-200 text-[#0756A5]"
                                : "bg-white border-gray-100 hover:border-gray-200 text-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <div
                                className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? "bg-[#0756A5] border-[#0756A5] text-white"
                                    : "border-gray-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check size={11} strokeWidth={3} />}
                              </div>
                              <span className="font-bold truncate">{dev.name}</span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                ({dev.role?.name || "Staff"})
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono shrink-0 ml-2">
                              {dev.phone || dev.email}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sendTeamWhatsApp}
                    onChange={(e) => setSendTeamWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-emerald-900 block">
                      Send team assignment notification on WhatsApp
                    </span>
                    <span className="text-[11px] text-emerald-700">
                      Notifies assigned team members and client via WhatsApp
                    </span>
                  </div>
                </label>

                {/* MODAL ACTIONS */}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setTeamModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingTeam}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingTeam ? (
                      <>
                        <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} />
                        <span>Save Team Assignments</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProjectWorkspace;
