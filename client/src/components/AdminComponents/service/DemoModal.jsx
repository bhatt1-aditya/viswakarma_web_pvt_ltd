import React, { useState, useEffect } from "react";
import { X, MonitorPlay, Type, Hash, AlignLeft, Sparkles, AlertCircle, Link, CheckSquare } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../utils/apiConfig";

const DemoModal = ({
  isOpen,
  onClose,
  onSuccess,
  demo = null,
  categories = [],
  canAdd = true,
  canEdit = true,
}) => {
  const isEditing = Boolean(demo && (demo._id || demo.demoId));

  const [formData, setFormData] = useState({
    title: "",
    demoId: "",
    category: "",
    route: "",
    description: "",
    icon: "LayoutDashboard",
    features: "",
    relatedServices: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (demo) {
      setFormData({
        title: demo.title || "",
        demoId: demo.demoId || "",
        category: demo.category || (categories[0]?.name || "Website Design & Development"),
        route: demo.route || (demo.demoId ? `/live-demos/${demo.demoId}` : ""),
        description: demo.description || "",
        icon: demo.icon || "LayoutDashboard",
        features: Array.isArray(demo.features) ? demo.features.join("\n") : "",
        relatedServices: Array.isArray(demo.relatedServices)
          ? demo.relatedServices.join(", ")
          : "",
      });
    } else {
      setFormData({
        title: "",
        demoId: "",
        category: categories[0]?.name || "Website Design & Development",
        route: "",
        description: "",
        icon: "LayoutDashboard",
        features: "Interactive UI\nReal-time Preview\nFilter & Search",
        relatedServices: "",
      });
    }
    setError("");
  }, [demo, categories, isOpen]);

  if (!isOpen) return null;

  // Auto generate demoId and route from title if creating
  const handleTitleChange = (e) => {
    const val = e.target.value;
    if (!isEditing) {
      const generatedId = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({
        ...prev,
        title: val,
        demoId: generatedId,
        route: generatedId ? `/live-demos/${generatedId}` : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isEditing && !canEdit) {
      toast.error("Action Forbidden: You do not have permission to edit demo routes.");
      return;
    }
    if (!isEditing && !canAdd) {
      toast.error("Action Forbidden: You do not have permission to add demo routes.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Demo Title is required.");
      return;
    }

    const cleanDemoId = (formData.demoId || formData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!cleanDemoId) {
      setError("A valid Demo ID / Slug is required.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        title: formData.title.trim(),
        demoId: cleanDemoId,
        category: formData.category || "Website Design & Development",
        route: formData.route.trim() || `/live-demos/${cleanDemoId}`,
        description: formData.description.trim(),
        icon: formData.icon || "LayoutDashboard",
        features: formData.features
          ? formData.features
              .split("\n")
              .map((f) => f.trim())
              .filter(Boolean)
          : [],
        relatedServices: formData.relatedServices
          ? formData.relatedServices
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      let res;
      if (isEditing && demo._id) {
        res = await axios.put(
          `${API_BASE_URL}/demos/update/${demo._id}`,
          payload,
          { withCredentials: true, headers }
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/demos/create`,
          payload,
          { withCredentials: true, headers }
        );
      }

      if (res.data.success) {
        toast.success(
          isEditing ? "Demo route updated successfully!" : "Demo route created successfully!"
        );
        if (onSuccess) onSuccess(res.data.demo);
        onClose();
      } else {
        setError(res.data.message || "Failed to save demo route");
      }
    } catch (err) {
      const errMsg =
        err.response?.data?.message || err.message || "An error occurred while saving";
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <MonitorPlay size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#082B59]">
                {isEditing ? "Edit Live Demo Route" : "Create New Demo Route"}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditing
                  ? `Configuring route for "${demo?.title}"`
                  : "Add an interactive simulation route under /live-demos/:demoId"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Type size={13} className="text-[#0756A5]" />
              <span>Demo Title *</span>
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="e.g. AI-Powered CRM & Sales Intelligence"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Demo ID */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Hash size={13} className="text-[#0756A5]" />
                <span>Demo ID (Slug) *</span>
              </label>
              <input
                type="text"
                required
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono text-gray-800 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
                value={formData.demoId}
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    demoId: val,
                    route: val ? `/live-demos/${val}` : prev.route,
                  }));
                }}
                placeholder="e.g. ai-crm-sales"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#0756A5]" />
                <span>Category</span>
              </label>
              {categories.length > 0 ? (
                <select
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((c) => (
                    <option key={c.slug || c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Website Design & Development"
                />
              )}
            </div>
          </div>

          {/* Route URL */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Link size={13} className="text-[#0756A5]" />
              <span>Live Route URL *</span>
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono text-gray-800 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.route}
              onChange={(e) => setFormData({ ...formData, route: e.target.value })}
              placeholder="/live-demos/your-demo-slug"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Public accessible interactive link (e.g. /live-demos/crm-software).
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <AlignLeft size={13} className="text-[#0756A5]" />
              <span>Description</span>
            </label>
            <textarea
              rows={2}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Interactive walkthrough showcasing core functionality and client workflows..."
            />
          </div>

          {/* Features (One per line) */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <CheckSquare size={13} className="text-[#0756A5]" />
              <span>Key Features (One feature per line)</span>
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 font-mono focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Live interactive KPI metrics&#10;Data filtering and export simulation&#10;Modern glassmorphism UI theme"
            />
          </div>

          {/* Related Services */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <span>Related Services (Comma-separated)</span>
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
              value={formData.relatedServices}
              onChange={(e) => setFormData({ ...formData, relatedServices: e.target.value })}
              placeholder="CRM Software, Customer Portal, ERP Systems"
            />
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? "Saving..." : isEditing ? "Update Demo Route" : "Create Demo Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DemoModal;
