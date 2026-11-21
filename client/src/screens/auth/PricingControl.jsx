import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Lock,
  ShieldAlert,
  X,
  AlertCircle,
  HelpCircle,
  Star,
  Check,
} from "lucide-react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";

const PricingControl = () => {
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
  const hasPricingAccess =
    isAdmin ||
    (permissions?.sidebar?.websiteControl === true &&
      permissions?.sidebar?.pricingControl === true);

  // Granular button permissions
  const canAdd = isAdmin || permissions?.buttons?.pricingControl?.add === true;
  const canEdit = isAdmin || permissions?.buttons?.pricingControl?.edit === true;
  const canDelete = isAdmin || permissions?.buttons?.pricingControl?.delete === true;

  const [activeTab, setActiveTab] = useState("tiers"); // "tiers" | "faqs"

  const [tiers, setTiers] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Modal State for Tiers
  const [tierModalOpen, setTierModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState(null);
  const [tierFormData, setTierFormData] = useState({
    name: "",
    badge: "For Startups & SMBs",
    highlight: false,
    price: "Custom Scope",
    tagline: "",
    features: "",
    cta: "Request Consultation",
    ctaLink: "/quote",
    order: 0,
  });

  // Modal State for FAQs
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    q: "",
    a: "",
    order: 0,
  });

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchPricing = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/pricing/all`);
      if (res.data.success) {
        if (Array.isArray(res.data.tiers)) setTiers(res.data.tiers);
        if (Array.isArray(res.data.faqs)) setFaqs(res.data.faqs);
      }
    } catch (err) {
      console.warn("Could not fetch pricing data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  // Open Create Tier
  const handleOpenCreateTier = () => {
    if (!canAdd) {
      toast.error("Action Forbidden: You do not have 'Add' permission.");
      return;
    }
    setEditingTier(null);
    setTierFormData({
      name: "",
      badge: "For Startups & SMBs",
      highlight: false,
      price: "Custom Scope",
      tagline: "",
      features: "Custom responsive web or mobile app\nModern React / Node.js architecture\n30-day post-launch warranty\n100% IP & source code transfer",
      cta: "Request Consultation",
      ctaLink: "/quote",
      order: tiers.length + 1,
    });
    setFormError("");
    setTierModalOpen(true);
  };

  // Open Edit Tier
  const handleOpenEditTier = (tier) => {
    if (!canEdit) {
      toast.error("Action Forbidden: You do not have 'Edit' permission.");
      return;
    }
    setEditingTier(tier);
    setTierFormData({
      name: tier.name || "",
      badge: tier.badge || "",
      highlight: Boolean(tier.highlight),
      price: tier.price || "Custom Scope",
      tagline: tier.tagline || "",
      features: Array.isArray(tier.features) ? tier.features.join("\n") : "",
      cta: tier.cta || "Request Consultation",
      ctaLink: tier.ctaLink || "/quote",
      order: tier.order !== undefined ? tier.order : 0,
    });
    setFormError("");
    setTierModalOpen(true);
  };

  // Submit Tier
  const handleTierSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!tierFormData.name.trim()) {
      setFormError("Tier name is required.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        name: tierFormData.name.trim(),
        badge: tierFormData.badge.trim(),
        highlight: Boolean(tierFormData.highlight),
        price: tierFormData.price.trim(),
        tagline: tierFormData.tagline.trim(),
        features: tierFormData.features
          ? tierFormData.features.split("\n").map((f) => f.trim()).filter(Boolean)
          : [],
        cta: tierFormData.cta.trim(),
        ctaLink: tierFormData.ctaLink.trim() || "/quote",
        order: Number(tierFormData.order) || 0,
      };

      let res;
      if (editingTier && editingTier._id) {
        res = await axios.put(
          `${API_BASE_URL}/pricing/update/${editingTier._id}`,
          payload,
          { withCredentials: true, headers }
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/pricing/create`,
          payload,
          { withCredentials: true, headers }
        );
      }

      if (res.data.success) {
        toast.success(editingTier ? "Tier updated!" : "Tier created!");
        fetchPricing();
        setTierModalOpen(false);
      } else {
        setFormError(res.data.message || "Failed to save tier");
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "An error occurred");
      toast.error(err.response?.data?.message || "Failed to save tier");
    } finally {
      setSaving(false);
    }
  };

  // Delete Tier
  const handleDeleteTier = async (tier) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete pricing tiers.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete Tier?",
      text: `Are you sure you want to delete "${tier.name}"?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(tier._id);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/pricing/delete/${tier._id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success(`"${tier.name}" deleted!`);
        setTiers((prev) => prev.filter((item) => item._id !== tier._id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete tier");
      } finally {
        setDeleteLoading(null);
      }
    }
  };

  // Open Create FAQ
  const handleOpenCreateFaq = () => {
    if (!canAdd) {
      toast.error("Action Forbidden: You do not have 'Add' permission.");
      return;
    }
    setEditingFaq(null);
    setFaqFormData({ q: "", a: "", order: faqs.length + 1 });
    setFormError("");
    setFaqModalOpen(true);
  };

  // Open Edit FAQ
  const handleOpenEditFaq = (faq) => {
    if (!canEdit) {
      toast.error("Action Forbidden: You do not have 'Edit' permission.");
      return;
    }
    setEditingFaq(faq);
    setFaqFormData({
      q: faq.q || "",
      a: faq.a || "",
      order: faq.order !== undefined ? faq.order : 0,
    });
    setFormError("");
    setFaqModalOpen(true);
  };

  // Submit FAQ
  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!faqFormData.q.trim() || !faqFormData.a.trim()) {
      setFormError("Question and Answer are required.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const payload = {
        q: faqFormData.q.trim(),
        a: faqFormData.a.trim(),
        order: Number(faqFormData.order) || 0,
      };

      let res;
      if (editingFaq && editingFaq._id) {
        res = await axios.put(
          `${API_BASE_URL}/pricing/faqs/update/${editingFaq._id}`,
          payload,
          { withCredentials: true, headers }
        );
      } else {
        res = await axios.post(
          `${API_BASE_URL}/pricing/faqs/create`,
          payload,
          { withCredentials: true, headers }
        );
      }

      if (res.data.success) {
        toast.success(editingFaq ? "FAQ updated!" : "FAQ created!");
        fetchPricing();
        setFaqModalOpen(false);
      } else {
        setFormError(res.data.message || "Failed to save FAQ");
      }
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || "An error occurred");
      toast.error(err.response?.data?.message || "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (faq) => {
    if (!canDelete) {
      toast.error("Action Forbidden: You do not have permission to delete FAQs.");
      return;
    }

    const confirm = await Swal.fire({
      icon: "warning",
      title: "Delete FAQ?",
      text: `Are you sure you want to delete this FAQ?`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#EF4444",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#6B7280",
    });

    if (confirm.isConfirmed) {
      try {
        setDeleteLoading(faq._id);
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/pricing/faqs/delete/${faq._id}`, {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        toast.success("FAQ deleted!");
        setFaqs((prev) => prev.filter((item) => item._id !== faq._id));
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to delete FAQ");
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

  // Access Control Guard
  if (!hasPricingAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
          You do not have permission to access the Pricing CMS. Please contact your administrator to
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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none space-y-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-[#0756A5] border border-blue-200">
              Website Controls
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500 font-medium">Pricing CMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59] tracking-tight flex items-center gap-2.5">
            <Tag className="text-[#0756A5]" size={28} />
            <span>Pricing Packages & FAQs Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Configure transparent commercial engagement tiers, highlight badges, deliverables, and billing FAQs.
          </p>
        </div>

        {/* TOP ACTIONS */}
        <div className="flex items-center gap-2.5 self-start md:self-auto flex-wrap">
          <a
            href="/pricing"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <ExternalLink size={14} className="text-gray-400" />
            <span>Public Pricing Page</span>
          </a>

          <button
            onClick={fetchPricing}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-2xs transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#0756A5]" : ""} />
          </button>

          {activeTab === "tiers" ? (
            <button
              onClick={handleOpenCreateTier}
              disabled={!canAdd}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${!canAdd
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                  : "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange hover:scale-[1.02]"
                }`}
            >
              {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
              <span>Add Pricing Tier</span>
            </button>
          ) : (
            <button
              onClick={handleOpenCreateFaq}
              disabled={!canAdd}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${!canAdd
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                  : "bg-[#0756A5] text-white hover:bg-blue-700 hover:scale-[1.02]"
                }`}
            >
              {!canAdd ? <Lock size={14} /> : <Plus size={15} />}
              <span>Add New FAQ</span>
            </button>
          )}
        </div>
      </div>

      {/* PERMISSION STATUS BANNER */}
      {(!canAdd || !canEdit || !canDelete) && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Role Button Permissions Restricted for Pricing CMS:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {!canAdd && <li><strong>Add Tier / FAQ:</strong> Disabled.</li>}
              {!canEdit && <li><strong>Edit Tier / FAQ:</strong> Disabled.</li>}
              {!canDelete && <li><strong>Delete Tier / FAQ:</strong> Disabled.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* SUB-TAB NAV */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
        <button
          onClick={() => setActiveTab("tiers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${activeTab === "tiers"
              ? "border-[#0756A5] text-[#0756A5] bg-blue-50/70"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
        >
          <Tag size={15} />
          <span>Pricing Packages</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-[#0756A5] border border-blue-200 font-mono">
            {tiers.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("faqs")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${activeTab === "faqs"
              ? "border-[#0756A5] text-[#0756A5] bg-blue-50/70"
              : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`}
        >
          <HelpCircle size={15} />
          <span>Pricing & Billing FAQs</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-gray-600 border border-gray-200 font-mono">
            {faqs.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* VIEW 1: PRICING TIERS                                     */}
      {/* ======================================================== */}
      {activeTab === "tiers" && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border p-6 animate-pulse space-y-4">
                  <div className="h-6 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-28 w-full bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          ) : tiers.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <Tag size={44} className="mx-auto text-gray-300" />
              <h3 className="text-base font-bold text-[#082B59]">No Pricing Tiers Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add your commercial solution packages using the button above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tiers.map((tier, idx) => (
                <div
                  key={tier._id || idx}
                  className={`rounded-2xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-xs hover:shadow-md relative group ${tier.highlight
                      ? "bg-gradient-to-b from-blue-50/50 via-white to-white border-2 border-[#0756A5]"
                      : "bg-white border border-gray-200 hover:border-blue-300"
                    }`}
                >
                  {/* Highlight Ribbon */}
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Star size={10} className="fill-white" />
                      <span>Most Popular</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-[#0756A5] font-bold border border-blue-100">
                        {tier.badge || "Solution Tier"}
                      </span>
                      <span className="text-xs font-mono font-bold text-gray-400">
                        Order #{tier.order || idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-extrabold text-[#082B59]">
                        {tier.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                        {tier.tagline}
                      </p>
                    </div>

                    <div className="py-2 border-y border-gray-100">
                      <span className="text-xs font-bold text-gray-400 block uppercase text-[10px]">
                        Commercial Scope:
                      </span>
                      <span className="text-base font-extrabold text-[#0756A5]">
                        {tier.price || "Custom Quote"}
                      </span>
                    </div>

                    {/* Features List */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase text-gray-400 block">
                        Included Deliverables ({tier.features?.length || 0}):
                      </span>
                      <ul className="space-y-1">
                        {Array.isArray(tier.features) &&
                          tier.features.slice(0, 5).map((feat, i) => (
                            <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                              <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{feat}</span>
                            </li>
                          ))}
                        {tier.features?.length > 5 && (
                          <li className="text-[11px] font-bold text-[#0756A5] pl-5">
                            +{tier.features.length - 5} more deliverables
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenEditTier(tier)}
                      disabled={!canEdit}
                      className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 ${canEdit
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                    >
                      {!canEdit ? <Lock size={12} /> : <Edit size={13} />}
                      <span>Edit Tier</span>
                    </button>

                    <button
                      onClick={() => handleDeleteTier(tier)}
                      disabled={!canDelete || deleteLoading === tier._id}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors ${canDelete
                          ? "text-red-500 hover:bg-red-50 hover:text-red-700"
                          : "text-gray-300 cursor-not-allowed"
                        }`}
                    >
                      {deleteLoading === tier._id ? (
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
      {/* VIEW 2: PRICING FAQS                                      */}
      {/* ======================================================== */}
      {activeTab === "faqs" && (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl border p-5 animate-pulse h-20" />
              ))}
            </div>
          ) : faqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-3">
              <HelpCircle size={44} className="mx-auto text-gray-300" />
              <h3 className="text-base font-bold text-[#082B59]">No FAQs Found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Add frequently asked questions regarding billing milestones, IP handover, and SLAs.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={faq._id || idx}
                  className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0756A5] text-[10px] font-bold flex items-center justify-center">
                        Q
                      </span>
                      <h4 className="text-sm font-bold text-[#082B59]">{faq.q}</h4>
                    </div>
                    <p className="text-xs text-gray-600 pl-7 leading-relaxed">{faq.a}</p>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      onClick={() => handleOpenEditFaq(faq)}
                      disabled={!canEdit}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors ${canEdit
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-gray-100 text-gray-300 cursor-not-allowed"
                        }`}
                      title="Edit FAQ"
                    >
                      <Edit size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteFaq(faq)}
                      disabled={!canDelete || deleteLoading === faq._id}
                      className={`p-2 rounded-xl text-xs font-bold transition-colors ${canDelete
                          ? "text-red-500 hover:bg-red-50"
                          : "text-gray-300 cursor-not-allowed"
                        }`}
                      title="Delete FAQ"
                    >
                      {deleteLoading === faq._id ? (
                        <RefreshCw size={14} className="animate-spin text-red-500" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TIER CREATE / EDIT MODAL */}
      {tierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                  <Tag size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#082B59]">
                    {editingTier ? "Edit Pricing Tier" : "Add New Pricing Tier"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Configure engagement package and commercial scope
                  </p>
                </div>
              </div>
              <button
                onClick={() => setTierModalOpen(false)}
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

            <form onSubmit={handleTierSubmit} className="mt-4 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Tier Package Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={tierFormData.name}
                  onChange={(e) => setTierFormData({ ...tierFormData, name: e.target.value })}
                  placeholder="e.g. Starter Solutions"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Badge */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Badge Tagline
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={tierFormData.badge}
                    onChange={(e) => setTierFormData({ ...tierFormData, badge: e.target.value })}
                    placeholder="e.g. For Startups & SMBs"
                  />
                </div>

                {/* Price Display */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Price / Commercial Model
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={tierFormData.price}
                    onChange={(e) => setTierFormData({ ...tierFormData, price: e.target.value })}
                    placeholder="e.g. Custom Scope or Milestone-Based"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Short Value Proposition
                </label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={tierFormData.tagline}
                  onChange={(e) => setTierFormData({ ...tierFormData, tagline: e.target.value })}
                  placeholder="High-impact MVP development to validate business concepts rapidly..."
                />
              </div>

              {/* Features (One per line) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Deliverables & Features (One item per line)
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 font-mono focus:border-[#0756A5] focus:outline-none"
                  value={tierFormData.features}
                  onChange={(e) => setTierFormData({ ...tierFormData, features: e.target.value })}
                  placeholder="Custom responsive web application&#10;Modern React / Node.js architecture&#10;Payment gateway integration&#10;100% IP & source code transfer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* CTA Button Text */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={tierFormData.cta}
                    onChange={(e) => setTierFormData({ ...tierFormData, cta: e.target.value })}
                    placeholder="Request Starter Consultation"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                    value={tierFormData.order}
                    onChange={(e) => setTierFormData({ ...tierFormData, order: e.target.value })}
                  />
                </div>
              </div>

              {/* Highlight checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-[#0756A5]"
                    checked={tierFormData.highlight}
                    onChange={(e) =>
                      setTierFormData({ ...tierFormData, highlight: e.target.checked })
                    }
                  />
                  <span>Mark as "Most Popular" (Highlighted Blue Card)</span>
                </label>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setTierModalOpen(false)}
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
                  {saving ? "Saving..." : editingTier ? "Update Tier" : "Create Tier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FAQ CREATE / EDIT MODAL */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                  <HelpCircle size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#082B59]">
                    {editingFaq ? "Edit FAQ" : "Add New FAQ"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    Transparent billing, milestones, and intellectual property answers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFaqModalOpen(false)}
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

            <form onSubmit={handleFaqSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={faqFormData.q}
                  onChange={(e) => setFaqFormData({ ...faqFormData, q: e.target.value })}
                  placeholder="e.g. Who owns the intellectual property and source code?"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Answer *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 focus:border-[#0756A5] focus:outline-none"
                  value={faqFormData.a}
                  onChange={(e) => setFaqFormData({ ...faqFormData, a: e.target.value })}
                  placeholder="You retain 100% full intellectual property ownership..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-[#0756A5] focus:outline-none"
                  value={faqFormData.order}
                  onChange={(e) => setFaqFormData({ ...faqFormData, order: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-2.5 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
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
                  {saving ? "Saving..." : editingFaq ? "Update FAQ" : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingControl;
