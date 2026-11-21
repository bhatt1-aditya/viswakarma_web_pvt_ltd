import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FolderGit2,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Lock,
  ShieldAlert,
  X,
  Type,
  Hash,
  Sparkles,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Play,
  Star,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";

const PORTFOLIO_CATEGORIES = [
  "All Categories",
  "Website Design & Development",
  "Content Management Systems",
  "E-Commerce Solutions",
  "Mobile Application Development",
  "Custom Software & Enterprise Solutions",
  "AI, Machine Learning & Automation",
  "Cloud, DevOps & IT Infrastructure",
  "Digital Marketing & SEO",
  "UI/UX Design & Branding",
];

const PortfolioControl = () => {
  const navigate = useNavigate();
  const { user, permissions, authLoading } = useAuth();

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const isAdmin = ["admin", "superadmin"].includes(roleName);

  // Master Website Controls permission check
  const hasPortfolioAccess =
    isAdmin ||
    (permissions?.sidebar?.websiteControl === true &&
      permissions?.sidebar?.portfolioControl === true);

  // Granular button permissions
  const canAdd = isAdmin || permissions?.buttons?.portfolioControl?.add === true;
  const canEdit = isAdmin || permissions?.buttons?.portfolioControl?.edit === true;
  const canDelete = isAdmin || permissions?.buttons?.portfolioControl?.delete === true;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "E-Commerce Solutions",
    clientIndustry: "",
    summary: "",
    description: "",
    techStack: "",
    deliverables: "",
    results: "",
    liveUrl: "",
    demoUrl: "",
    featured: false,
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/portfolio/all`);
      if (res.data.success && Array.isArray(res.data.projects)) {
        setProjects(res.data.projects);
      }
    } catch (err) {
      console.warn("Could not fetch portfolio:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Open Create
  const handleOpenCreate = () => {
    if (!canAdd) {
      toast.error("Action Forbidden: You do not have 'Add' permission.");
      return;
    }
    setEditingProject(null);
    setFormData({
      title: "",
      slug: "",
      category: "E-Commerce Solutions",
      clientIndustry: "",
      summary: "",
      description: "",
      techStack: "React.js, Node.js, MongoDB",
      deliverables: "Web Application, Admin Console",
      results: "Improved speed by 200%, Scaled to 10k users",
      liveUrl: "",
      demoUrl: "",
      featured: false,
      order: projects.length + 1,
    });
    setFormError("");
    setModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (project) => {
    if (!canEdit) {
      toast.error("Action Forbidden: You do not have 'Edit' permission.");
      return;
    }
    setEditingProject(project);
    setFormData({
      title: project.title || "",
      slug: project.slug || "",
      category: project.category || "E-Commerce Solutions",
      clientIndustry: project.clientIndustry || "",
      summary: project.summary || "",
      description: project.description || "",
      techStack: Array.isArray(project.techStack) ? project.techStack.join(", ") : "",
      deliverables: Array.isArray(project.deliverables) ? project.deliverables.join(", ") : "",
      results: Array.isArray(project.results) ? project.results.join(", ") : "",
      liveUrl: project.liveUrl || "",
      demoUrl: project.demoUrl || "",
      featured: Boolean(project.featured),
      order: project.order !== undefined ? project.order : 0,
    });
    setFormError("");
    setModalOpen(true);
  };

  // Auto slug
  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (!editingProject) {
      const slugVal = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({
        ...prev,
        title: val,
        slug: slugVal,
      }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Project Title is required.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        title: formData.title.trim(),
        slug: (formData.slug || formData.title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        category: formData.category,
        clientIndustry: formData.clientIndustry.trim(),
        summary: formData.summary.trim(),
        description: formData.description.trim() || formData.summary.trim(),
        techStack: formData.techStack
          ? formData.techStack.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        deliverables: formData.deliverables
          ? formData.deliverables.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        results: formData.results
          ? formData.results.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        liveUrl: formData.liveUrl.trim(),
        demoUrl: formData.demoUrl.trim(),
        featured: Boolean(formData.featured),
        order: Number(formData.order) || 0,
      };

      let res;
      if (editingProject && editingProject._id) {
        res = await axios.put(
          `${API_BASE_URL}/portfolio/update/${editingProject._id}`,
          payload,
          { withCredentials: true, headers }
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/portfolio/create`,
          payload,
          { withCredentials: true, headers }
        );
      }

      if (res.data.success) {
        toast.success(
          editingProject ? "Project updated successfully!" : "Project created successfully!"
        );
        fetchProjects();
        setModalOpen(false);
      } else {
        setFormError(res.data.message || "Failed to save project");
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "An error occurred");
      toast.error(err.response?.data?.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async (proj) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete portfolio projects.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Case Study?",
      text: `Are you sure you want to delete "${proj.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(proj._id);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/portfolio/delete/${proj._id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success(`"${proj.title}" deleted!`);
        setProjects((prev) => prev.filter((item) => item._id !== proj._id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete project");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Filtered List
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        selectedCategory === "All Categories" || p.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.slug?.toLowerCase().includes(q) ||
        p.clientIndustry?.toLowerCase().includes(q) ||
        p.summary?.toLowerCase().includes(q) ||
        p.techStack?.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0756A5] rounded-full animate-spin" />
      </div>
    );
  }

  // Access Control Guard
  if (!hasPortfolioAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
          You do not have permission to access the Portfolio CMS. Please contact your administrator to
          grant access under Website Controls.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-5 py-2.5 bg-[#0756A5] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0756A5] border border-blue-200">
              Website Controls
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500 font-medium">Portfolio CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59] tracking-tight flex items-center gap-2.5">
            <FolderGit2 className="text-[#0756A5]" size={28} />
            <span>Case Studies & Portfolio Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Showcase enterprise deliverables, client results, tech stacks, and live demo routes dynamically.
          </p>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <a
            href="/portfolio"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <ExternalLink size={14} className="text-gray-400" />
            <span>Public Portfolio</span>
          </a>

          <button
            onClick={fetchProjects}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-2xs transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#0756A5]" : ""} />
          </button>

          <button
            onClick={handleOpenCreate}
            disabled={!canAdd}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
              !canAdd
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange hover:scale-[1.02]"
            }`}
          >
            {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
            <span>Add Case Study</span>
          </button>
        </div>
      </div>

      {/* PERMISSION STATUS BANNER */}
      {(!canAdd || !canEdit || !canDelete) && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Role Button Permissions Restricted for Portfolio CMS:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {!canAdd && <li><strong>Add Case Study:</strong> Disabled.</li>}
              {!canEdit && <li><strong>Edit Case Study:</strong> Disabled.</li>}
              {!canDelete && <li><strong>Delete Case Study:</strong> Disabled.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* SEARCH AND CATEGORY FILTER */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects by title, client industry, or tech stack (e.g. Next.js, Docker, Flutter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-gray-400 flex items-center gap-1.5">
              <Filter size={12} />
              <span>Category Filter</span>
            </span>
            <span className="text-xs font-bold text-[#0756A5]">
              Showing {filteredProjects.length} of {projects.length} Case Studies
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {PORTFOLIO_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#0756A5] text-white font-bold shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PROJECTS GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-2xl border p-5 animate-pulse space-y-3">
              <div className="h-6 w-1/3 bg-gray-200 rounded" />
              <div className="h-4 w-3/4 bg-gray-200 rounded" />
              <div className="h-20 w-full bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <FolderGit2 size={44} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-[#082B59]">No Case Studies Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No projects match your current filters. Add a new case study or clear your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((p, idx) => (
            <div
              key={p._id || p.slug}
              className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0756A5] border border-blue-100">
                    #{String(p.order || idx + 1).padStart(2, "0")}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {p.featured && (
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Star size={9} className="fill-amber-500 text-amber-500" />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[150px]">
                      {p.clientIndustry || p.category}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                  <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                    {p.category}
                  </span>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {p.summary}
                </p>

                {/* Tech Stack Pills */}
                {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {p.techStack.slice(0, 3).map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-gray-100 text-gray-600"
                      >
                        {tech}
                      </span>
                    ))}
                    {p.techStack.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-gray-50 text-gray-400">
                        +{p.techStack.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Key Result */}
                {Array.isArray(p.results) && p.results.length > 0 && (
                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                    <CheckCircle2 size={12} className="text-emerald-600 shrink-0" />
                    <span className="truncate">{p.results[0]}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                {p.demoUrl ? (
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <Play size={11} className="fill-purple-700" />
                    <span>Demo</span>
                  </a>
                ) : (
                  <div className="flex-1" />
                )}

                <button
                  onClick={() => handleOpenEdit(p)}
                  disabled={!canEdit}
                  className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                    canEdit
                      ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {!canEdit ? <Lock size={12} /> : <Edit size={13} />}
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(p)}
                  disabled={!canDelete || deleteLoading === p._id}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                    canDelete
                      ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                      : "text-gray-300 cursor-not-allowed"
                  }`}
                >
                  {deleteLoading === p._id ? (
                    <RefreshCw size={13} className="animate-spin text-red-500" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                  <FolderGit2 size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#082B59]">
                    {editingProject ? "Edit Case Study" : "Add New Case Study"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Document enterprise transformation and verifiable client deliverables
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Type size={13} className="text-[#0756A5]" />
                  <span>Case Study Title *</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Omnichannel B2B Marketplace Engine"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Hash size={13} className="text-[#0756A5]" />
                    <span>Slug Identifier *</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#0756A5]" />
                    <span>Service Category</span>
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {PORTFOLIO_CATEGORIES.filter((c) => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Client Industry */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span>Client Industry / Sector</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.clientIndustry}
                    onChange={(e) => setFormData({ ...formData, clientIndustry: e.target.value })}
                    placeholder="e.g. Healthcare, Industrial Manufacturing"
                  />
                </div>

                {/* Demo Route URL */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <LinkIcon size={13} className="text-purple-600" />
                    <span>Live Demo Route</span>
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.demoUrl}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="e.g. /live-demos/multi-vendor-marketplace"
                  />
                </div>
              </div>

              {/* Summary */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Executive Summary *
                </label>
                <textarea
                  required
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="High-level commercial impact and architectural scope..."
                />
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Tech Stack (Comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.techStack}
                  onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                  placeholder="React.js, Node.js, PostgreSQL, Docker, AWS"
                />
              </div>

              {/* Deliverables */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Key Deliverables (Comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Customer PWA Storefront, Vendor Seller Portal, Dispatch Hub"
                />
              </div>

              {/* Verifiable Results */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Verifiable Results / ROI (Comma-separated)
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.results}
                  onChange={(e) => setFormData({ ...formData, results: e.target.value })}
                  placeholder="340% increase in checkout speed, 99.98% production uptime"
                />
              </div>

              {/* Checkboxes & Order */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#0756A5]"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <span>Feature on Public Homepage / Top of Portfolio</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Order:</span>
                  <input
                    type="number"
                    min="0"
                    className="w-16 rounded-xl border border-gray-200 p-1.5 text-xs text-center text-gray-800"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                  className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0756A5] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50"
                >
                  {saving ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioControl;
