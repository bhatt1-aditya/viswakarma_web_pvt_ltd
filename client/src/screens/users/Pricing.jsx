import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calculator,
  Clock,
  Award,
  Lock,
  Activity,
  BarChart3,
  ChevronDown,
  Terminal,
} from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";

const pricingHeadlinePhrases = [
  "Startups & MVP Validation.",
  "High-Growth Mid-Market Businesses.",
  "Enterprise-Scale Digital Platforms.",
  "Dedicated Senior Developer Pods.",
  "Custom Cloud & AI Architecture.",
];

const tiers = [
  {
    name: "Starter Solutions",
    badge: "For Startups & SMBs",
    highlight: false,
    tagline: "High-impact MVP development to validate business concepts rapidly.",
    features: [
      "Custom responsive web application or mobile MVP",
      "Modern React.js / Node.js architecture",
      "Essential REST APIs & database schema",
      "Payment gateway integration (UPI / Razorpay / Stripe)",
      "Basic admin management dashboard",
      "30-day post-launch warranty & bug fixes",
      "100% source code & IP transfer",
    ],
    cta: "Request Starter Consultation",
  },
  {
    name: "Business Solutions",
    badge: "Most Popular For Mid-Market",
    highlight: true,
    tagline: "Scalable digital infrastructure engineered for heavy daily transaction volumes.",
    features: [
      "Full-stack web platform + cross-platform mobile app",
      "Tailored CRM / ERP modules & departmental workflows",
      "Automated WhatsApp & Email customer notification triggers",
      "Multi-role user permission hierarchies (RBAC)",
      "High-availability database optimization & indexing",
      "60-day post-launch warranty & SLA support",
      "Complete CI/CD deployment pipeline on AWS/GCP",
    ],
    cta: "Request Business Tier Quote",
  },
  {
    name: "Enterprise Solutions",
    badge: "For Corporations & Scale-ups",
    highlight: false,
    tagline: "Mission-critical architectures engineered for strict compliance, high concurrency, and zero downtime.",
    features: [
      "Multi-tenant SaaS product engineering or corporate ERP",
      "AI & machine learning autonomous workflow pipelines",
      "Microservices architecture with Redis & message queues",
      "ISO 27001 / SOC-2 security compliance architecture",
      "Biometric attendance, multi-warehouse & GST engine",
      "Dedicated senior engineering pod & architect lead",
      "24/7 technical monitoring & quarterly security audits",
    ],
    cta: "Consult Enterprise Architects",
  },
];

const pricingFaqs = [
  {
    q: "How are project milestones structured and billed?",
    a: "We operate on transparent milestone deliverables. A project typically has 3-4 milestone gates (Discovery/Architecture, Alpha Prototype, Beta Testing/QA, and Production Go-Live). You only release milestone funds upon your review and approval of verifiable demo code.",
  },
  {
    q: "Who owns the intellectual property and source code?",
    a: "You retain 100% full intellectual property ownership. Upon milestone sign-off, all Git repositories, Figma design systems, database schemas, and documentation are formally assigned to your organization.",
  },
  {
    q: "Do you provide post-deployment warranty and technical SLA?",
    a: "Yes. Every engagement includes a 30 to 90-day post-launch warranty covering bug remediation and infrastructure stabilization, with ongoing annual SLA maintenance retainers available.",
  },
  {
    q: "Can we hire dedicated full-stack developer pods on retainer?",
    a: "Yes. We offer dedicated engineering pods (Senior Full-Stack Engineer, UI/UX Designer, QA Specialist, and Solution Architect) on flexible monthly agile retainers.",
  },
];

const Pricing = () => {
  const [pricingTiers, setPricingTiers] = useState(tiers);
  const [pricingFaqList, setPricingFaqList] = useState(pricingFaqs);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/pricing/all`)
      .then((res) => {
        if (res.data?.success) {
          if (Array.isArray(res.data.tiers) && res.data.tiers.length > 0) {
            setPricingTiers(res.data.tiers);
          }
          if (Array.isArray(res.data.faqs) && res.data.faqs.length > 0) {
            setPricingFaqList(res.data.faqs);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // FAQ accordion state
  const [openFaq, setOpenFaq] = useState(0);

  // Project Estimator Calculator State
  const [projectType, setProjectType] = useState("web");
  const [scale, setScale] = useState("medium");
  const [needAI, setNeedAI] = useState(false);
  const [needMobile, setNeedMobile] = useState(false);
  const [needERP, setNeedERP] = useState(false);

  // Estimator Form
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const currentPhrase = pricingHeadlinePhrases[phraseIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % pricingHeadlinePhrases.length);
        }
      }, 35);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.slice(0, displayText.length + 1));
        if (displayText.length === currentPhrase.length) {
          timer = setTimeout(() => {
            setIsDeleting(true);
          }, 2000);
        }
      }, 70);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);

  // Estimated range calculation logic
  const calculateEstimate = () => {
    let baseMin = 45000;
    let baseMax = 95000;

    if (projectType === "mobile") {
      baseMin += 40000;
      baseMax += 85000;
    } else if (projectType === "enterprise") {
      baseMin += 120000;
      baseMax += 250000;
    }

    if (scale === "large") {
      baseMin *= 1.8;
      baseMax *= 2.2;
    } else if (scale === "enterprise") {
      baseMin *= 3;
      baseMax *= 3.5;
    }

    if (needAI) {
      baseMin += 35000;
      baseMax += 75000;
    }
    if (needMobile) {
      baseMin += 45000;
      baseMax += 90000;
    }
    if (needERP) {
      baseMin += 60000;
      baseMax += 120000;
    }

    return `₹${Math.round(baseMin).toLocaleString("en-IN")} – ₹${Math.round(baseMax).toLocaleString("en-IN")}`;
  };

  const estimatedRange = calculateEstimate();

  const handleEstimateSubmit = async (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      toast.error("Please fill in your name, email, and phone number.");
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/inquiries/submit`, {
        fullName: clientName,
        email: clientEmail,
        phone: clientPhone,
        serviceRequired: `Calculator Estimate: ${projectType} (${scale})`,
        projectBudget: estimatedRange,
        projectDescription: `Calculated requirements: Type: ${projectType}, Scale: ${scale}, AI: ${needAI}, Mobile: ${needMobile}, ERP: ${needERP}`,
      });
      toast.success("Estimate saved! A senior consultant will reach out with a detailed proposal.");
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit estimate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F5F8FC] min-h-screen">
      {/* =========================================================================
          1. HERO SECTION WITH ANIMATED TYPEWRITER & FLOATING TERMINAL
         ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#071426] via-[#082B59] to-[#071426] text-white pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0756A5]/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#0756A5]/25 rounded-full blur-[100px] pointer-events-none animate-pulse-soft" />
        <div className="absolute bottom-10 -right-32 w-96 h-96 bg-[#FF6900]/20 rounded-full blur-[100px] pointer-events-none animate-pulse-soft" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Column */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#FF8A00] tracking-wide backdrop-blur-md">
                <Sparkles size={14} className="text-[#FF6900]" />
                <span>Transparent Commercial Engagement & Pricing</span>
              </div>

              {/* Animated Typewriter Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
                <span>Transparent Pricing For</span>{" "}
                <span className="block mt-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6900] via-[#FF8A00] to-amber-300">
                    {displayText}
                  </span>
                  <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF6900] ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Predictable milestone billing, zero hidden fees, and complete intellectual property ownership. Choose a structured tier or calculate your instant customized estimate below.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <a
                    href="#calculator"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm tracking-wide hover:shadow-glowOrange transition-all shadow-lg shadow-orange-900/40 flex items-center gap-2"
                  >
                    <Calculator size={16} />
                    <span>Instant Price Estimator</span>
                  </a>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/quote"
                    className="px-6 py-3.5 rounded-xl bg-[#0756A5] text-white font-bold text-sm tracking-wide hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2"
                  >
                    <span>Request Custom Scope</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>

              {/* Credibility Metric Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white">100%</p>
                  <p className="text-xs text-gray-400">IP Transfer Included</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-[#FF8A00]">0</p>
                  <p className="text-xs text-gray-400">Hidden Fees</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-400">30-90D</p>
                  <p className="text-xs text-gray-400">Post-Launch Warranty</p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Floating 3D Animated Commercial Terminal */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-md lg:max-w-none"
              >
                {/* Main Card */}
                <div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-1 border border-white/20 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-xl bg-[#082B59]/90 p-5 space-y-4">
                    {/* Window Header */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold tracking-wider">
                          BILLING TRANSPARENCY
                        </span>
                      </div>
                    </div>

                    {/* Estimator Code Box */}
                    <div className="bg-[#071426] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 border border-white/5 shadow-inner">
                      <p className="text-blue-400">{"// Commercial Agreement Model"}</p>
                      <p>
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-amber-300">commercialTerms</span> = {`{`}
                      </p>
                      <p className="pl-4">
                        model: <span className="text-emerald-400">"Milestone-Based Delivery"</span>,
                      </p>
                      <p className="pl-4">
                        hiddenCharges: <span className="text-[#FF8A00]">"₹0 Strict Guarantee"</span>,
                      </p>
                      <p className="pl-4">
                        codebaseOwnership: <span className="text-cyan-400">"100% Client IP"</span>,
                      </p>
                      <p className="pl-4">
                        warranty: <span className="text-emerald-400">"Included in SOW"</span>
                      </p>
                      <p>{`};`}</p>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          <Terminal size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Milestones</p>
                          <p className="text-xs font-bold text-white">Bi-Weekly Sign-Off</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF8A00] flex items-center justify-center font-bold">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Invoicing</p>
                          <p className="text-xs font-bold text-white">Verified Demos Only</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 1 (Top Right) */}
                <motion.div
                  animate={{ y: [6, -6, 6] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-4 bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white p-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-white/20"
                >
                  <Award size={16} />
                  <span>Fixed or Sprint Pricing</span>
                </motion.div>

                {/* Floating Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 bg-[#0756A5] text-white p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-bold"
                >
                  <Lock size={16} className="text-cyan-300" />
                  <span>100% IP Handover</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. THREE COMMERCIAL TIERS (STARTER, BUSINESS, ENTERPRISE)
         ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Standard Engagement Packages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Engineered for Every Corporate Stage
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Transparent, milestone-based packages tailored from early-stage MVP launch to global enterprise infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {pricingTiers.map((tier, idx) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  tier.highlight
                    ? "bg-gradient-to-b from-[#082B59] to-[#071426] text-white shadow-2xl border-2 border-[#FF6900]"
                    : "bg-[#F5F8FC] border border-gray-100 text-gray-800 hover:shadow-cardHover hover:bg-white"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white px-4 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span
                      className={`text-xs font-bold uppercase tracking-wider ${
                        tier.highlight ? "text-[#FF8A00]" : "text-[#0756A5]"
                      }`}
                    >
                      {tier.badge}
                    </span>
                    <h3
                      className={`text-2xl font-extrabold mt-1 ${
                        tier.highlight ? "text-white" : "text-[#082B59]"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <p
                      className={`text-xs mt-2 leading-relaxed ${
                        tier.highlight ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {tier.tagline}
                    </p>
                  </div>

                  <div
                    className={`pt-6 border-t space-y-3 ${
                      tier.highlight ? "border-white/10" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider block ${
                        tier.highlight ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      What's Included:
                    </span>
                    {tier.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5 text-xs">
                        <CheckCircle2
                          size={16}
                          className={`shrink-0 mt-0.5 ${
                            tier.highlight ? "text-[#FF8A00]" : "text-emerald-500"
                          }`}
                        />
                        <span
                          className={`leading-relaxed ${
                            tier.highlight ? "text-gray-200" : "text-gray-700"
                          }`}
                        >
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 mt-6">
                  <Link
                    to={`/quote?package=${encodeURIComponent(tier.name)}`}
                    className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-center block transition-all shadow-md ${
                      tier.highlight
                        ? "bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange"
                        : "bg-[#0756A5] text-white hover:bg-blue-600"
                    }`}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. INTERACTIVE PROJECT ESTIMATOR CALCULATOR
         ========================================================================= */}
      <section id="calculator" className="py-20 bg-[#F5F8FC] border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-[#FF6900] text-xs font-bold uppercase tracking-wider">
              <Calculator size={14} />
              <span>Instant Scope Modeling</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Interactive Project Estimator
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">
              Customize your parameters to model estimated investment and turnaround timeline in real time.
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-gray-200/80 p-8 lg:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Parameters Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Parameter 1: Project Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  1. Core Architecture Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "web", label: "Web Platform" },
                    { id: "mobile", label: "Mobile App" },
                    { id: "enterprise", label: "ERP / Suite" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectType(item.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        projectType === item.id
                          ? "bg-[#0756A5] text-white border-[#0756A5] shadow-sm"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 2: Scale */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  2. User Scale & Concurrency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "medium", label: "Startup / SMB" },
                    { id: "large", label: "Mid-Market" },
                    { id: "enterprise", label: "Enterprise" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setScale(item.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        scale === item.id
                          ? "bg-[#0756A5] text-white border-[#0756A5] shadow-sm"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameter 3: Add-On Features */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  3. Specialized Capabilities
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      needAI
                        ? "bg-orange-50 border-[#FF6900] text-[#FF6900]"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={needAI}
                      onChange={(e) => setNeedAI(e.target.checked)}
                      className="rounded text-[#FF6900] focus:ring-0"
                    />
                    <span className="text-xs font-bold">AI & Automation</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      needMobile
                        ? "bg-orange-50 border-[#FF6900] text-[#FF6900]"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={needMobile}
                      onChange={(e) => setNeedMobile(e.target.checked)}
                      className="rounded text-[#FF6900] focus:ring-0"
                    />
                    <span className="text-xs font-bold">Mobile App Companion</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                      needERP
                        ? "bg-orange-50 border-[#FF6900] text-[#FF6900]"
                        : "border-gray-200 text-gray-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={needERP}
                      onChange={(e) => setNeedERP(e.target.checked)}
                      className="rounded text-[#FF6900] focus:ring-0"
                    />
                    <span className="text-xs font-bold">ERP / Warehouse Hub</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Results & Lead Form (5 cols) */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#082B59] to-[#071426] text-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6 shadow-xl">
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00] block">
                  Modeled Budget Bracket
                </span>
                <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {estimatedRange}
                </p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Includes full UI/UX design, modular backend/frontend engineering, testing, cloud deployment, and 100% IP transfer.
                </p>
              </div>

              {/* Lead Capture Form */}
              <form onSubmit={handleEstimateSubmit} className="space-y-3 pt-2">
                <input
                  type="text"
                  placeholder="Your Full Name *"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-[#FF6900]"
                  required
                />
                <input
                  type="email"
                  placeholder="Work Email Address *"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-[#FF6900]"
                  required
                />
                <input
                  type="tel"
                  placeholder="Contact Number / WhatsApp *"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs focus:outline-none focus:border-[#FF6900]"
                  required
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all disabled:opacity-50"
                >
                  {submitting ? "Saving Estimate..." : "Lock In Estimate & Get Scope"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. FREQUENTLY ASKED PRICING QUESTIONS (ACCORDION)
         ========================================================================= */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Financial Clarity</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Frequently Asked Pricing Questions
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Clear answers regarding payment schedules, milestone approvals, and intellectual property protection.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {pricingFaqList.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 overflow-hidden bg-[#F5F8FC] shadow-sm"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                    className="w-full text-left p-5 font-bold text-sm text-[#082B59] flex items-center justify-between hover:bg-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0756A5]" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="p-5 bg-white text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100"
                      >
                        {faq.a}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. COMMERCIAL COMMITMENT & SLA SPOTLIGHT BANNER
         ========================================================================= */}
      <section className="py-20 bg-[#071426] text-white relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#0756A5]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FF6900]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-gradient-to-br from-[#082B59]/95 via-[#0756A5]/80 to-[#071426] border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6900]/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF8A00] text-xs font-bold uppercase tracking-wider">
                  <BarChart3 size={14} />
                  <span>The Vishwakarma Financial Guarantee</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Transparent Partnerships Rooted in Engineering Accountability
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Every engagement is protected by a fixed scope or transparent sprint commitment. We operate with zero hidden charges, bi-weekly verifiable milestone reviews, and 100% intellectual property handover upon project completion.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/quote"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-md"
                  >
                    Request Project Scope & Estimate
                  </Link>

                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md"
                  >
                    Speak with Technical Leadership
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Activity size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">99.99%</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Architecture SLA</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Continuous monitoring, automated backups, and incident response.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">2 Weeks</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Sprint Cadence</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Predictable agile deliveries with working code shipped regularly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Award size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">100% IP</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Total Asset Transfer</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    You hold all rights to code, Figma design files, and database schemas.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Lock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">Zero-Trust</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Enterprise Security</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    RBAC, encrypted data in transit & at rest, and OWASP audits.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          6. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-[#0756A5] via-[#082B59] to-[#071426] text-white relative overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#FF8A00] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} />
            <span>Need Custom Commercial Pricing?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Have a Specific Scope? Let's Price It Transparently.
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Partner with Vishwakarma Web Private Limited to architect, implement, and maintain custom software built for scale and commercial success.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/quote"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-lg block"
              >
                Request a Custom Quote
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md block"
              >
                Speak with Solutions Team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;