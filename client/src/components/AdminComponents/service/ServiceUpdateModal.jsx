import React, { useState, useEffect } from "react";
import { X, Plus, Layers, MonitorPlay } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../utils/apiConfig";
import CategoryModal from "./CategoryModal";
import DemoModal from "./DemoModal";
import demosFallback from "../../../data/demosData.json";

const ServiceUpdateModal = ({
  isOpen,
  onClose,
  onServiceUpdated,
  service,
  categories = [],
  onRefreshCategories,
  canAdd = true,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "",
    overview: "",
    demoSlug: "corporate-website",
    techStack: "",
  });
  const [saving, setSaving] = useState(false);
  const [demos, setDemos] = useState([]);

  // Sub-modals for inline creation
  const [createCategoryOpen, setCreateCategoryOpen] = useState(false);
  const [createDemoOpen, setCreateDemoOpen] = useState(false);

  // Fetch demos dynamically
  const fetchDemos = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/demos/all`);
      if (res.data.success && Array.isArray(res.data.demos) && res.data.demos.length > 0) {
        setDemos(res.data.demos);
      } else {
        setDemos(demosFallback);
      }
    } catch {
      setDemos(demosFallback);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchDemos();
    }
    if (service) {
      setFormData({
        title: service.title || "",
        categorySlug: service.categorySlug || "website-design-development",
        categoryName: service.categoryName || "Website Design & Development",
        shortDescription: service.shortDescription || "",
        overview: service.overview || "",
        demoSlug: service.demoSlug || "corporate-website",
        techStack: Array.isArray(service.techStack) ? service.techStack.join(", ") : "",
      });
    }
  }, [service, isOpen]);

  if (!isOpen || !service) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${API_BASE_URL}/services/update/${service._id}`,
        payload,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.success) {
        toast.success("Service updated successfully!");
        onServiceUpdated();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
        <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-xl font-bold text-[#082B59]">Edit Service #{service.idNumber}</h2>
            <button onClick={onClose} className="rounded-full p-2 text-gray-400 hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Service Title *</label>
              <input
                type="text"
                required
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Dropdown with dynamic list and inline + Add */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                    <Layers size={13} className="text-[#0756A5]" />
                    <span>Category *</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCreateCategoryOpen(true)}
                    className="text-[11px] font-bold text-[#0756A5] hover:text-blue-800 flex items-center gap-0.5 hover:underline"
                    title="Add new category"
                  >
                    <Plus size={12} />
                    <span>New Category</span>
                  </button>
                </div>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                  value={formData.categorySlug}
                  onChange={(e) => {
                    const selected = categories.find((c) => c.slug === e.target.value);
                    setFormData({
                      ...formData,
                      categorySlug: e.target.value,
                      categoryName: selected ? selected.name : e.target.value,
                    });
                  }}
                >
                  {categories.map((cat) => (
                    <option key={cat.slug || cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Demo Route Dropdown with dynamic list and inline + Add */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 uppercase flex items-center gap-1">
                    <MonitorPlay size={13} className="text-purple-600" />
                    <span>Demo Route ID</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCreateDemoOpen(true)}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-0.5 hover:underline"
                    title="Add new demo route"
                  >
                    <Plus size={12} />
                    <span>New Demo</span>
                  </button>
                </div>
                <select
                  className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                  value={formData.demoSlug}
                  onChange={(e) => setFormData({ ...formData, demoSlug: e.target.value })}
                >
                  {demos.map((demo) => (
                    <option key={demo.demoId || demo._id} value={demo.demoId}>
                      {demo.title} ({demo.demoId})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Short Description *</label>
              <textarea
                required
                rows={2}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Comprehensive Overview *</label>
              <textarea
                required
                rows={4}
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Tech Stack (comma-separated)</label>
              <input
                type="text"
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                value={formData.techStack}
                onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-[#FF6900] px-6 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Service"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* INLINE NEW CATEGORY MODAL */}
      {createCategoryOpen && (
        <CategoryModal
          isOpen={createCategoryOpen}
          onClose={() => setCreateCategoryOpen(false)}
          canAdd={canAdd}
          onSuccess={(newCat) => {
            if (onRefreshCategories) onRefreshCategories();
            if (newCat) {
              setFormData((prev) => ({
                ...prev,
                categorySlug: newCat.slug,
                categoryName: newCat.name,
              }));
            }
          }}
        />
      )}

      {/* INLINE NEW DEMO ROUTE MODAL */}
      {createDemoOpen && (
        <DemoModal
          isOpen={createDemoOpen}
          onClose={() => setCreateDemoOpen(false)}
          categories={categories}
          canAdd={canAdd}
          onSuccess={(newDemo) => {
            fetchDemos();
            if (newDemo) {
              setFormData((prev) => ({
                ...prev,
                demoSlug: newDemo.demoId,
              }));
            }
          }}
        />
      )}
    </>
  );
};

export default ServiceUpdateModal;
