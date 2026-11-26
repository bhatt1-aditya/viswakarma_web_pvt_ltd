import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  FolderGit2,
  Plus,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";

const QADashboard = () => {
  const [projects, setProjects] = useState([]);
  const [bugs, setBugs] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // New Bug Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stepsToReproduce, setStepsToReproduce] = useState("");
  const [severity, setSeverity] = useState("MEDIUM");
  const [submittingBug, setSubmittingBug] = useState(false);

  const fetchQAData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const projRes = await axios.get(`${API_BASE_URL}/lifecycle-projects`, { headers });
      const projs = projRes.data.data || [];
      setProjects(projs);

      if (projs.length > 0) {
        setSelectedProjectId(projs[0]._id);
        const bugsRes = await axios.get(`${API_BASE_URL}/qa/project/${projs[0]._id}`, { headers });
        setBugs(bugsRes.data.data || []);
      }
    } catch {
      toast.error("Failed to load QA dashboard");
    }
  }, []);

  useEffect(() => {
    fetchQAData();
  }, [fetchQAData]);

  const handleProjectSelect = async (pId) => {
    setSelectedProjectId(pId);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/qa/project/${pId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setBugs(res.data.data || []);
    } catch {
      // ignore
    }
  };

  const handleCreateBug = async (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      toast.error("Please select a project");
      return;
    }

    try {
      setSubmittingBug(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/qa/project/${selectedProjectId}`,
        {
          title,
          description,
          stepsToReproduce,
          severity,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("Bug logged successfully!");
      setBugs((prev) => [res.data.data, ...prev]);
      setModalOpen(false);
      setTitle("");
      setDescription("");
      setStepsToReproduce("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to log bug");
    } finally {
      setSubmittingBug(false);
    }
  };

  const handleUpdateBugStatus = async (bugId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/qa/${bugId}/status`,
        { status: newStatus },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setBugs((prev) =>
        prev.map((b) => (b._id === bugId ? { ...b, status: newStatus } : b))
      );
      toast.success(`Bug marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200 font-black";
      case "HIGH":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "MEDIUM":
        return "bg-amber-50 text-amber-700 border-amber-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-4 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#FF6900] tracking-wider uppercase">
            Quality Assurance Center
          </span>
          <h1 className="text-2xl font-black text-[#082B59] mt-0.5">
            QA Testing Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Test assigned projects, log software defects, assign to developers, and verify resolutions before release.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={15} />
          <span>Report New Bug</span>
        </button>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Total Bugs</span>
          <p className="text-2xl font-black text-[#082B59] mt-2">{bugs.length}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Open / Assigned</span>
          <p className="text-2xl font-black text-red-600 mt-2">
            {bugs.filter((b) => b.status === "OPEN" || b.status === "ASSIGNED").length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Ready for Retest</span>
          <p className="text-2xl font-black text-amber-600 mt-2">
            {bugs.filter((b) => b.status === "FIXED" || b.status === "RETESTING").length}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <span className="text-xs font-bold text-gray-500">Verified & Closed</span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {bugs.filter((b) => b.status === "CLOSED").length}
          </p>
        </div>
      </div>

      {/* PROJECT SELECTOR */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <FolderGit2 size={18} className="text-[#0756A5]" />
        <span className="text-xs font-bold text-gray-700">Project:</span>
        <select
          value={selectedProjectId}
          onChange={(e) => handleProjectSelect(e.target.value)}
          className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-800 focus:outline-none focus:border-[#0756A5]"
        >
          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.projectId} - {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* BUG LIST TABLE */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-[#082B59]">
            Bug Verification Queue
          </h3>
          <span className="text-xs text-gray-400">{bugs.length} recorded items</span>
        </div>

        {bugs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <CheckCircle2 size={36} className="mx-auto text-emerald-400 mb-2" />
            <p className="text-xs font-bold text-gray-600">Zero active defects reported</p>
            <p className="text-[11px] text-gray-400 mt-1">This project build is clean and stable.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-200/80 font-bold">
                  <th className="py-3 px-4">Bug ID</th>
                  <th className="py-3 px-4">Summary</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Dev</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bugs.map((b) => (
                  <tr key={b._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#0756A5]">
                      {b.bugId}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-[#082B59]">{b.title}</p>
                      <p className="text-[11px] text-gray-400 line-clamp-1">{b.description}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] border ${getSeverityBadge(b.severity)}`}>
                        {b.severity}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {b.assignedDeveloper?.name || "Unassigned"}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {b.status === "FIXED" && (
                        <button
                          onClick={() => handleUpdateBugStatus(b._id, "CLOSED")}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 hover:bg-emerald-100"
                        >
                          Approve & Close
                        </button>
                      )}
                      {b.status === "FIXED" && (
                        <button
                          onClick={() => handleUpdateBugStatus(b._id, "REOPENED")}
                          className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold border border-red-200 hover:bg-red-100"
                        >
                          Reopen Bug
                        </button>
                      )}
                      {b.status === "OPEN" && (
                        <button
                          onClick={() => handleUpdateBugStatus(b._id, "IN_PROGRESS")}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-200"
                        >
                          In Progress
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE BUG MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-gray-100 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#082B59]">Report New Bug</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateBug} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Defect Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Button fails to submit lead on mobile screen"
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-[#0756A5]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Severity Level *
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-[#0756A5]"
                >
                  <option value="LOW">Low - Minor cosmetic glitch</option>
                  <option value="MEDIUM">Medium - Normal workflow issue</option>
                  <option value="HIGH">High - Significant feature failure</option>
                  <option value="CRITICAL">Critical - Blocker / Crash / Security</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Description *
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed explanation of the issue"
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Steps to Reproduce
                </label>
                <textarea
                  rows={3}
                  value={stepsToReproduce}
                  onChange={(e) => setStepsToReproduce(e.target.value)}
                  placeholder="1. Navigate to /contact&#10;2. Fill out name and phone&#10;3. Click submit"
                  className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBug}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  {submittingBug ? "Logging..." : "Log Bug"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default QADashboard;
