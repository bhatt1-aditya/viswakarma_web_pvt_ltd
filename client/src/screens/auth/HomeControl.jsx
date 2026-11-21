import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  LayoutTemplate,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Layers,
  Plus,
  Trash2,
  MessageSquare,
  Lock,
  Check,
  Activity,
  Code2,
  Clock,
} from "lucide-react";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_HERO_HEADLINES = [
  "Powerful Digital Experiences.",
  "Scalable Cloud Architecture.",
  "Intelligent AI & Automation.",
  "High-Performance Mobile Apps.",
  "Enterprise Custom Software.",
];

const DEFAULT_PILLARS = [
  {
    number: "01",
    title: "Customized Solutions",
    desc: "Bespoke engineering tailored to your exact business workflows without bloated, rigid templates.",
    feature: "100% custom-crafted codebase built for your unique operational logic.",
  },
  {
    number: "02",
    title: "Modern Technology Stack",
    desc: "Built with React.js, Node.js, Next.js, Flutter, MongoDB, and AWS for peak speed and security.",
    feature: "Modern reactive frameworks ensuring lightning-fast load times.",
  },
  {
    number: "03",
    title: "Responsive Development",
    desc: "Flawless mobile-first user journeys designed to adapt seamlessly across smartphones, tablets, and desktops.",
    feature: "Pixel-perfect fluid layouts across all device viewports.",
  },
  {
    number: "04",
    title: "Scalable Architecture",
    desc: "Microservices, decoupled frontends, and cloud databases ready to handle millions of transactions.",
    feature: "Engineered to scale effortlessly from 1,000 to 10M+ active users.",
  },
  {
    number: "05",
    title: "Security-Focused Development",
    desc: "Enterprise data encryption, role-based access control, CSRF protection, and OWASP compliance.",
    feature: "Zero-trust security architecture protecting critical corporate data.",
  },
  {
    number: "06",
    title: "Ongoing Technical Support",
    desc: "Reliable post-launch warranty, 24/7 uptime monitoring, and dedicated developer maintenance retainers.",
    feature: "Guaranteed SLA response times with proactive cloud monitoring.",
  },
];

const INITIAL_HOME_CONTENT = {
  heroBadge: "Enterprise IT & Digital Solutions Partner",
  heroTitlePrefix: "Transforming Ideas Into",
  heroHeadlines: DEFAULT_HERO_HEADLINES,
  heroSubtitle:
    "Vishwakarma Web Private Limited delivers innovative software, web, mobile, AI, and digital solutions that help businesses grow, automate operations, and succeed in the digital world.",
  heroPrimaryBtnText: "Explore Our Services",
  heroPrimaryBtnLink: "/services",
  heroSecondaryBtnText: "Apply For Project",
  heroSecondaryBtnLink: "/quote",

  strategicAdvantageTag: "Our Strategic Advantage",
  strategicAdvantageTitle: "Why Forward-Thinking Businesses Choose Vishwakarma Web",
  strategicAdvantageSubtitle:
    "We eliminate technical friction and build high-performance software engineered for lasting commercial resilience.",
  strategicPillars: DEFAULT_PILLARS,
  strategicBannerTitle: "Business-Oriented Approach: Technology Engineered for Measurable Commercial ROI",
  strategicBannerDesc:
    "We eliminate technical friction and vanity metrics. Every line of code, cloud architectural decision, and database schema is directly benchmarked against conversion rates, user retention, operational cost reduction, and bottom-line revenue.",

  slaGuaranteeTitle: "Enterprise SLA & Engineering Assurance",
  slaGuaranteeSubtitle:
    "Our client contracts are backed by concrete engineering SLAs, zero-trust cybersecurity protocols, and dedicated post-release maintenance.",
  slaUptime: "99.98%",
  slaTurnaround: "24-Hour",
  slaSecurity: "Zero-Trust",
  slaEscrow: "Milestone-Escrow",

  ctaHeadline: "Have an Idea? Let's Build Something Powerful.",
  ctaSubtitle:
    "Partner with Vishwakarma Web Private Limited to architect custom software, web platforms, and mobile applications built for scale and commercial success.",
  ctaPrimaryBtnText: "Apply For Project",
  ctaPrimaryBtnLink: "/quote",
  ctaSecondaryBtnText: "Chat on WhatsApp",
  ctaWhatsappNumber: "+91 70775 60648",
};

const HomeControl = () => {
  const navigate = useNavigate();
  const { user, permissions, authLoading } = useAuth();

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const isAdmin = ["admin", "superadmin"].includes(roleName);
  const hasHomeControlAccess = isAdmin || permissions?.sidebar?.homeControl === true;

  // Granular button permissions
  const canEdit = isAdmin || permissions?.buttons?.homeControl?.edit === true;
  const canDeploy =
    isAdmin ||
    permissions?.buttons?.homeControl?.deploy === true ||
    permissions?.buttons?.homeControl?.publish === true;
  const canDelete = isAdmin || permissions?.buttons?.homeControl?.delete === true;

  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [homeContent, setHomeContent] = useState(INITIAL_HOME_CONTENT);
  const [newHeadlineInput, setNewHeadlineInput] = useState("");

  const showToast = useCallback((message, type = "ok") => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch current CMS settings from server
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/settings/home`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.homeContent) {
          setHomeContent((prev) => ({
            ...prev,
            ...data.homeContent,
            strategicPillars:
              data.homeContent.strategicPillars && data.homeContent.strategicPillars.length > 0
                ? data.homeContent.strategicPillars
                : DEFAULT_PILLARS,
            heroHeadlines:
              data.homeContent.heroHeadlines && data.homeContent.heroHeadlines.length > 0
                ? data.homeContent.heroHeadlines
                : DEFAULT_HERO_HEADLINES,
          }));
        }
      } else {
        showToast("Could not load dynamic settings. Using defaults.", "err");
      }
    } catch (err) {
      showToast("Error connecting to settings service.", "err");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Handle Save / Deploy
  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!canEdit) {
      showToast("Permission Denied: You do not have 'Edit' permission to update fields.", "err");
      return;
    }
    if (!canDeploy) {
      showToast("Permission Denied: You do not have 'Deploy / Publish' button permission.", "err");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/settings/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ homeContent }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Home screen content updated and published live!", "ok");
      } else {
        showToast(data.message || "Failed to update home screen settings.", "err");
      }
    } catch (err) {
      showToast("Server error occurred while saving.", "err");
    } finally {
      setSaving(false);
    }
  };

  // State Helpers with Permission Guards
  const updateField = (field, value) => {
    if (!canEdit) {
      showToast("Edit permission not granted by Administrator.", "err");
      return;
    }
    setHomeContent((prev) => ({ ...prev, [field]: value }));
  };

  const handleHeadlineChange = (index, value) => {
    if (!canEdit) return;
    const updated = [...homeContent.heroHeadlines];
    updated[index] = value;
    setHomeContent((prev) => ({ ...prev, heroHeadlines: updated }));
  };

  const handleAddHeadline = () => {
    if (!canEdit) {
      showToast("Edit permission required to add phrases.", "err");
      return;
    }
    if (!newHeadlineInput.trim()) return;
    setHomeContent((prev) => ({
      ...prev,
      heroHeadlines: [...prev.heroHeadlines, newHeadlineInput.trim()],
    }));
    setNewHeadlineInput("");
  };

  const handleRemoveHeadline = (index) => {
    if (!canDelete) {
      showToast("Permission Denied: You do not have 'Delete' button permission.", "err");
      return;
    }
    if (homeContent.heroHeadlines.length <= 1) {
      showToast("At least one headline phrase is required for typewriter animation.", "err");
      return;
    }
    const updated = homeContent.heroHeadlines.filter((_, i) => i !== index);
    setHomeContent((prev) => ({ ...prev, heroHeadlines: updated }));
  };

  const handlePillarChange = (index, key, value) => {
    if (!canEdit) return;
    const updated = [...homeContent.strategicPillars];
    updated[index] = { ...updated[index], [key]: value };
    setHomeContent((prev) => ({ ...prev, strategicPillars: updated }));
  };

  // Route Guard Check
  if (!authLoading && !hasHomeControlAccess) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-100 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-500 mx-auto flex items-center justify-center">
            <Lock size={32} />
          </div>
          <h2 className="text-xl font-bold text-[#082B59]">Access Restricted</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            You do not possess sidebar viewing permissions for the Home Screen CMS. Please request access from an Administrator in the Staff & Team console.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full py-3 px-4 rounded-xl bg-[#082B59] text-white font-bold text-sm hover:bg-[#0756A5] transition-colors"
            >
              Return to Console Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "hero", label: "Hero Section", icon: Sparkles },
    { id: "strategic", label: "Strategic Advantage", icon: Zap },
    { id: "sla", label: "SLA & Guarantees", icon: ShieldCheck },
    { id: "cta", label: "Conversion CTA", icon: MessageSquare },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="px-4 sm:px-6 lg:px-8 py-8 space-y-6 mx-auto"
    >
      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold border ${toast.type === "ok"
                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                : "bg-red-50 text-red-800 border-red-200"
              }`}
          >
            {toast.type === "ok" ? (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HEADER WITH ACTIONS ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:flex-nowrap gap-6 bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#0756A5] border border-blue-100 text-xs font-bold uppercase tracking-wider mb-2">
            <LayoutTemplate size={13} />
            <span>Content Management System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#082B59] tracking-tight">
            Home Screen Control Center
          </h1>
          <p className="text-sm text-gray-500 mt-1 leading-relaxed">
            Manage public homepage content, typewriter headlines, 7 strategic value pillars, enterprise SLA parameters, and conversion calls-to-action in real time.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <ExternalLink size={14} className="text-gray-400" />
            <span>View Live Home</span>
          </a>

          <button
            onClick={fetchSettings}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <RefreshCw size={14} className={`text-gray-400 ${loading ? "animate-spin" : ""}`} />
            <span>Reload</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving || loading || !canDeploy || !canEdit}
            title={
              !canEdit
                ? "Edit permission required to save"
                : !canDeploy
                  ? "Deploy permission not granted by Admin"
                  : "Save & publish changes live"
            }
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md ${!canDeploy || !canEdit
                ? "bg-gray-400 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] hover:shadow-glowOrange"
              }`}
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Publishing...</span>
              </>
            ) : !canDeploy ? (
              <>
                <Lock size={14} />
                <span>Deploy Restricted</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save & Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── GRANULAR PERMISSION STATUS ALERT BANNER (IF ANY BUTTON PERMISSION IS DENIED) ── */}
      {!isAdmin && (!canEdit || !canDeploy || !canDelete) && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 shadow-xs">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-900">Restricted Action Permissions Applied</p>
            <p className="text-amber-700 leading-relaxed">
              Your account has access to view the Home Screen CMS, but the Administrator has not granted certain button permissions:
            </p>
            <div className="flex gap-2 flex-wrap pt-1 font-mono text-[11px]">
              <span
                className={`px-2 py-0.5 rounded font-bold ${canEdit ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}
              >
                Edit: {canEdit ? "Granted" : "Denied (Fields Read-Only)"}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${canDeploy ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}
              >
                Deploy/Publish: {canDeploy ? "Granted" : "Denied (Publish Blocked)"}
              </span>
              <span
                className={`px-2 py-0.5 rounded font-bold ${canDelete ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
                  }`}
              >
                Delete: {canDelete ? "Granted" : "Denied (Phrase Delete Blocked)"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── SECTION TABS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-gray-200">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${isActive
                  ? "bg-[#082B59] text-white shadow-md shadow-blue-900/20"
                  : "bg-white text-gray-600 hover:text-[#0756A5] hover:bg-blue-50/50 border border-gray-100"
                }`}
            >
              <IconComp size={15} className={isActive ? "text-[#FF6900]" : "text-gray-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── CMS TAB CONTENT PANELS ── */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs">
        {/* 1. HERO SECTION CMS */}
        {activeTab === "hero" && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                <Sparkles size={18} className="text-[#FF6900]" />
                <span>Hero Section Configuration</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Customize the first impression visitors see when entering Vishwakarma Web Private Limited.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hero Badge */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Top Pill Badge
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.heroBadge || ""}
                  onChange={(e) => updateField("heroBadge", e.target.value)}
                  placeholder="e.g. Enterprise IT & Digital Solutions Partner"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:ring-2 focus:ring-[#0756A5]/10 text-sm outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Title Prefix */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Headline Fixed Prefix
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.heroTitlePrefix || ""}
                  onChange={(e) => updateField("heroTitlePrefix", e.target.value)}
                  placeholder="Transforming Ideas Into"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:ring-2 focus:ring-[#0756A5]/10 text-sm outline-none transition-all disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Primary CTA Button */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Primary Button Text & Link
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.heroPrimaryBtnText || ""}
                    onChange={(e) => updateField("heroPrimaryBtnText", e.target.value)}
                    placeholder="Explore Our Services"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.heroPrimaryBtnLink || ""}
                    onChange={(e) => updateField("heroPrimaryBtnLink", e.target.value)}
                    placeholder="/services"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Dynamic Typewriter Headline Sequence */}
              <div className="space-y-3 md:col-span-2 bg-[#F5F8FC] p-5 rounded-2xl border border-blue-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-[#082B59] uppercase tracking-wider">
                      Typewriter Animated Rotating Phrases
                    </h3>
                    <p className="text-[11px] text-gray-500">
                      These phrases animate sequentially under the headline prefix on the live site.
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-[#0756A5]">
                    {homeContent.heroHeadlines?.length || 0} Phrases
                  </span>
                </div>

                <div className="space-y-2">
                  {homeContent.heroHeadlines?.map((phrase, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 text-center text-xs font-mono font-bold text-gray-400">
                        {idx + 1}.
                      </span>
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={phrase}
                        onChange={(e) => handleHeadlineChange(idx, e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:border-[#FF6900] outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHeadline(idx)}
                        disabled={!canDelete}
                        title={!canDelete ? "Delete permission not granted" : "Delete phrase"}
                        className={`p-2.5 rounded-xl transition-colors ${canDelete
                            ? "text-gray-400 hover:text-red-500 hover:bg-red-50 cursor-pointer"
                            : "text-gray-300 opacity-40 cursor-not-allowed"
                          }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={newHeadlineInput}
                    onChange={(e) => setNewHeadlineInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddHeadline()}
                    placeholder={
                      canEdit
                        ? "Add a new headline phrase (e.g. Next-Gen Web Architecture)..."
                        : "Edit permission required to add phrases"
                    }
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#0756A5] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                  <button
                    type="button"
                    onClick={handleAddHeadline}
                    disabled={!canEdit}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0756A5] hover:bg-blue-600 text-white text-xs font-bold transition-colors shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus size={14} />
                    <span>Add Phrase</span>
                  </button>
                </div>
              </div>

              {/* Subtitle */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Hero Subtitle / Value Proposition
                </label>
                <textarea
                  rows={3}
                  disabled={!canEdit}
                  value={homeContent.heroSubtitle || ""}
                  onChange={(e) => updateField("heroSubtitle", e.target.value)}
                  placeholder="Describe Vishwakarma Web Private Limited's mission and engineering core..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:ring-2 focus:ring-[#0756A5]/10 text-sm outline-none transition-all leading-relaxed disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Secondary CTA Button */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Secondary Button Text & Link
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.heroSecondaryBtnText || ""}
                    onChange={(e) => updateField("heroSecondaryBtnText", e.target.value)}
                    placeholder="Apply For Project"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.heroSecondaryBtnLink || ""}
                    onChange={(e) => updateField("heroSecondaryBtnLink", e.target.value)}
                    placeholder="/quote"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. STRATEGIC ADVANTAGE CMS */}
        {activeTab === "strategic" && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                <Zap size={18} className="text-[#FF6900]" />
                <span>Our Strategic Advantage & 7 Value Pillars</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure the 6 core strategic cards plus the full-width 7th commercial ROI spotlight banner.
              </p>
            </div>

            {/* Section Tag & Headers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Section Pill Tag
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.strategicAdvantageTag || ""}
                  onChange={(e) => updateField("strategicAdvantageTag", e.target.value)}
                  placeholder="Our Strategic Advantage"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Section Headline Title
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.strategicAdvantageTitle || ""}
                  onChange={(e) => updateField("strategicAdvantageTitle", e.target.value)}
                  placeholder="Why Forward-Thinking Businesses Choose Vishwakarma Web"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Section Subtitle
                </label>
                <textarea
                  rows={2}
                  disabled={!canEdit}
                  value={homeContent.strategicAdvantageSubtitle || ""}
                  onChange={(e) => updateField("strategicAdvantageSubtitle", e.target.value)}
                  placeholder="We eliminate technical friction and build high-performance software engineered for lasting commercial resilience."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none leading-relaxed disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* 6 Core Strategic Pillars */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-sm font-black text-[#082B59] uppercase tracking-wider flex items-center gap-2">
                <Layers size={16} className="text-[#0756A5]" />
                <span>6 Core Engineering Pillars (Pillars 01 – 06)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {homeContent.strategicPillars?.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-gray-200 bg-[#F5F8FC] space-y-3 relative hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-[#FF6900] bg-orange-100/70 px-2 py-0.5 rounded-lg">
                        Pillar {pillar.number || `0${idx + 1}`}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase">
                        Slot #{idx + 1}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 uppercase">
                        Card Title
                      </label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={pillar.title || ""}
                        onChange={(e) => handlePillarChange(idx, "title", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-bold text-[#082B59] outline-none focus:border-[#0756A5] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 uppercase">
                        Description
                      </label>
                      <textarea
                        rows={2}
                        disabled={!canEdit}
                        value={pillar.desc || ""}
                        onChange={(e) => handlePillarChange(idx, "desc", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-700 outline-none focus:border-[#0756A5] leading-relaxed disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-600 uppercase">
                        Feature Bullet
                      </label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={pillar.feature || ""}
                        onChange={(e) => handlePillarChange(idx, "feature", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-600 outline-none focus:border-[#0756A5] disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured 7th Pillar Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-50/80 via-white to-orange-50/40 border border-blue-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0756A5] uppercase tracking-wider">
                <Code2 size={16} />
                <span>Featured Pillar 07: Commercial ROI & Milestone Escrow Banner</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full-Width Banner Title
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.strategicBannerTitle || ""}
                  onChange={(e) => updateField("strategicBannerTitle", e.target.value)}
                  placeholder="Business-Oriented Approach: Technology Engineered for Measurable Commercial ROI"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Full-Width Banner Narrative Description
                </label>
                <textarea
                  rows={3}
                  disabled={!canEdit}
                  value={homeContent.strategicBannerDesc || ""}
                  onChange={(e) => updateField("strategicBannerDesc", e.target.value)}
                  placeholder="Explain your milestone escrow, sprint velocity, and code ownership delivery terms..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none leading-relaxed disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SLA & ASSURANCES CMS */}
        {activeTab === "sla" && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#FF6900]" />
                <span>Commercial SLA & Engineering Assurance Parameters</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure the contractual SLA numbers, sprint velocities, and cybersecurity assurances highlighted to clients.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SLA Section Heading
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.slaGuaranteeTitle || ""}
                  onChange={(e) => updateField("slaGuaranteeTitle", e.target.value)}
                  placeholder="Enterprise SLA & Engineering Assurance"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  SLA Section Subtitle
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.slaGuaranteeSubtitle || ""}
                  onChange={(e) => updateField("slaGuaranteeSubtitle", e.target.value)}
                  placeholder="Our client contracts are backed by concrete engineering SLAs..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-gray-100">
              {/* Uptime */}
              <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase">
                  <Activity size={16} />
                  <span>Uptime SLA</span>
                </div>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.slaUptime || ""}
                  onChange={(e) => updateField("slaUptime", e.target.value)}
                  placeholder="99.98%"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white font-extrabold text-emerald-900 outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-500">Mission-critical cloud infrastructure availability guarantee.</p>
              </div>

              {/* Turnaround */}
              <div className="p-5 rounded-2xl border border-amber-100 bg-amber-50/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase">
                  <Clock size={16} />
                  <span>Sprint Turnaround</span>
                </div>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.slaTurnaround || ""}
                  onChange={(e) => updateField("slaTurnaround", e.target.value)}
                  placeholder="24-Hour"
                  className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white font-extrabold text-amber-900 outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-500">Rapid response and agile 2-week milestone shipping cycles.</p>
              </div>

              {/* Security */}
              <div className="p-5 rounded-2xl border border-blue-100 bg-blue-50/40 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 text-xs font-bold uppercase">
                  <ShieldCheck size={16} />
                  <span>Security Standard</span>
                </div>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.slaSecurity || ""}
                  onChange={(e) => updateField("slaSecurity", e.target.value)}
                  placeholder="Zero-Trust"
                  className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white font-extrabold text-blue-900 outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-500">Bank-grade encryption, RBAC, and automated OWASP audits.</p>
              </div>

              {/* Escrow / Ownership */}
              <div className="p-5 rounded-2xl border border-orange-100 bg-orange-50/40 space-y-2">
                <div className="flex items-center gap-2 text-orange-700 text-xs font-bold uppercase">
                  <Lock size={16} />
                  <span>Payment Escrow</span>
                </div>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.slaEscrow || ""}
                  onChange={(e) => updateField("slaEscrow", e.target.value)}
                  placeholder="Milestone-Escrow"
                  className="w-full px-3 py-2 rounded-xl border border-orange-200 bg-white font-extrabold text-orange-900 outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
                <p className="text-[11px] text-gray-500">Pay only after reviewing staging code and sprint approvals.</p>
              </div>
            </div>
          </div>
        )}

        {/* 4. CONVERSION CTA CMS */}
        {activeTab === "cta" && (
          <div className="space-y-8">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-[#082B59] flex items-center gap-2">
                <MessageSquare size={18} className="text-[#FF6900]" />
                <span>Final Call to Action (CTA) Configuration</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Customize the bottom conversion banner that prompts prospective enterprise clients to submit project inquiries.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  CTA Headline
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={homeContent.ctaHeadline || ""}
                  onChange={(e) => updateField("ctaHeadline", e.target.value)}
                  placeholder="Have an Idea? Let's Build Something Powerful."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  CTA Subtitle / Paragraph
                </label>
                <textarea
                  rows={3}
                  disabled={!canEdit}
                  value={homeContent.ctaSubtitle || ""}
                  onChange={(e) => updateField("ctaSubtitle", e.target.value)}
                  placeholder="Partner with Vishwakarma Web Private Limited to architect custom software..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none leading-relaxed disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              {/* Primary Quote CTA Button */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Primary Action Button Text & URL
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.ctaPrimaryBtnText || ""}
                    onChange={(e) => updateField("ctaPrimaryBtnText", e.target.value)}
                    placeholder="Apply For Project"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.ctaPrimaryBtnLink || ""}
                    onChange={(e) => updateField("ctaPrimaryBtnLink", e.target.value)}
                    placeholder="/quote"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Secondary WhatsApp Action */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Secondary Action Button Text & WhatsApp Number
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.ctaSecondaryBtnText || ""}
                    onChange={(e) => updateField("ctaSecondaryBtnText", e.target.value)}
                    placeholder="Chat on WhatsApp"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={homeContent.ctaWhatsappNumber || ""}
                    onChange={(e) => updateField("ctaWhatsappNumber", e.target.value)}
                    placeholder="+91 70775 60648"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] text-sm outline-none disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM SAVE FOOTER */}
        <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Check size={14} className="text-emerald-500" />
            <span>Changes update the public website instantly upon saving.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || loading || !canDeploy || !canEdit}
              title={
                !canEdit
                  ? "Edit permission required to save"
                  : !canDeploy
                    ? "Deploy permission not granted by Admin"
                    : "Save & publish changes live"
              }
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md ${!canDeploy || !canEdit
                  ? "bg-gray-400 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-[#0756A5] to-[#082B59] hover:from-[#082B59] hover:to-[#0756A5]"
                }`}
            >
              {saving ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Saving Configuration...</span>
                </>
              ) : !canDeploy ? (
                <>
                  <Lock size={14} />
                  <span>Deploy Restricted</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeControl;
