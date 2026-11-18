import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import API_BASE_URL from "../../../utils/apiConfig";

const ServiceCreateModal = ({ isOpen, onClose, onServiceCreated, categories = [] }) => {
  const [formData, setFormData] = useState({
    title: "",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "",
    overview: "",
    demoSlug: "corporate-website",
    techStack: "React.js, Node.js, Tailwind CSS",
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/services/create`,
        payload,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.data.success) {
        toast.success("Service added successfully!");
        onServiceCreated();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create service");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-xl font-bold text-[#082B59]">Add New Service</h2>
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
              placeholder="e.g. AI-Powered Workflow Automations"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Category *</label>
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
                <option value="website-design-development">Website Design & Development</option>
                <option value="content-management-systems">Content Management Systems (CMS)</option>
                <option value="ecommerce-solutions">E-Commerce Solutions</option>
                <option value="mobile-app-development">Mobile Application Development</option>
                <option value="custom-software-enterprise">Custom Software & Enterprise Solutions</option>
                <option value="ai-machine-learning-automation">AI, Machine Learning & Automation</option>
                <option value="cloud-devops-infrastructure">Cloud, DevOps & IT Infrastructure</option>
                <option value="digital-marketing-seo">Digital Marketing & SEO</option>
                <option value="ui-ux-design-branding">UI/UX Design & Branding</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase">Demo Route ID</label>
              <select
                className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
                value={formData.demoSlug}
                onChange={(e) => setFormData({ ...formData, demoSlug: e.target.value })}
              >
                <option value="corporate-website">corporate-website</option>
                <option value="ecommerce-store">ecommerce-store</option>
                <option value="multi-vendor-marketplace">multi-vendor-marketplace</option>
                <option value="crm-software">crm-software</option>
                <option value="erp-software">erp-software</option>
                <option value="hrms-software">hrms-software</option>
                <option value="school-management">school-management</option>
                <option value="hospital-management">hospital-management</option>
                <option value="restaurant-management">restaurant-management</option>
                <option value="real-estate-portal">real-estate-portal</option>
                <option value="travel-booking">travel-booking</option>
                <option value="ai-chatbot">ai-chatbot</option>
                <option value="analytics-dashboard">analytics-dashboard</option>
                <option value="inventory-management">inventory-management</option>
                <option value="invoice-billing">invoice-billing</option>
                <option value="admin-dashboard">admin-dashboard</option>
                <option value="mobile-app">mobile-app</option>
                <option value="landing-page">landing-page</option>
                <option value="cms-blog">cms-blog</option>
                <option value="automation-workflow">automation-workflow</option>
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
              placeholder="High-level commercial summary..."
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
              placeholder="Detailed architecture and scope..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase">Tech Stack (comma-separated)</label>
            <input
              type="text"
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:border-[#0756A5] focus:outline-none"
              value={formData.techStack}
              onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
              placeholder="React.js, Node.js, MongoDB, Docker"
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
              className="rounded-lg bg-[#0756A5] px-6 py-2 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceCreateModal;
