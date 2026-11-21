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
  Compass,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Layers,
  Plus,
  Trash2,
  Lock,
  Target,
  Award,
  Terminal,
} from "lucide-react";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";

const DEFAULT_ABOUT_PHRASES = [
  "Mission-Critical Software.",
  "Scalable Digital Platforms.",
  "Enterprise-Grade Applications.",
  "Intelligent Automated Workflows.",
  "Future-Ready Cloud Systems.",
];

const DEFAULT_CORE_VALUES = [
  {
    number: "01",
    title: "Engineering Integrity",
    desc: "We write clean, documented, future-proof code that scales gracefully without hidden shortcuts or technical debt.",
    feature: "Strict modular architecture adhering to clean code standards.",
  },
  {
    number: "02",
    title: "Commercial Transparency",
    desc: "Predictable milestone-driven deliverables, transparent sprint tracking, and clear scope agreements without surprise fees.",
    feature: "Bi-weekly sprint reviews and verifiable milestone demos.",
  },
  {
    number: "03",
    title: "Total IP Ownership",
    desc: "100% of all intellectual property, source repositories, databases, and design tokens belong permanently to the client.",
    feature: "Complete transfer of repositories, docs, and assets.",
  },
  {
    number: "04",
    title: "Enduring Technical SLA",
    desc: "We stand firmly behind our builds with continuous uptime assurance, security patching, and ongoing feature enhancement.",
    feature: "Proactive uptime monitoring and rapid SLA response.",
  },
];

const DEFAULT_ENGINEERING_FRAMEWORK = [
  {
    step: "01",
    title: "Discovery & Enterprise Modeling",
    desc: "Comprehensive business process mapping, user journey planning, and data domain architecture.",
  },
  {
    step: "02",
    title: "Decoupled Modular Architecture",
    desc: "Building scalable frontend micro-interfaces and resilient backend REST APIs designed for scale.",
  },
  {
    step: "03",
    title: "Automated QA & Security Auditing",
    desc: "End-to-end regression testing, OWASP vulnerability scans, and Core Web Vitals optimization.",
  },
  {
    step: "04",
    title: "Cloud Orchestration & 24/7 SLA",
    desc: "Zero-downtime CI/CD container deployments, cloud monitoring, and dedicated developer retainers.",
  },
];

const INITIAL_ABOUT_CONTENT = {
  heroBadge: "About Vishwakarma Web Private Limited",
  heroTitlePrefix: "Architecting & Engineering",
  heroHeadlines: DEFAULT_ABOUT_PHRASES,
  heroSubtitle:
    "Vishwakarma Web Private Limited is a specialized IT engineering and digital product firm based in Noida, India. We empower ambitious startups, growing mid-market companies, and large enterprises with resilient web platforms, mobile ecosystems, custom enterprise software, and automated AI workflows.",
  heroPrimaryBtnText: "Explore 108 Services",
  heroPrimaryBtnLink: "/services",
  heroSecondaryBtnText: "Contact Our Team",
  heroSecondaryBtnLink: "/contact",

  missionTag: "MISSION CHARTER",
  missionTitle: "Our Corporate Mission",
  missionDesc:
    "To empower startups, mid-market businesses, and global enterprises with high-reliability software, web platforms, mobile apps, and autonomous AI systems that streamline operations, eliminate human error, and accelerate commercial growth.",
  missionPoints: [
    "Architect decoupled, maintainable code with zero technical debt",
    "Automate repetitive manual operations with intelligent software",
    "Deliver transparent bi-weekly milestones with zero scope creep",
  ],

  visionTag: "VISION 2030",
  visionTitle: "Our Long-Term Vision",
  visionDesc:
    "To be the most trusted technology engineering partner for organizations navigating digital transformation, recognized internationally for exceptional code craftsmanship, robust enterprise security, and measurable commercial return on investment.",
  visionPoints: [
    "Global standard for reliable enterprise full-stack engineering",
    "Pioneering pragmatic AI and autonomous workflow integrations",
    "Long-term client partnerships grounded in mutual commercial ROI",
  ],

  coreValuesTag: "Our Code of Conduct",
  coreValuesTitle: "Our Guiding Principles & Core Values",
  coreValuesSubtitle:
    "The engineering ethos behind every line of code we write, every architecture we deploy, and every partnership we foster.",
  coreValues: DEFAULT_CORE_VALUES,

  frameworkTag: "Predictable Delivery",
  frameworkTitle: "Our Engineering Architecture Framework",
  frameworkSubtitle:
    "From business modeling to high-availability cloud orchestration, we apply structured engineering rigor at every stage.",
  engineeringFramework: DEFAULT_ENGINEERING_FRAMEWORK,

  guaranteeTag: "The Vishwakarma Commercial Guarantee",
  guaranteeTitle: "Transparent Partnerships Rooted in Engineering Accountability",
  guaranteeDesc:
    "When you partner with Vishwakarma Web Private Limited, you retain 100% intellectual property ownership, direct access to dedicated senior developers, and milestone deliverables verified against pre-agreed acceptance criteria.",
  slaUptime: "99.99%",
  slaTurnaround: "2 Weeks",
  slaEscrow: "100% IP",
  slaSecurity: "Zero-Trust",

  ctaTag: "Ready to Build Something Meaningful?",
  ctaHeadline: "Let's Engineer Your Next Digital Milestone.",
  ctaSubtitle:
    "Partner with Vishwakarma Web Private Limited to turn business vision into scalable, enterprise-grade software.",
  ctaPrimaryBtnText: "Request a Free Quote",
  ctaPrimaryBtnLink: "/quote",
  ctaSecondaryBtnText: "Schedule Consultation",
  ctaSecondaryBtnLink: "/contact",
};

const AboutControl = () => {
  const navigate = useNavigate();
  const { user, permissions, authLoading } = useAuth();

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  const isAdmin = ["admin", "superadmin"].includes(roleName);
  const hasAboutControlAccess = isAdmin || permissions?.sidebar?.aboutControl === true;

  // Granular button permissions
  const canEdit = isAdmin || permissions?.buttons?.aboutControl?.edit === true;
  const canDeploy =
    isAdmin ||
    permissions?.buttons?.aboutControl?.deploy === true ||
    permissions?.buttons?.aboutControl?.publish === true;
  const canDelete = isAdmin || permissions?.buttons?.aboutControl?.delete === true;

  const [activeTab, setActiveTab] = useState("hero");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [aboutContent, setAboutContent] = useState(INITIAL_ABOUT_CONTENT);
  const [newHeadlineInput, setNewHeadlineInput] = useState("");
  const [newMissionPoint, setNewMissionPoint] = useState("");
  const [newVisionPoint, setNewVisionPoint] = useState("");

  const showToast = useCallback((message, type = "ok") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  }, []);

  const fetchAboutSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/settings/about`);
      const data = await res.json();
      if (data.success && data.data) {
        setAboutContent((prev) => ({
          ...prev,
          ...data.data,
          heroHeadlines:
            Array.isArray(data.data.heroHeadlines) && data.data.heroHeadlines.length > 0
              ? data.data.heroHeadlines
              : DEFAULT_ABOUT_PHRASES,
          missionPoints:
            Array.isArray(data.data.missionPoints) && data.data.missionPoints.length > 0
              ? data.data.missionPoints
              : INITIAL_ABOUT_CONTENT.missionPoints,
          visionPoints:
            Array.isArray(data.data.visionPoints) && data.data.visionPoints.length > 0
              ? data.data.visionPoints
              : INITIAL_ABOUT_CONTENT.visionPoints,
          coreValues:
            Array.isArray(data.data.coreValues) && data.data.coreValues.length > 0
              ? data.data.coreValues
              : DEFAULT_CORE_VALUES,
          engineeringFramework:
            Array.isArray(data.data.engineeringFramework) &&
            data.data.engineeringFramework.length > 0
              ? data.data.engineeringFramework
              : DEFAULT_ENGINEERING_FRAMEWORK,
        }));
      }
    } catch (error) {
      console.error("Failed to load About settings:", error);
      showToast("Unable to fetch remote About content. Loaded fallback defaults.", "err");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAboutSettings();
  }, [fetchAboutSettings]);

  const handleSave = async () => {
    if (!canEdit) {
      showToast("Action Forbidden: You do not have 'Edit Content' permission.", "err");
      return;
    }
    if (!canDeploy) {
      showToast("Action Forbidden: You do not have 'Deploy / Publish' permission.", "err");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/settings/about`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(aboutContent),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update About Us CMS settings");
      }

      showToast("About Us changes deployed successfully to live website!", "ok");
    } catch (err) {
      showToast(err.message || "Failed to save About Us CMS settings", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, value) => {
    if (!canEdit) return;
    setAboutContent((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Headline handlers
  const handleAddHeadline = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newHeadlineInput.trim()) return;
    setAboutContent((prev) => ({
      ...prev,
      heroHeadlines: [...prev.heroHeadlines, newHeadlineInput.trim()],
    }));
    setNewHeadlineInput("");
  };

  const handleRemoveHeadline = (index) => {
    if (!canDelete) {
      showToast("Delete Restricted: You do not have permission to delete elements.", "err");
      return;
    }
    if (aboutContent.heroHeadlines.length <= 1) {
      showToast("At least one hero phrase is required for typewriter animation.", "err");
      return;
    }
    setAboutContent((prev) => ({
      ...prev,
      heroHeadlines: prev.heroHeadlines.filter((_, idx) => idx !== index),
    }));
  };

  // Mission point handlers
  const handleAddMissionPoint = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newMissionPoint.trim()) return;
    setAboutContent((prev) => ({
      ...prev,
      missionPoints: [...prev.missionPoints, newMissionPoint.trim()],
    }));
    setNewMissionPoint("");
  };

  const handleRemoveMissionPoint = (index) => {
    if (!canDelete) {
      showToast("Delete Restricted: You do not have permission to delete elements.", "err");
      return;
    }
    setAboutContent((prev) => ({
      ...prev,
      missionPoints: prev.missionPoints.filter((_, idx) => idx !== index),
    }));
  };

  // Vision point handlers
  const handleAddVisionPoint = (e) => {
    e.preventDefault();
    if (!canEdit) return;
    if (!newVisionPoint.trim()) return;
    setAboutContent((prev) => ({
      ...prev,
      visionPoints: [...prev.visionPoints, newVisionPoint.trim()],
    }));
    setNewVisionPoint("");
  };

  const handleRemoveVisionPoint = (index) => {
    if (!canDelete) {
      showToast("Delete Restricted: You do not have permission to delete elements.", "err");
      return;
    }
    setAboutContent((prev) => ({
      ...prev,
      visionPoints: prev.visionPoints.filter((_, idx) => idx !== index),
    }));
  };

  // Core values handlers
  const handleCoreValueChange = (index, field, value) => {
    if (!canEdit) return;
    setAboutContent((prev) => {
      const updated = [...prev.coreValues];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, coreValues: updated };
    });
  };

  // Framework handlers
  const handleFrameworkChange = (index, field, value) => {
    if (!canEdit) return;
    setAboutContent((prev) => {
      const updated = [...prev.engineeringFramework];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, engineeringFramework: updated };
    });
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#0756A5] rounded-full animate-spin" />
      </div>
    );
  }

  // Access control guard
  if (!hasAboutControlAccess) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">
          You do not have sidebar access permission for the About Us CMS. Please contact your
          administrator to enable this module.
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

  const tabs = [
    { id: "hero", label: "Hero & Typewriter", icon: Sparkles },
    { id: "missionVision", label: "Mission & Vision", icon: Target },
    { id: "coreValues", label: "Core Values", icon: Award },
    { id: "framework", label: "Engineering Framework", icon: Layers },
    { id: "slaCta", label: "SLA & Final CTA", icon: Zap },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none">
      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold backdrop-blur-md border ${
              toast.type === "err"
                ? "bg-red-500/95 text-white border-red-600"
                : "bg-[#082B59]/95 text-white border-blue-400/30"
            }`}
          >
            {toast.type === "err" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} className="text-emerald-400" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-[#FF6900] border border-orange-200">
              Live Website CMS
            </span>
            <span className="text-xs text-gray-400">/</span>
            <span className="text-xs text-gray-500 font-medium">About Us Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#082B59] tracking-tight flex items-center gap-2.5">
            <Compass className="text-[#0756A5]" size={28} />
            <span>About Us Screen CMS</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
            Configure dynamic copy, mission & vision statements, core values, architectural framework,
            and commercial SLAs on the public About Us page.
          </p>
        </div>

        {/* TOP ACTION BUTTONS */}
        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <a
            href="/about"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
          >
            <ExternalLink size={14} className="text-gray-400" />
            <span>Preview Live About</span>
          </a>

          <button
            onClick={fetchAboutSettings}
            disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 shadow-2xs transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-[#0756A5]" : ""} />
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !canDeploy || !canEdit}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all ${
              saving || !canDeploy || !canEdit
                ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300"
                : "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange hover:scale-[1.02]"
            }`}
            title={
              !canDeploy
                ? "Deploy Restricted: You do not have permission to publish changes live"
                : !canEdit
                ? "Edit Restricted: You do not have permission to edit content"
                : "Publish changes directly to live website"
            }
          >
            {!canDeploy ? <Lock size={14} /> : <Save size={14} />}
            <span>{saving ? "Deploying..." : "Deploy Live"}</span>
          </button>
        </div>
      </div>

      {/* PERMISSION STATUS BANNER */}
      {(!canEdit || !canDeploy || !canDelete) && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
          <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Role Button Permissions Restricted:</p>
            <ul className="list-disc list-inside space-y-0.5 text-amber-800">
              {!canEdit && <li><strong>Edit Content:</strong> Disabled (view-only mode).</li>}
              {!canDeploy && <li><strong>Deploy / Publish:</strong> Disabled (cannot push live).</li>}
              {!canDelete && <li><strong>Delete Elements:</strong> Disabled (cannot remove items).</li>}
            </ul>
          </div>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? "bg-[#0756A5] text-white shadow-xs"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon size={14} className={isActive ? "text-white" : "text-gray-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: HERO & TYPEWRITER */}
      {activeTab === "hero" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Top Hero Overview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#082B59] flex items-center gap-2">
              <Sparkles size={16} className="text-[#FF6900]" />
              <span>Hero Header Banner & Subtitle</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.heroBadge}
                  onChange={(e) => handleFieldChange("heroBadge", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Hero Title Prefix
                </label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.heroTitlePrefix}
                  onChange={(e) => handleFieldChange("heroTitlePrefix", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Hero Subtitle Copy
              </label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={aboutContent.heroSubtitle}
                onChange={(e) => handleFieldChange("heroSubtitle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-[#0756A5]">
                  Primary Call to Action
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.heroPrimaryBtnText}
                    onChange={(e) => handleFieldChange("heroPrimaryBtnText", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Route Link
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.heroPrimaryBtnLink}
                    onChange={(e) => handleFieldChange("heroPrimaryBtnLink", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <span className="text-[11px] font-extrabold uppercase text-[#FF6900]">
                  Secondary Call to Action
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Button Label
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.heroSecondaryBtnText}
                    onChange={(e) => handleFieldChange("heroSecondaryBtnText", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Route Link
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.heroSecondaryBtnLink}
                    onChange={(e) => handleFieldChange("heroSecondaryBtnLink", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Typewriter Phrases List */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#082B59] flex items-center gap-2">
                  <Terminal size={16} className="text-[#0756A5]" />
                  <span>Typewriter Animated Phrases</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  These dynamic phrases cycle continuously on the live About page headline.
                </p>
              </div>
              <span className="text-xs font-mono text-[#0756A5] font-bold bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                {aboutContent.heroHeadlines.length} Active Phrases
              </span>
            </div>

            {/* Add phrase form */}
            <form onSubmit={handleAddHeadline} className="flex gap-2">
              <input
                type="text"
                disabled={!canEdit}
                placeholder="Enter new animated headline phrase..."
                value={newHeadlineInput}
                onChange={(e) => setNewHeadlineInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
              <button
                type="submit"
                disabled={!canEdit || !newHeadlineInput.trim()}
                className="px-4 py-2 rounded-xl bg-[#0756A5] hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors disabled:bg-gray-200 disabled:text-gray-400"
              >
                <Plus size={14} />
                <span>Add Phrase</span>
              </button>
            </form>

            {/* List of phrases */}
            <div className="space-y-2 pt-2">
              {aboutContent.heroHeadlines.map((phrase, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs hover:border-blue-200 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0756A5] text-[10px] font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-gray-800">{phrase}</span>
                  </div>

                  <button
                    onClick={() => handleRemoveHeadline(idx)}
                    disabled={!canDelete}
                    className={`p-1.5 rounded-lg transition-colors ${
                      canDelete
                        ? "text-gray-400 hover:text-red-600 hover:bg-red-50"
                        : "text-gray-300 cursor-not-allowed"
                    }`}
                    title={
                      canDelete
                        ? "Remove phrase"
                        : "Delete Restricted: You do not have permission to delete elements"
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: MISSION & VISION */}
      {activeTab === "missionVision" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Mission Card Editor */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Compass className="text-[#0756A5]" size={18} />
                <h3 className="text-sm font-bold text-[#082B59]">Corporate Mission</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0756A5]">
                Charter
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mission Tag</label>
              <input
                type="text"
                disabled={!canEdit}
                value={aboutContent.missionTag}
                onChange={(e) => handleFieldChange("missionTag", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mission Title</label>
              <input
                type="text"
                disabled={!canEdit}
                value={aboutContent.missionTitle}
                onChange={(e) => handleFieldChange("missionTitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Mission Description</label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={aboutContent.missionDesc}
                onChange={(e) => handleFieldChange("missionDesc", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            {/* Mission Key Points */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-bold text-gray-700">Mission Key Deliverables</label>
              <form onSubmit={handleAddMissionPoint} className="flex gap-2">
                <input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Add bullet point..."
                  value={newMissionPoint}
                  onChange={(e) => setNewMissionPoint(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  disabled={!canEdit || !newMissionPoint.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#0756A5] text-white text-xs font-bold disabled:bg-gray-200"
                >
                  <Plus size={14} />
                </button>
              </form>

              <div className="space-y-1.5">
                {aboutContent.missionPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-[#0756A5] shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveMissionPoint(idx)}
                      disabled={!canDelete}
                      className="text-gray-400 hover:text-red-500 disabled:text-gray-200"
                      title={canDelete ? "Remove point" : "Delete Restricted"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Vision Card Editor */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Target className="text-[#FF6900]" size={18} />
                <h3 className="text-sm font-bold text-[#082B59]">Long-Term Vision</h3>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-50 text-[#FF6900]">
                Vision 2030
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Vision Tag</label>
              <input
                type="text"
                disabled={!canEdit}
                value={aboutContent.visionTag}
                onChange={(e) => handleFieldChange("visionTag", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Vision Title</label>
              <input
                type="text"
                disabled={!canEdit}
                value={aboutContent.visionTitle}
                onChange={(e) => handleFieldChange("visionTitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Vision Description</label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={aboutContent.visionDesc}
                onChange={(e) => handleFieldChange("visionDesc", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            {/* Vision Key Points */}
            <div className="pt-2 space-y-2">
              <label className="block text-xs font-bold text-gray-700">Vision Milestones</label>
              <form onSubmit={handleAddVisionPoint} className="flex gap-2">
                <input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Add vision milestone..."
                  value={newVisionPoint}
                  onChange={(e) => setNewVisionPoint(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
                <button
                  type="submit"
                  disabled={!canEdit || !newVisionPoint.trim()}
                  className="px-3 py-1.5 rounded-lg bg-[#FF6900] text-white text-xs font-bold disabled:bg-gray-200"
                >
                  <Plus size={14} />
                </button>
              </form>

              <div className="space-y-1.5">
                {aboutContent.visionPoints.map((point, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-[#FF6900] shrink-0" />
                      <span className="text-gray-700">{point}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveVisionPoint(idx)}
                      disabled={!canDelete}
                      className="text-gray-400 hover:text-red-500 disabled:text-gray-200"
                      title={canDelete ? "Remove milestone" : "Delete Restricted"}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: CORE VALUES */}
      {activeTab === "coreValues" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header Copy for Core Values */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#082B59] flex items-center gap-2">
              <Award size={16} className="text-[#FF6900]" />
              <span>Core Values Section Header</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Tag</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.coreValuesTag}
                  onChange={(e) => handleFieldChange("coreValuesTag", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.coreValuesTitle}
                  onChange={(e) => handleFieldChange("coreValuesTitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                disabled={!canEdit}
                value={aboutContent.coreValuesSubtitle}
                onChange={(e) => handleFieldChange("coreValuesSubtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* Core Values Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutContent.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-mono font-bold text-[#0756A5]">
                    Value Card {val.number || idx + 1}
                  </span>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={val.number}
                    onChange={(e) => handleCoreValueChange(idx, "number", e.target.value)}
                    className="w-12 px-2 py-0.5 text-right font-mono text-xs border border-gray-200 rounded disabled:bg-gray-50"
                    placeholder="01"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Title</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={val.title}
                    onChange={(e) => handleCoreValueChange(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Description</label>
                  <textarea
                    rows={2}
                    disabled={!canEdit}
                    value={val.desc}
                    onChange={(e) => handleCoreValueChange(idx, "desc", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Key Feature Bullet
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={val.feature}
                    onChange={(e) => handleCoreValueChange(idx, "feature", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 4: FRAMEWORK */}
      {activeTab === "framework" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Header Copy */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#082B59] flex items-center gap-2">
              <Layers size={16} className="text-[#0756A5]" />
              <span>Engineering Architecture Framework Header</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Tag</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.frameworkTag}
                  onChange={(e) => handleFieldChange("frameworkTag", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.frameworkTitle}
                  onChange={(e) => handleFieldChange("frameworkTitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Section Subtitle</label>
              <textarea
                rows={2}
                disabled={!canEdit}
                value={aboutContent.frameworkSubtitle}
                onChange={(e) => handleFieldChange("frameworkSubtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>
          </div>

          {/* 4 Framework Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutContent.engineeringFramework.map((stage, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-mono font-bold text-[#FF6900]">
                    Framework Stage {stage.step || idx + 1}
                  </span>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={stage.step}
                    onChange={(e) => handleFrameworkChange(idx, "step", e.target.value)}
                    className="w-12 px-2 py-0.5 text-right font-mono text-xs border border-gray-200 rounded disabled:bg-gray-50"
                    placeholder="01"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Stage Title</label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={stage.title}
                    onChange={(e) => handleFrameworkChange(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">
                    Stage Description
                  </label>
                  <textarea
                    rows={2}
                    disabled={!canEdit}
                    value={stage.desc}
                    onChange={(e) => handleFrameworkChange(idx, "desc", e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 5: SLA & FINAL CTA */}
      {activeTab === "slaCta" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Commercial Commitment & SLA Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-[#082B59] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#0756A5]" />
              <span>Commercial Guarantee & SLA Banner</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Guarantee Tag</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.guaranteeTag}
                  onChange={(e) => handleFieldChange("guaranteeTag", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Guarantee Title</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.guaranteeTitle}
                  onChange={(e) => handleFieldChange("guaranteeTitle", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Guarantee Commitment Narrative
              </label>
              <textarea
                rows={3}
                disabled={!canEdit}
                value={aboutContent.guaranteeDesc}
                onChange={(e) => handleFieldChange("guaranteeDesc", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            {/* 4 SLA Metrics */}
            <div className="pt-3 border-t border-gray-100">
              <span className="block text-xs font-bold text-gray-700 mb-3">
                4 Live Architecture & Commercial Metrics
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Architecture SLA
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.slaUptime}
                    onChange={(e) => handleFieldChange("slaUptime", e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-bold text-xs text-emerald-600 disabled:bg-gray-100"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Sprint Cadence
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.slaTurnaround}
                    onChange={(e) => handleFieldChange("slaTurnaround", e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-bold text-xs text-amber-600 disabled:bg-gray-100"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Asset Ownership
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.slaEscrow}
                    onChange={(e) => handleFieldChange("slaEscrow", e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-bold text-xs text-cyan-600 disabled:bg-gray-100"
                  />
                </div>

                <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">
                    Security Level
                  </label>
                  <input
                    type="text"
                    disabled={!canEdit}
                    value={aboutContent.slaSecurity}
                    onChange={(e) => handleFieldChange("slaSecurity", e.target.value)}
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded font-bold text-xs text-blue-600 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Final Call to Action Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#082B59] flex items-center gap-2">
              <Zap size={16} className="text-[#FF6900]" />
              <span>Final Call to Action (CTA) Banner</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">CTA Tag</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.ctaTag}
                  onChange={(e) => handleFieldChange("ctaTag", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">CTA Headline</label>
                <input
                  type="text"
                  disabled={!canEdit}
                  value={aboutContent.ctaHeadline}
                  onChange={(e) => handleFieldChange("ctaHeadline", e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">CTA Subtitle</label>
              <textarea
                rows={2}
                disabled={!canEdit}
                value={aboutContent.ctaSubtitle}
                onChange={(e) => handleFieldChange("ctaSubtitle", e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[11px] font-bold text-[#FF6900]">Primary Button</span>
                <input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Button Label"
                  value={aboutContent.ctaPrimaryBtnText}
                  onChange={(e) => handleFieldChange("ctaPrimaryBtnText", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:bg-gray-100"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Link (/quote)"
                  value={aboutContent.ctaPrimaryBtnLink}
                  onChange={(e) => handleFieldChange("ctaPrimaryBtnLink", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono disabled:bg-gray-100"
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <span className="text-[11px] font-bold text-[#0756A5]">Secondary Button</span>
                <input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Button Label"
                  value={aboutContent.ctaSecondaryBtnText}
                  onChange={(e) => handleFieldChange("ctaSecondaryBtnText", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs disabled:bg-gray-100"
                />
                <input
                  type="text"
                  disabled={!canEdit}
                  placeholder="Link (/contact)"
                  value={aboutContent.ctaSecondaryBtnLink}
                  onChange={(e) => handleFieldChange("ctaSecondaryBtnLink", e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-mono disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AboutControl;
