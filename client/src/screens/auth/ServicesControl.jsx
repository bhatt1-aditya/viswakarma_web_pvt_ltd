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
  MonitorPlay,
  Play,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";
import ViewModal from "../../components/AdminComponents/service/ViewModal";
import ServiceCreateModal from "../../components/AdminComponents/service/ServiceCreateModal";
import ServiceUpdateModal from "../../components/AdminComponents/service/ServiceUpdateModal";
import CategoryModal from "../../components/AdminComponents/service/CategoryModal";
import DemoModal from "../../components/AdminComponents/service/DemoModal";
import ServiceSkeletonAdmin from "../../components/AdminComponents/service/ServiceSkeletonAdmin";
import allServicesFallback from "../../data/all108Services.json";
import categoriesFallback from "../../data/categoriesData.json";
import demosFallback from "../../data/demosData.json";

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

  // Active Main Sub-Tab: "services" | "categories" | "demos"
  const [activeTab, setActiveTab] = useState("services");

  // Core Data
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [demos, setDemos] = useState([]);

  // Loaders
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingDemos, setLoadingDemos] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Search & Filter states
  // 1. Services
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  // 2. Categories
  const [categorySearch, setCategorySearch] = useState("");
  // 3. Demos
  const [demoSearch, setDemoSearch] = useState("");
  const [demoCategoryFilter, setDemoCategoryFilter] = useState("all");

  // Modals state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createServiceOpen, setCreateServiceOpen] = useState(false);
  const [updateServiceOpen, setUpdateServiceOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Category Modal
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryToEdit, setSelectedCategoryToEdit] = useState(null);

  // Demo Modal
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedDemoToEdit, setSelectedDemoToEdit] = useState(null);

  // Pagination state for services
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // FETCH SERVICES
  const fetchServices = useCallback(async () => {
    try {
      setLoadingServices(true);
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
      setLoadingServices(false);
    }
  }, []);

  // FETCH CATEGORIES
  const fetchCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const res = await axios.get(`${API_BASE_URL}/services/categories`);
      if (res.data.success && Array.isArray(res.data.categories) && res.data.categories.length > 0) {
        setCategories(res.data.categories);
      } else {
        setCategories(categoriesFallback);
      }
    } catch (err) {
      console.warn("Using offline categories fallback:", err);
      setCategories(categoriesFallback);
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  // FETCH DEMOS
  const fetchDemos = useCallback(async () => {
    try {
      setLoadingDemos(true);
      const res = await axios.get(`${API_BASE_URL}/demos/all`);
      if (res.data.success && Array.isArray(res.data.demos) && res.data.demos.length > 0) {
        setDemos(res.data.demos);
      } else {
        setDemos(demosFallback);
      }
    } catch (err) {
      console.warn("Using offline demos fallback:", err);
      setDemos(demosFallback);
    } finally {
      setLoadingDemos(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchDemos();
  }, [fetchServices, fetchCategories, fetchDemos]);

  // ================= SERVICES FILTERING & PAGINATION =================
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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const currentServices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(start, start + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  // ================= CATEGORIES FILTERING =================
  const filteredCategories = useMemo(() => {
    const q = categorySearch.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(q) ||
        cat.slug?.toLowerCase().includes(q) ||
        cat.description?.toLowerCase().includes(q)
    );
  }, [categories, categorySearch]);

  // ================= DEMOS FILTERING =================
  const filteredDemos = useMemo(() => {
    return demos.filter((demo) => {
      const matchesCat =
        demoCategoryFilter === "all" || demo.category === demoCategoryFilter;

      const q = demoSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        demo.title?.toLowerCase().includes(q) ||
        demo.demoId?.toLowerCase().includes(q) ||
        demo.description?.toLowerCase().includes(q) ||
        demo.features?.some((f) => f.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  }, [demos, demoCategoryFilter, demoSearch]);

  // Unique demo categories for demo filter dropdown
  const demoCategoryOptions = useMemo(() => {
    const cats = new Set(demos.map((d) => d.category).filter(Boolean));
    return Array.from(cats);
  }, [demos]);

  // ================= DELETE SERVICE HANDLER =================
  const handleDeleteService = async (service) => {
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

  // ================= DELETE CATEGORY HANDLER =================
  const handleDeleteCategory = async (cat) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete categories.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Category?",
      text: `Are you sure you want to delete category "${cat.name}"? Services linked to this category may need re-categorization.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Category",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(cat._id || cat.slug);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/services/categories/delete/${cat._id || cat.slug}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success(`Category "${cat.name}" deleted!`);
        setCategories((prev) => prev.filter((c) => (c._id ? c._id !== cat._id : c.slug !== cat.slug)));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete category");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // ================= DELETE DEMO HANDLER =================
  const handleDeleteDemo = async (demo) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete demo routes.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Demo Route?",
      text: `Are you sure you want to delete "${demo.title}" (${demo.demoId})?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete Demo",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(demo._id || demo.demoId);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/demos/delete/${demo._id || demo.demoId}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success(`Demo "${demo.title}" deleted!`);
        setDemos((prev) => prev.filter((d) => (d._id ? d._id !== demo._id : d.demoId !== demo.demoId)));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete demo route");
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
      <div className="mx-auto px-4 py-16 text-center">
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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0756A5] border border-blue-200">
              Website Controls
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500 font-medium">Services CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59] tracking-tight flex items-center gap-2.5">
            {activeTab === "services" && <Layers className="text-[#0756A5]" size={28} />}
            {activeTab === "categories" && <FolderKanban className="text-[#0756A5]" size={28} />}
            {activeTab === "demos" && <MonitorPlay className="text-purple-600" size={28} />}
            <span>
              {activeTab === "services" && "All Services Catalog"}
              {activeTab === "categories" && "Service Categories Management"}
              {activeTab === "demos" && "Live Demo Routes Management"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            {activeTab === "services" &&
              "Create, update, search, and manage all public IT and software engineering services dynamically."}
            {activeTab === "categories" &&
              "Create and organize service classifications, URLs, descriptions, and hierarchy dynamically."}
            {activeTab === "demos" &&
              "Manage interactive live demo simulations, route slugs, features, and direct prototype links."}
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          {activeTab === "services" && (
            <a
              href="/services"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
            >
              <ExternalLink size={14} className="text-gray-400" />
              <span>Public Catalog</span>
            </a>
          )}

          {activeTab === "demos" && (
            <a
              href="/live-demos"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-xs font-bold text-purple-700 shadow-2xs transition-colors"
            >
              <ExternalLink size={14} className="text-purple-500" />
              <span>Public Demos Center</span>
            </a>
          )}

          <button
            onClick={() => {
              if (activeTab === "services") fetchServices();
              if (activeTab === "categories") fetchCategories();
              if (activeTab === "demos") fetchDemos();
            }}
            disabled={loadingServices || loadingCategories || loadingDemos}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-2xs transition-colors"
            title="Refresh current list"
          >
            <RefreshCw
              size={15}
              className={
                loadingServices || loadingCategories || loadingDemos
                  ? "animate-spin text-[#0756A5]"
                  : ""
              }
            />
          </button>

          {/* TAB-SPECIFIC ADD BUTTON */}
          {activeTab === "services" && (
            <button
              onClick={() => {
                if (!canAdd) {
                  toast.error("Action Forbidden: You do not have 'Add Service' permission.");
                  return;
                }
                setCreateServiceOpen(true);
              }}
              disabled={!canAdd}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${!canAdd
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange hover:scale-[1.02]"
                }`}
            >
              {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
              <span>Add Service</span>
            </button>
          )}

          {activeTab === "categories" && (
            <button
              onClick={() => {
                if (!canAdd) {
                  toast.error("Action Forbidden: You do not have 'Add' permission.");
                  return;
                }
                setSelectedCategoryToEdit(null);
                setCategoryModalOpen(true);
              }}
              disabled={!canAdd}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${!canAdd
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-[#0756A5] text-white hover:bg-blue-700 hover:scale-[1.02]"
                }`}
            >
              {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
              <span>Add Category</span>
            </button>
          )}

          {activeTab === "demos" && (
            <button
              onClick={() => {
                if (!canAdd) {
                  toast.error("Action Forbidden: You do not have 'Add' permission.");
                  return;
                }
                setSelectedDemoToEdit(null);
                setDemoModalOpen(true);
              }}
              disabled={!canAdd}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${!canAdd
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02]"
                }`}
            >
              {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
              <span>Add Demo Route</span>
            </button>
          )}
        </div>
      </div>

      {/* PERMISSION STATUS BANNER */}
      {(!canAdd || !canEdit || !canDelete) && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Role Button Permissions Restricted for Services CMS:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {!canAdd && <li><strong>Add Capability:</strong> Disabled (cannot create entries).</li>}
              {!canEdit && <li><strong>Edit Capability:</strong> Disabled (cannot modify records).</li>}
              {!canDelete && <li><strong>Delete Capability:</strong> Disabled (cannot remove records).</li>}
            </ul>
          </div>
        </div>
      )}

      {/* 3-WAY SUB-TAB NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "services"
            ? "border-[#0756A5] text-[#0756A5] bg-blue-50/70"
            : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
        >
          <Layers size={15} />
          <span>Services Catalog</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-[#0756A5] border border-blue-200 font-mono">
            {services.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("categories")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "categories"
            ? "border-[#0756A5] text-[#0756A5] bg-blue-50/70"
            : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
        >
          <FolderKanban size={15} />
          <span>Service Categories</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-gray-600 border border-gray-200 font-mono">
            {categories.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("demos")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === "demos"
            ? "border-purple-600 text-purple-700 bg-purple-50/70"
            : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
        >
          <MonitorPlay size={15} />
          <span>Interactive Demo Routes</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-purple-700 border border-purple-200 font-mono">
            {demos.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SERVICES CATALOG VIEW                             */}
      {/* ======================================================== */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {/* SEARCH AND FILTER BAR */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${selectedCategory === "all"
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${isSelected
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
          {loadingServices ? (
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
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0756A5] border border-blue-100">
                          #{String(service.idNumber || 1).padStart(3, "0")}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[160px]">
                          {service.categoryName}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors line-clamp-1">
                        {service.title}
                      </h3>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {service.shortDescription}
                      </p>

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
                          setUpdateServiceOpen(true);
                        }}
                        disabled={!canEdit}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${canEdit
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
                        onClick={() => handleDeleteService(service)}
                        disabled={!canDelete || deleteLoading === service._id}
                        className={`p-2 rounded-xl text-xs font-bold transition-colors ${canDelete
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
                                className={`w-8 h-8 rounded-xl font-bold transition-all ${currentPage === p
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
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SERVICE CATEGORIES MANAGEMENT VIEW                */}
      {/* ======================================================== */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* CATEGORY SEARCH & METRICS */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search categories by name, slug or description..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {categorySearch && (
                <button
                  onClick={() => setCategorySearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto text-xs text-gray-500">
              <span>Total Categories: <strong className="text-gray-900">{categories.length}</strong></span>
              <span className="text-gray-300">|</span>
              <span>Showing: <strong className="text-[#0756A5]">{filteredCategories.length}</strong></span>
            </div>
          </div>

          {/* CATEGORIES GRID */}
          {loadingCategories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border p-5 animate-pulse space-y-3">
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-12 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <FolderKanban size={44} className="mx-auto text-gray-300" />
              <h3 className="text-base font-bold text-[#082B59]">No Categories Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No categories match your search. You can create a new category anytime using the Add Category button.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCategories.map((cat) => {
                const linkedServicesCount = services.filter((s) => s.categorySlug === cat.slug).length;
                return (
                  <div
                    key={cat._id || cat.slug}
                    className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-blue-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                          <FolderKanban size={18} />
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200 font-bold">
                          Order #{cat.order || 0}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                          {cat.name}
                        </h3>
                        <span className="text-[10px] font-mono text-gray-400 block mt-0.5">
                          slug: {cat.slug}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                        {cat.description || "No description provided for this category."}
                      </p>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-[#0756A5] border border-blue-100 flex items-center gap-1">
                          <Layers size={11} />
                          <span>
                            {linkedServicesCount > 0 ? `${linkedServicesCount} Services Catalogued` : `${cat.serviceCount || 0} Default Services`}
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Category Actions */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          setActiveTab("services");
                        }}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-blue-50 text-[#0756A5] text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        title="View services under this category"
                      >
                        <Layers size={13} />
                        <span>Filter Services</span>
                      </button>

                      <button
                        onClick={() => {
                          if (!canEdit) {
                            toast.error("Action Forbidden: You do not have 'Edit' permission.");
                            return;
                          }
                          setSelectedCategoryToEdit(cat);
                          setCategoryModalOpen(true);
                        }}
                        disabled={!canEdit}
                        className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${canEdit
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                          }`}
                        title="Edit category details"
                      >
                        {!canEdit ? <Lock size={12} /> : <Edit size={13} />}
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCategory(cat)}
                        disabled={!canDelete || deleteLoading === (cat._id || cat.slug)}
                        className={`p-2 rounded-xl text-xs font-bold transition-colors ${canDelete
                          ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                          : "text-gray-300 cursor-not-allowed"
                          }`}
                        title="Delete category"
                      >
                        {deleteLoading === (cat._id || cat.slug) ? (
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
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: INTERACTIVE DEMO ROUTES MANAGEMENT VIEW           */}
      {/* ======================================================== */}
      {activeTab === "demos" && (
        <div className="space-y-6">
          {/* DEMO SEARCH & FILTER */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search demo by title, slug, or features..."
                value={demoSearch}
                onChange={(e) => setDemoSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              {demoSearch && (
                <button
                  onClick={() => setDemoSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                className="rounded-xl border border-gray-200 p-2 text-xs text-gray-700 focus:border-purple-600 focus:outline-none w-full md:w-auto"
                value={demoCategoryFilter}
                onChange={(e) => setDemoCategoryFilter(e.target.value)}
              >
                <option value="all">All Demo Categories ({demos.length})</option>
                {demoCategoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <span className="text-xs text-gray-500 shrink-0">
                Showing: <strong className="text-purple-700">{filteredDemos.length}</strong>
              </span>
            </div>
          </div>

          {/* DEMOS GRID */}
          {loadingDemos ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl border p-5 animate-pulse space-y-3">
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-12 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : filteredDemos.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <MonitorPlay size={44} className="mx-auto text-gray-300" />
              <h3 className="text-base font-bold text-[#082B59]">No Demo Routes Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No interactive demo routes match your filters. Add a new route using the button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDemos.map((demo) => (
                <div
                  key={demo._id || demo.demoId}
                  className="bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                        #{String(demo.demoNumber || 1).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-500 truncate max-w-[170px]">
                        {demo.category}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-[#082B59] group-hover:text-purple-700 transition-colors">
                        {demo.title}
                      </h3>
                      <span className="text-[10px] font-mono text-purple-600 block mt-0.5 font-bold">
                        {demo.route || `/live-demos/${demo.demoId}`}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {demo.description}
                    </p>

                    {/* Features Badges */}
                    {Array.isArray(demo.features) && demo.features.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold uppercase text-gray-400 block">
                          Key Features:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {demo.features.slice(0, 3).map((feat, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[10px] bg-gray-100 text-gray-700 flex items-center gap-1"
                            >
                              <CheckCircle2 size={10} className="text-emerald-500" />
                              <span>{feat}</span>
                            </span>
                          ))}
                          {demo.features.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-purple-50 text-purple-700 font-bold">
                              +{demo.features.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Demo Actions */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <a
                      href={demo.route || `/live-demos/${demo.demoId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 px-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                      title="Test live interactive demo"
                    >
                      <Play size={12} className="fill-purple-700" />
                      <span>Launch Demo</span>
                    </a>

                    <button
                      onClick={() => {
                        if (!canEdit) {
                          toast.error("Action Forbidden: You do not have 'Edit' permission.");
                          return;
                        }
                        setSelectedDemoToEdit(demo);
                        setDemoModalOpen(true);
                      }}
                      disabled={!canEdit}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 ${canEdit
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                        : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                      title="Edit demo route"
                    >
                      {!canEdit ? <Lock size={12} /> : <Edit size={13} />}
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteDemo(demo)}
                      disabled={!canDelete || deleteLoading === (demo._id || demo.demoId)}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors ${canDelete
                        ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                        : "text-gray-300 cursor-not-allowed"
                        }`}
                      title="Delete demo route"
                    >
                      {deleteLoading === (demo._id || demo.demoId) ? (
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
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS SECTION                                           */}
      {/* ======================================================== */}
      {/* Service View Modal */}
      {viewModalOpen && selectedService && (
        <ViewModal
          isOpen={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          service={selectedService}
        />
      )}

      {/* Service Create Modal */}
      {createServiceOpen && (
        <ServiceCreateModal
          isOpen={createServiceOpen}
          onClose={() => setCreateServiceOpen(false)}
          onServiceCreated={() => {
            fetchServices();
          }}
          categories={categories}
          onRefreshCategories={fetchCategories}
          canAdd={canAdd}
        />
      )}

      {/* Service Edit Modal */}
      {updateServiceOpen && selectedService && (
        <ServiceUpdateModal
          isOpen={updateServiceOpen}
          onClose={() => setUpdateServiceOpen(false)}
          onServiceUpdated={() => {
            fetchServices();
          }}
          service={selectedService}
          categories={categories}
          onRefreshCategories={fetchCategories}
          canAdd={canAdd}
        />
      )}

      {/* Category Create/Edit Modal */}
      {categoryModalOpen && (
        <CategoryModal
          isOpen={categoryModalOpen}
          onClose={() => {
            setCategoryModalOpen(false);
            setSelectedCategoryToEdit(null);
          }}
          onSuccess={() => {
            fetchCategories();
          }}
          category={selectedCategoryToEdit}
          canAdd={canAdd}
          canEdit={canEdit}
        />
      )}

      {/* Demo Create/Edit Modal */}
      {demoModalOpen && (
        <DemoModal
          isOpen={demoModalOpen}
          onClose={() => {
            setDemoModalOpen(false);
            setSelectedDemoToEdit(null);
          }}
          onSuccess={() => {
            fetchDemos();
          }}
          demo={selectedDemoToEdit}
          categories={categories}
          canAdd={canAdd}
          canEdit={canEdit}
        />
      )}
    </div>
  );
};

export default ServicesControl;
