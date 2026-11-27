import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckSquare,
  Send,
  ArrowRight,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../utils/apiConfig";

const DeveloperDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // Daily Report Modal
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [completedTasks, setCompletedTasks] = useState("");
  const [workInProgress, setWorkInProgress] = useState("");
  const [pendingWork, setPendingWork] = useState("");
  const [technicalProblems, setTechnicalProblems] = useState("");
  const [blockers, setBlockers] = useState("");
  const [timeSpentHours, setTimeSpentHours] = useState(8);
  const [tomorrowsPlan, setTomorrowsPlan] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);

  const fetchDeveloperData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [projRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/lifecycle-projects`, { headers }),
      ]);

      const myProjects = projRes.data.data || [];
      setProjects(myProjects);

      if (myProjects.length > 0) {
        setSelectedProjectId(myProjects[0]._id);
        const tasksRes = await axios.get(
          `${API_BASE_URL}/tasks/project/${myProjects[0]._id}?assignedTo=${user?._id}`,
          { headers }
        );
        setTasks(tasksRes.data.data || []);
      }
    } catch {
      toast.error("Failed to load developer dashboard");
    }
  }, [user?._id]);

  useEffect(() => {
    fetchDeveloperData();
  }, [fetchDeveloperData]);

  const handleProjectSelect = async (pId) => {
    setSelectedProjectId(pId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/tasks/project/${pId}?assignedTo=${user?._id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setTasks(res.data.data || []);
    } catch {
      // ignore
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
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
      toast.success(`Task moved to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleSubmitDailyReport = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    try {
      setSubmittingReport(true);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_BASE_URL}/daily-reports/project/${selectedProjectId}`,
        {
          completedTasks,
          workInProgress,
          pendingWork,
          technicalProblems,
          blockers,
          timeSpentHours,
          tomorrowsPlan,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("Daily report submitted successfully to PM for review!");
      setReportModalOpen(false);
      setCompletedTasks("");
      setWorkInProgress("");
      setPendingWork("");
      setTechnicalProblems("");
      setBlockers("");
      setTomorrowsPlan("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit report");
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-4 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#FF6900] tracking-wider uppercase">
            Developer Workspace
          </span>
          <h1 className="text-2xl font-black text-[#082B59] mt-0.5">
            Welcome, {user?.name || "Developer"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track your assigned sprint tasks, participate in live project chat, and submit daily work progress reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#E05A00] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
          >
            <Send size={15} />
            <span>Submit Daily Report</span>
          </button>
        </div>
      </div>

      {/* METRIC OVERVIEW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Assigned Projects</span>
          <p className="text-2xl font-black text-[#082B59] mt-2">{projects.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Tasks In Progress</span>
          <p className="text-2xl font-black text-blue-600 mt-2">
            {tasks.filter((t) => t.status === "IN_PROGRESS").length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">In Code Review</span>
          <p className="text-2xl font-black text-purple-600 mt-2">
            {tasks.filter((t) => t.status === "REVIEW").length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Completed Tasks</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {tasks.filter((t) => t.status === "COMPLETED").length}
          </p>
        </div>
      </div>

      {/* ASSIGNED PROJECTS CAROUSEL / SELECTOR */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-[#082B59]">My Assigned Projects</h2>
          <span className="text-xs text-gray-400">Select project to view your tasks</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projects.map((p) => {
            const isSelected = selectedProjectId === p._id;
            return (
              <div
                key={p._id}
                onClick={() => handleProjectSelect(p._id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#0756A5] bg-blue-50/40 shadow-xs"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#0756A5]">
                    {p.projectId}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                    {p.lifecycleStatus}
                  </span>
                </div>
                <h4 className="font-extrabold text-xs text-[#082B59] mt-2 line-clamp-1">
                  {p.name}
                </h4>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{p.category}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/projects/${p._id}`);
                    }}
                    className="text-[11px] font-bold text-[#0756A5] hover:underline flex items-center gap-1"
                  >
                    <span>Room</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DEVELOPER TASKS KANBAN / LIST */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-[#082B59]">
              Sprint Task Board
            </h2>
            <p className="text-xs text-gray-400">Move tasks through development lifecycle stages</p>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <CheckSquare size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs font-semibold">No tasks assigned in this project yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"].map((colStatus) => {
              const colTasks = tasks.filter((t) => t.status === colStatus);
              return (
                <div key={colStatus} className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/60 flex flex-col min-h-[300px]">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-3">
                    <span className="text-xs font-bold text-gray-700">
                      {colStatus.replace("_", " ")}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1 overflow-y-auto">
                    {colTasks.map((task) => (
                      <div
                        key={task._id}
                        className="bg-white p-3 rounded-lg border border-gray-200/80 shadow-2xs hover:shadow-xs transition-shadow space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                              task.priority === "HIGH"
                                ? "bg-red-50 text-red-600"
                                : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                          {task.deadline && (
                            <span className="text-[9px] text-gray-400">
                              {new Date(task.deadline).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <p className="text-xs font-bold text-[#082B59] leading-snug">
                          {task.title}
                        </p>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <select
                            value={task.status}
                            onChange={(e) => handleUpdateTaskStatus(task._id, e.target.value)}
                            className="text-[10px] font-bold bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5 text-gray-700"
                          >
                            <option value="TODO">To-Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="REVIEW">Code Review</option>
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
        )}
      </div>

      {/* DAILY PROGRESS REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-extrabold text-[#082B59]">
                  Submit Daily Progress Report
                </h3>
                <p className="text-xs text-gray-400">
                  This report will be sent to the Project Manager for review and approval.
                </p>
              </div>
              <button
                onClick={() => setReportModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitDailyReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Target Project *
                </label>
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0756A5]"
                  required
                >
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.projectId} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Completed Work Today (One item per line) *
                </label>
                <textarea
                  rows={2}
                  value={completedTasks}
                  onChange={(e) => setCompletedTasks(e.target.value)}
                  placeholder="e.g. Completed JWT authentication middleware&#10;Integrated Socket.io chat server"
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Work In Progress
                </label>
                <textarea
                  rows={2}
                  value={workInProgress}
                  onChange={(e) => setWorkInProgress(e.target.value)}
                  placeholder="e.g. Developing Kanban Task Board component"
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Technical Problems / Challenges
                  </label>
                  <textarea
                    rows={2}
                    value={technicalProblems}
                    onChange={(e) => setTechnicalProblems(e.target.value)}
                    placeholder="e.g. WebSocket connection drop on proxy"
                    className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Blockers
                  </label>
                  <textarea
                    rows={2}
                    value={blockers}
                    onChange={(e) => setBlockers(e.target.value)}
                    placeholder="e.g. Awaiting client payment gateway credentials"
                    className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Hours Spent Today (0 - 24) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={timeSpentHours}
                    onChange={(e) => setTimeSpentHours(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0756A5]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Tomorrow's Plan
                  </label>
                  <input
                    type="text"
                    value={tomorrowsPlan}
                    onChange={(e) => setTomorrowsPlan(e.target.value)}
                    placeholder="e.g. Write unit tests and push code to staging"
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0756A5]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReport}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#E05A00] text-white text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {submittingReport ? "Submitting..." : "Submit to PM"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DeveloperDashboard;
