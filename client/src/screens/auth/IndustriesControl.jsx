import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  Search,
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
  Layers,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Building,
  Compass,
  ShieldCheck,
  Truck,
  Store,
  Zap,
  Briefcase,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";

const AVAILABLE_ICONS = [
  "HeartPulse",
  "GraduationCap",
  "ShoppingCart",
  "Building",
  "Compass",
  "ShieldCheck",
  "Truck",
  "Layers",
  "Store",
  "Zap",
  "Briefcase",
  "Building2",
];

const ICON_COMPONENTS = {
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Building,
  Compass,
  ShieldCheck,
  Truck,
  Layers,
  Store,
  Zap,
  Briefcase,
  Building2,
};

const ACCENT_OPTIONS = [
  { label: "Blue / Cyan", value: "from-blue-600 to-cyan-500" },
  { label: "Indigo / Purple", value: "from-indigo-600 to-purple-500" },
  { label: "Precision Orange", value: "from-[#FF6900] to-amber-500" },
  { label: "Industrial Blue", value: "from-blue-500 to-blue-700" },
  { label: "Emerald / Teal", value: "from-emerald-500 to-teal-600" },
  { label: "Navy / Royal", value: "from-[#082B59] to-[#0756A5]" },
  { label: "Amber / Orange", value: "from-amber-600 to-orange-500" },
  { label: "Blue / Indigo", value: "from-blue-600 to-indigo-700" },
  { label: "Orange / Rose", value: "from-[#FF8A00] to-rose-500" },
  { label: "Cyan / Blue", value: "from-cyan-600 to-blue-700" },
  { label: "Slate / Navy", value: "from-blue-700 to-slate-800" },
];

const IndustriesControl = () => {
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
  const hasIndustriesAccess =
    isAdmin ||
    (permissions?.sidebar?.websiteControl === true &&
      permissions?.sidebar?.industriesControl === true);

  // Granular button permissions
  const canAdd = isAdmin || permissions?.buttons?.industriesControl?.add === true;
  const canEdit = isAdmin || permissions?.buttons?.industriesControl?.edit === true;
  const canDelete = isAdmin || permissions?.buttons?.industriesControl?.delete === true;

  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    icon: "HeartPulse",
    challenge: "",
    solution: "",
    keyServices: "",
    demoRoute: "",
    accent: "from-blue-600 to-cyan-500",
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchIndustries = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/industries/all`);
      if (res.data.success && Array.isArray(res.data.industries)) {
        setIndustries(res.data.industries);
      }
    } catch (err) {
      console.warn("Could not fetch industries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  // Open Create Modal
  const handleOpenCreate = () => {
    if (!canAdd) {
      toast.error("Action Forbidden: You do not have 'Add' permission.");
      return;
    }
    setEditingIndustry(null);
    setFormData({
      title: "",
      slug: "",
      icon: "HeartPulse",
      challenge: "",
      solution: "",
      keyServices: "",
      demoRoute: "",
      accent: "from-blue-600 to-cyan-500",
      order: industries.length + 1,
    });
    setFormError("");
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (ind) => {
    if (!canEdit) {
      toast.error("Action Forbidden: You do not have 'Edit' permission.");
      return;
    }
    setEditingIndustry(ind);
    setFormData({
      title: ind.title || "",
      slug: ind.slug || "",
      icon: ind.icon || "HeartPulse",
      challenge: ind.challenge || "",
      solution: ind.solution || "",
      keyServices: Array.isArray(ind.keyServices) ? ind.keyServices.join(", ") : "",
      demoRoute: ind.demoRoute || "",
      accent: ind.accent || "from-blue-600 to-cyan-500",
      order: ind.order !== undefined ? ind.order : 0,
    });
    setFormError("");
    setModalOpen(true);
  };

  // Auto slug generation
  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (!editingIndustry) {
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
      setFormError("Industry Title is required.");
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
        icon: formData.icon || "HeartPulse",
        challenge: formData.challenge.trim(),
        solution: formData.solution.trim(),
        keyServices: formData.keyServices
          ? formData.keyServices.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        demoRoute: formData.demoRoute.trim(),
        accent: formData.accent || "from-blue-600 to-cyan-500",
        order: Number(formData.order) || 0,
      };

      let res;
      if (editingIndustry && editingIndustry._id) {
        res = await axios.put(
          `${API_BASE_URL}/industries/update/${editingIndustry._id}`,
          payload,
          { withCredentials: true, headers }
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/industries/create`,
          payload,
          { withCredentials: true, headers }
        );
      }

      if (res.data.success) {
        toast.success(
          editingIndustry ? "Industry updated successfully!" : "Industry created successfully!"
        );
        fetchIndustries();
        setModalOpen(false);
      } else {
        setFormError(res.data.message || "Failed to save industry");
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "An error occurred");
      toast.error(err.response?.data?.message || "Failed to save industry");
    } finally {
      setSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async (ind) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete industry entries.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Industry?",
      text: `Are you sure you want to delete "${ind.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(ind._id);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/industries/delete/${ind._id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success(`"${ind.title}" deleted!`);
        setIndustries((prev) => prev.filter((item) => item._id !== ind._id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete industry");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Filtered List
  const filteredIndustries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return industries;
    return industries.filter(
      (ind) =>
        ind.title?.toLowerCase().includes(q) ||
        ind.slug?.toLowerCase().includes(q) ||
        ind.challenge?.toLowerCase().includes(q) ||
        ind.solution?.toLowerCase().includes(q)
    );
  }, [industries, searchQuery]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0756A5] rounded-full animate-spin" />
      </div>
    );
  }

  // Access Control Guard
  if (!hasIndustriesAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
          You do not have permission to access the Industries CMS. Please contact your administrator to
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
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0756A5] border border-blue-200">
              Website Controls
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500 font-medium">Industries CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59] tracking-tight flex items-center gap-2.5">
            <Building2 className="text-[#0756A5]" size={28} />
            <span>Industries & Sectors Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Manage industry architectures, challenges, engineered solutions, demo links, and pain points dynamically.
          </p>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <a
            href="/industries"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <ExternalLink size={14} className="text-gray-400" />
            <span>Public Industries</span>
          </a>

          <button
            onClick={fetchIndustries}
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
            <span>Add Industry</span>
          </button>
        </div>
      </div>

      {/* PERMISSION STATUS BANNER */}
      {(!canAdd || !canEdit || !canDelete) && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Role Button Permissions Restricted for Industries CMS:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {!canAdd && <li><strong>Add Industry:</strong> Disabled.</li>}
              {!canEdit && <li><strong>Edit Industry:</strong> Disabled.</li>}
              {!canDelete && <li><strong>Delete Industry:</strong> Disabled.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search industries by title, slug, or challenge..."
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

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Total Verticals: <strong className="text-gray-900">{industries.length}</strong></span>
          <span className="text-gray-300">|</span>
          <span>Showing: <strong className="text-[#0756A5]">{filteredIndustries.length}</strong></span>
        </div>
      </div>

      {/* INDUSTRIES GRID */}
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
      ) : filteredIndustries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <Building2 size={44} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-[#082B59]">No Industries Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No industry sector matches your search query. Try clearing the search or add a new industry sector.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIndustries.map((ind, idx) => {
            const IconComp = ICON_COMPONENTS[ind.icon] || Building2;
            return (
              <div
                key={ind._id || ind.slug}
                className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ind.accent || "from-blue-600 to-cyan-500"} text-white flex items-center justify-center shadow-sm`}>
                      <IconComp size={20} />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 font-bold">
                      Sector #{String(ind.order || idx + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                      {ind.title}
                    </h3>
                    <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                      slug: {ind.slug}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-100">
                      <span className="font-bold text-red-600 text-[10px] uppercase block">Challenge:</span>
                      <p className="text-gray-700 line-clamp-2 mt-0.5 leading-relaxed">{ind.challenge}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                      <span className="font-bold text-emerald-700 text-[10px] uppercase block">Solution:</span>
                      <p className="text-gray-800 font-medium line-clamp-2 mt-0.5 leading-relaxed">{ind.solution}</p>
                    </div>
                  </div>

                  {ind.demoRoute && (
                    <div className="pt-1">
                      <span className="text-[10px] font-mono text-purple-600 font-bold flex items-center gap-1">
                        <LinkIcon size={11} />
                        <span>{ind.demoRoute}</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  {ind.demoRoute ? (
                    <a
                      href={ind.demoRoute}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-blue-50 text-[#0756A5] text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <ExternalLink size={12} />
                      <span>Demo</span>
                    </a>
                  ) : (
                    <div className="flex-1" />
                  )}

                  <button
                    onClick={() => handleOpenEdit(ind)}
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
                    onClick={() => handleDelete(ind)}
                    disabled={!canDelete || deleteLoading === ind._id}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                      canDelete
                        ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {deleteLoading === ind._id ? (
                      <RefreshCw size={13} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                  <Building2 size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#082B59]">
                    {editingIndustry ? "Edit Industry Sector" : "Add Industry Sector"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Configure specialized domain architecture and commercial solutions
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
                  <span>Sector Title *</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Healthcare & Telemedicine"
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
                    placeholder="healthcare-telemedicine"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-[#0756A5]" />
                    <span>Icon</span>
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  >
                    {AVAILABLE_ICONS.map((ico) => (
                      <option key={ico} value={ico}>
                        {ico}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Accent Gradient */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span>Gradient Accent</span>
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.accent}
                    onChange={(e) => setFormData({ ...formData, accent: e.target.value })}
                  >
                    {ACCENT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                    <span>Display Order</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  />
                </div>
              </div>

              {/* Challenge */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <HelpCircle size={13} className="text-red-500" />
                  <span>Industry Pain Point / Challenge</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={formData.challenge}
                  onChange={(e) => setFormData({ ...formData, challenge: e.target.value })}
                  placeholder="Operational bottlenecks, fragmented communication, or compliance hurdles..."
                />
              </div>

              {/* Solution */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-emerald-600" />
                  <span>Our Engineered Solution</span>
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  placeholder="Architected software, portals, ERP integrations, or automated pipelines..."
                />
              </div>

              {/* Demo Route */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <LinkIcon size={13} className="text-purple-600" />
                  <span>Interactive Live Demo Route</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.demoRoute}
                  onChange={(e) => setFormData({ ...formData, demoRoute: e.target.value })}
                  placeholder="e.g. /live-demos/hospital-management"
                />
              </div>

              {/* Key Services */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                  <Layers size={13} className="text-[#0756A5]" />
                  <span>Key Services (Comma-separated)</span>
                </label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.keyServices}
                  onChange={(e) => setFormData({ ...formData, keyServices: e.target.value })}
                  placeholder="Hospital Management Software, Telemedicine Apps, EHR Portals"
                />
              </div>

              {/* Actions */}
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
                  {saving ? "Saving..." : editingIndustry ? "Update Industry" : "Create Industry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndustriesControl;
