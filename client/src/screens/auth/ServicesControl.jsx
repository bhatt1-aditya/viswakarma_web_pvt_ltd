import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Layers,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Lock,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";
import ViewModal from "../../components/AdminComponents/service/ViewModal";
import ServiceCreateModal from "../../components/AdminComponents/service/ServiceCreateModal";
import ServiceUpdateModal from "../../components/AdminComponents/service/ServiceUpdateModal";
import ServiceSkeletonAdmin from "../../components/AdminComponents/service/ServiceSkeletonAdmin";
import allServicesFallback from "../../data/all108Services.json";
import categoriesFallback from "../../data/categoriesData.json";

const ServicesControl = () => {
  const navigate = useNavigate();
  const { user, permissions, authLoading } = useAuth();

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const isAdmin = ["admin", "superadmin"].includes(roleName);

  // Parent Website Controls permission check:
  // Must be Admin OR have (websiteControl === true AND servicesControl === true)
  const hasServicesControlAccess =
    isAdmin ||
    (permissions?.sidebar?.websiteControl === true &&
      permissions?.sidebar?.servicesControl === true);

  // Granular button permissions
  const canAdd = isAdmin || permissions?.buttons?.servicesControl?.add === true;
  const canEdit = isAdmin || permissions?.buttons?.servicesControl?.edit === true;
  const canDelete = isAdmin || permissions?.buttons?.servicesControl?.delete === true;

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/services/all?limit=250`);
      if (res.data.success && Array.isArray(res.data.services) && res.data.services.length > 0) {
        setServices(res.data.services);
      } else {
        setServices(allServicesFallback);
      }
    } catch (err) {
      console.warn("Using offline services fallback:", err);
      setServices(allServicesFallback);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/services/categories`);
      if (res.data.success && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
        setCategories(res.data.categories);
      } else {
        setCategories(categoriesFallback);
      }
    } catch (err) {
      console.warn("Using offline categories fallback:", err);
      setCategories(categoriesFallback);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, [fetchServices, fetchCategories]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesCat =
        selectedCategory === "all" || srv.categorySlug === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        srv.title?.toLowerCase().includes(q) ||
        srv.shortDescription?.toLowerCase().includes(q) ||
        srv.categoryName?.toLowerCase().includes(q) ||
        srv.techStack?.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  // Reset pagination on search/category change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const currentServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(start, start + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  const handleDelete = async (service) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete services.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Service?",
      text: `Are you sure you want to permanently delete "${service.title}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(service._id);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/services/delete/${service._id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success(`"${service.title}" deleted successfully!`);
        setServices((prev) => prev.filter((s) => s._id !== service._id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete service");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0756A5] rounded-full animate-spin" />
      </div>
    );
  }

  // Access control guard
  if (!hasServicesControlAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
          You do not have permission to access the Services CMS. Please contact your administrator to
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0756A5] border border-blue-200">
              Website Controls
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500 font-medium">Services CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59] tracking-tight flex items-center gap-2.5">
            <Layers className="text-[#0756A5]" size={28} />
            <span>All Services Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Create, update, search, and manage all public IT and software engineering services dynamically.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <a
            href="/services"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <ExternalLink size={14} className="text-gray-400" />
            <span>Public Catalog</span>
          </a>

          <button
            onClick={fetchServices}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-2xs transition-colors"
            title="Refresh Services"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#0756A5]" : ""} />
          </button>

          <button
            onClick={() => {
              if (!canAdd) {
                toast.error("Action Forbidden: You do not have 'Add Service' permission.");
                return;
              }
              setCreateModalOpen(true);
            }}
            disabled={!canAdd}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
              !canAdd
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange hover:scale-[1.02]"
            }`}
            title={
              !canAdd
                ? "Add Restricted: You do not have permission to add services"
                : "Create a new service in catalog"
            }
          >
            {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* PERMISSION STATUS BANNER */}
      {(!canAdd || !canEdit || !canDelete) && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Role Button Permissions Restricted for Services CMS:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {!canAdd && <li><strong>Add Service:</strong> Disabled (cannot create new entries).</li>}
              {!canEdit && <li><strong>Edit Service:</strong> Disabled (cannot modify service details).</li>}
              {!canDelete && <li><strong>Delete Service:</strong> Disabled (cannot delete service records).</li>}
            </ul>
          </div>
        </div>
      )}

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs mb-6 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search services by name, category, or tech stack (e.g. React, Python, Flutter, ERP)..."
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

        {/* Category Filter Pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase text-gray-400 flex items-center gap-1.5">
              <Filter size={12} />
              <span>Category Filter</span>
            </span>
            <span className="text-xs font-bold text-[#0756A5]">
              Showing {filteredServices.length} of {services.length} Services
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === "all"
                  ? "bg-[#082B59] text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Categories ({services.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-[#0756A5] text-white font-bold shadow-xs"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SERVICES CONTENT */}
      {loading ? (
        <ServiceSkeletonAdmin />
      ) : filteredServices.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
          <FolderKanban size={44} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-[#082B59]">No Services Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            No service matched your current search query or category filter. Try clearing filters or
            adding a new service.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-2 bg-[#0756A5] text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Services Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentServices.map((service) => (
              <div
                key={service._id || service.slug}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-2.5">
                  {/* Card Header: Service ID & Category */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0756A5] border border-blue-100">
                      #{String(service.idNumber || 1).padStart(3, "0")}
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[160px]">
                      {service.categoryName}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors line-clamp-1">
                    {service.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Tech Stack Pills */}
                  {Array.isArray(service.techStack) && service.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {service.techStack.slice(0, 3).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-gray-100 text-gray-600"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.techStack.length > 3 && (
                        <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-gray-50 text-gray-400">
                          +{service.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setViewModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-blue-50 text-[#0756A5] text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    title="View Service Details"
                  >
                    <Eye size={13} />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => {
                      if (!canEdit) {
                        toast.error("Action Forbidden: You do not have 'Edit Service' permission.");
                        return;
                      }
                      setSelectedService(service);
                      setUpdateModalOpen(true);
                    }}
                    disabled={!canEdit}
                    className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${
                      canEdit
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                    }`}
                    title={
                      canEdit
                        ? "Edit Service"
                        : "Edit Restricted: You do not have permission to edit services"
                    }
                  >
                    {!canEdit ? <Lock size={12} /> : <Edit size={13} />}
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(service)}
                    disabled={!canDelete || deleteLoading === service._id}
                    className={`p-2 rounded-xl text-xs font-bold transition-colors ${
                      canDelete
                        ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                    title={
                      canDelete
                        ? "Delete Service"
                        : "Delete Restricted: You do not have permission to delete services"
                    }
                  >
                    {deleteLoading === service._id ? (
                      <RefreshCw size={13} className="animate-spin text-red-500" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <span className="text-xs text-gray-500">
                Page <strong className="text-gray-900">{currentPage}</strong> of{" "}
                <strong className="text-gray-900">{totalPages}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="hidden sm:flex items-center gap-1 text-xs">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === totalPages ||
                        (p >= currentPage - 1 && p <= currentPage + 1)
                    )
                    .map((p, idx, arr) => {
                      const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                      return (
                        <React.Fragment key={p}>
                          {showEllipsis && <span className="px-1 text-gray-400">…</span>}
                          <button
                            onClick={() => setCurrentPage(p)}
                            className={`w-8 h-8 rounded-xl font-bold transition-all ${
                              currentPage === p
                                ? "bg-[#0756A5] text-white shadow-xs"
                                : "text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {p}
                          </button>
                        </React.Fragment>
                      );
                    })}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      {viewModalOpen && selectedService && (
        <ViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          service={selectedService}
        />
      )}

      {createModalOpen && (
        <ServiceCreateModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onServiceCreated={() => {
            fetchServices();
          }}
          categories={categories}
        />
      )}

      {updateModalOpen && selectedService && (
        <ServiceUpdateModal
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          onServiceUpdated={() => {
            fetchServices();
          }}
          service={selectedService}
          categories={categories}
        />
      )}
    </div>
  );
};

export default ServicesControl;
