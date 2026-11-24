import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Search,
  Filter,
  Plus,
  Check,
  X,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../utils/apiConfig";

const ProjectManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Create Project Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submittingProject, setSubmittingProject] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [newProjectName, setNewProjectName] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newCategory, setNewCategory] = useState("Web Development");
  const [newAmount, setNewAmount] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPM, setNewPM] = useState("");
  const [newQA, setNewQA] = useState("");
  const [newDevs, setNewDevs] = useState([]);

  const handleOpenCreateModal = async () => {
    setNewProjectName("");
    setNewClient("");
    setNewCategory("Web Development");
    setNewAmount("");
    setNewDesc("");
    setNewPM(user?._id || "");
    setNewQA("");
    setNewDevs([]);
    setCreateModalOpen(true);

    try {
      setLoadingUsers(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/users/get-all-user?limit=200`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setAvailableUsers(res.data.data || []);
    } catch {
      toast.error("Failed to load users list");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleToggleDev = (devId) => {
    setNewDevs((prev) =>
      prev.includes(devId) ? prev.filter((id) => id !== devId) : [...prev, devId]
    );
  };

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }

    setSubmittingProject(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/lifecycle-projects`,
        {
          name: newProjectName.trim(),
          clientId: newClient || undefined,
          category: newCategory,
          description: newDesc,
          requirements: newDesc ? [newDesc] : ["Initial Project Requirements"],
          contractAmount: Number(newAmount) || 0,
          assignedProjectManager: newPM || undefined,
          assignedDevelopers: newDevs,
          assignedQATester: newQA || undefined,
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      toast.success("Project created successfully!");
      setCreateModalOpen(false);
      navigate(`/projects/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmittingProject(false);
    }
  };

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/lifecycle-projects?status=${statusFilter}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      setProjects(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.projectId?.toLowerCase().includes(search.toLowerCase()) ||
      p.client?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.lifecycleStatus === "IN_PROGRESS").length,
    testing: projects.filter((p) => p.lifecycleStatus === "TESTING").length,
    completed: projects.filter((p) => p.lifecycleStatus === "COMPLETED" || p.lifecycleStatus === "DELIVERED").length,
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "TESTING":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "CLIENT_APPROVAL":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "COMPLETED":
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] p-4 lg:p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-[#FF6900] tracking-wider uppercase">
            Project Management Console
          </span>
          <h1 className="text-2xl font-black text-[#082B59] mt-0.5">
            Welcome, {user?.name || "Project Manager"}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Supervise project lifecycles, assign developers, inspect daily progress reports, and track milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={16} />
            <span>Create Project</span>
          </button>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0756A5] flex items-center justify-center">
              <FolderGit2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-[#082B59] mt-2">{stats.total}</p>
          <span className="text-[11px] text-gray-400">Assigned portfolios</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">In Development</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{stats.inProgress}</p>
          <span className="text-[11px] text-gray-400">Active coding phase</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">QA / Retest</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <AlertCircle size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-purple-600 mt-2">{stats.testing}</p>
          <span className="text-[11px] text-gray-400">Under QA verification</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500">Completed & Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{stats.completed}</p>
          <span className="text-[11px] text-gray-400">100% delivered to client</span>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search project name, ID, or client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-[#0756A5]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={15} className="text-gray-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
          >
            <option value="ALL">All Lifecycle Statuses</option>
            <option value="PLANNING">Planning</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="TESTING">Testing</option>
            <option value="CLIENT_APPROVAL">Client Approval</option>
            <option value="COMPLETED">Completed</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
            <div className="animate-spin w-8 h-8 border-4 border-[#0756A5] border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-xs font-semibold">Loading assigned projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
            <FolderGit2 size={36} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-600">No projects found</p>
            <p className="text-xs text-gray-400 mt-1">
              Projects created or assigned to you will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProjects.map((project) => (
              <motion.div
                key={project._id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="bg-white rounded-2xl p-5 border border-gray-200/90 shadow-2xs hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0756A5] border border-blue-200">
                      {project.projectId || "VK-PRJ-2026"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(
                        project.lifecycleStatus
                      )}`}
                    >
                      {project.lifecycleStatus?.replace("_", " ")}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-[#082B59] text-sm line-clamp-1">
                    {project.name}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">
                    {project.description || "Client project workspace"}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Client:</span>
                      <span className="font-bold text-gray-700 truncate max-w-[150px]">
                        {project.client?.name || "Client Account"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Developers:</span>
                      <div className="flex items-center -space-x-1.5">
                        {Array.isArray(project.assignedDevelopers) &&
                        project.assignedDevelopers.length > 0 ? (
                          project.assignedDevelopers.map((dev, i) => (
                            <div
                              key={dev._id || i}
                              className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white text-[9px] font-bold flex items-center justify-center border-2 border-white"
                              title={dev.name}
                            >
                              {dev.name?.slice(0, 1)}
                            </div>
                          ))
                        ) : (
                          <span className="text-[11px] text-gray-400 italic">Unassigned</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Contract:</span>
                      <span className="font-mono font-bold text-gray-800">
                        ₹{(project.contractAmount || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#0756A5] group">
                  <span>Open Workspace</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      {/* MODAL: CREATE PROJECT */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 shadow-2xl border border-gray-100 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-[#082B59]">
                  Create New Client Project
                </h3>
                <p className="text-xs text-gray-500">
                  Initialize a dedicated project workspace and assign engineering roles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-700 flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {loadingUsers ? (
              <div className="py-12 text-center text-gray-400">
                <div className="animate-spin w-8 h-8 border-4 border-[#0756A5] border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-xs font-semibold">Loading accounts directory...</p>
              </div>
            ) : (
              <form onSubmit={handleCreateProjectSubmit} className="space-y-3.5">
                {/* Project Name */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Project Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp Enterprise Portal"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                    required
                  />
                </div>

                {/* Client Account */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Client Account
                  </label>
                  <select
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                  >
                    <option value="">-- Select Client Account (Optional) --</option>
                    {availableUsers
                      .filter((u) => u.isClient || (u.role?.name || "").toLowerCase() === "client")
                      .map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name} {c.companyName ? `(${c.companyName})` : ""} - {c.clientId || c.phone || c.email}
                        </option>
                      ))}
                    {availableUsers
                      .filter((u) => !u.isClient && (u.role?.name || "").toLowerCase() !== "client")
                      .map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.role?.name || "Staff"}) - {u.email}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Category & Contract Amount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Enterprise CRM & ERP">Enterprise CRM & ERP</option>
                      <option value="AI & Machine Learning">AI & Machine Learning</option>
                      <option value="Cloud & DevOps">Cloud & DevOps</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Contract Amount (₹)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 150000"
                      value={newAmount}
                      onChange={(e) => setNewAmount(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-[#0756A5]"
                    />
                  </div>
                </div>

                {/* Scope Description */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Project Scope & Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key deliverables, timeline, tech stack, and scope..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-xl p-3 focus:outline-none focus:border-[#0756A5]"
                  />
                </div>

                {/* Project Manager & QA Tester */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Project Manager
                    </label>
                    <select
                      value={newPM}
                      onChange={(e) => setNewPM(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                    >
                      <option value="">-- Assign PM --</option>
                      {availableUsers.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.role?.name || "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      QA Tester
                    </label>
                    <select
                      value={newQA}
                      onChange={(e) => setNewQA(e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 bg-white text-gray-700 focus:outline-none focus:border-[#0756A5]"
                    >
                      <option value="">-- Assign QA Tester --</option>
                      {availableUsers.map((u) => (
                        <option key={u._id} value={u._id}>
                          {u.name} ({u.role?.name || "Staff"})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Developers Multi-Select */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Assign Developers ({newDevs.length} Selected)
                    </label>
                    <span className="text-[11px] text-gray-400">Click to select multiple</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-2xl p-2 space-y-1 bg-gray-50/50">
                    {availableUsers.map((dev) => {
                      const isSelected = newDevs.includes(dev._id);
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
                    })}
                  </div>
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingProject}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-xs font-bold shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {submittingProject ? (
                      <>
                        <div className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={14} />
                        <span>Create Project Workspace</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagerDashboard;
