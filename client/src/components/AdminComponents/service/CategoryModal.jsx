import React, { useState, useEffect } from "react";
import { X, Layers, Hash, Type, AlignLeft, Sparkles, AlertCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../utils/apiConfig";

const AVAILABLE_ICONS = [
  "Globe",
  "FileCode",
  "ShoppingCart",
  "Smartphone",
  "Layers",
  "Cpu",
  "Cloud",
  "TrendingUp",
  "Palette",
  "ShieldCheck",
  "Database",
  "Code",
  "Workflow",
  "Terminal",
];

const CategoryModal = ({ isOpen, onClose, onSuccess, category = null, canAdd = true, canEdit = true }) => {
  const isEditing = Boolean(category && (category._id || category.slug));

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Layers",
    order: 0,
    serviceCount: 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        icon: category.icon || "Layers",
        order: typeof category.order === "number" ? category.order : 0,
        serviceCount: category.serviceCount || 0,
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
        icon: "Layers",
        order: 0,
        serviceCount: 0,
      });
    }
    setError("");
  }, [category, isOpen]);

  if (!isOpen) return null;

  // Auto generate slug from category name if slug hasn't been manually diverged
  const handleNameChange = (e) => {
    const val = e.target.value;
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData((prev) => ({
        ...prev,
        name: val,
        slug: generatedSlug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isEditing && !canEdit) {
      toast.error("Action Forbidden: You do not have permission to edit categories.");
      return;
    }
    if (!isEditing && !canAdd) {
      toast.error("Action Forbidden: You do not have permission to add categories.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Category Name is required.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        name: formData.name.trim(),
        slug: (formData.slug || formData.name)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        description: formData.description.trim(),
        icon: formData.icon || "Layers",
        order: Number(formData.order) || 0,
      };

      let res;
      if (isEditing && category._id) {
        res = await axios.put(
          `${API_BASE_URL}/services/categories/update/${category._id}`,
          payload,
          { withCredentials: true, headers }
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/services/categories/create`,
          payload,
          { withCredentials: true, headers }
        );
      }

      if (res.data.success) {
        toast.success(
          isEditing ? "Category updated successfully!" : "Category created successfully!"
        );
        if (onSuccess) onSuccess(res.data.category);
        onClose();
      } else {
        setError(res.data.message || "Failed to save category");
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
      <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
              <Layers size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#082B59]">
                {isEditing ? "Edit Service Category" : "Create New Category"}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditing
                  ? `Updating "${category?.name}"`
                  : "Organize services under a clean dynamic category"}
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
          {/* Category Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Type size={13} className="text-[#0756A5]" />
              <span>Category Name *</span>
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g. Artificial Intelligence & Automation"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <Hash size={13} className="text-[#0756A5]" />
              <span>Category Slug (URL Identifier) *</span>
            </label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs font-mono text-gray-700 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g. ai-machine-learning-automation"
            />
            <p className="text-[10px] text-gray-400 mt-1">
              Used in routes and service categorization (lowercase, hyphens only).
            </p>
          </div>

          {/* Icon & Display Order */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <Sparkles size={13} className="text-[#0756A5]" />
                <span>Lucide Icon</span>
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              >
                {AVAILABLE_ICONS.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>

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
                placeholder="1, 2, 3..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1 flex items-center gap-1.5">
              <AlignLeft size={13} className="text-[#0756A5]" />
              <span>Description</span>
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:ring-1 focus:ring-[#0756A5] focus:outline-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enterprise software and services overview for this domain..."
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
              className="rounded-xl bg-[#0756A5] px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
