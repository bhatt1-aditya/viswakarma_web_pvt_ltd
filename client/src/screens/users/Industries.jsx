import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  HeartPulse,
  GraduationCap,
  ShoppingCart,
  Building,
  Compass,
  ShieldCheck,
  Truck,
  Layers,
  Store,
  Zap,
  Briefcase,
  Clock,
  Award,
  Lock,
  Activity,
  BarChart3,
  ExternalLink,
  Terminal,
} from "lucide-react";

const industryHeadlinePhrases = [
  "Healthcare & Telemedicine.",
  "Logistics & Smart Fleet Tracking.",
  "B2B & Retail E-Commerce.",
  "Institutional Real Estate Portals.",
  "Industrial Manufacturing & ERP.",
];

const industries = [
  {
    title: "Healthcare & Telemedicine",
    icon: HeartPulse,
    challenge: "Fragmented electronic medical records, non-compliant patient communication channels, and inefficient doctor OPD scheduling.",
    solution: "HIPAA-aligned patient portals, encrypted WebRTC clinical consultations, and automated diagnostic lab report synchronization.",
    keyServices: ["Hospital & Clinic Management Software", "Healthcare & Telemedicine Mobile Apps"],
    demoRoute: "/live-demos/hospital-management",
    accent: "from-blue-600 to-cyan-500",
  },
  {
    title: "Education & EdTech",
    icon: GraduationCap,
    challenge: "Disconnected student information systems, manual paper-based fee reconciliation, and low remote learning engagement.",
    solution: "Unified campus ERP suites, interactive video learning management systems (LMS), and automated grade report cards.",
    keyServices: ["School, College & Institute Management Systems", "EdTech & E-Learning Mobile Apps"],
    demoRoute: "/live-demos/school-management",
    accent: "from-indigo-600 to-purple-500",
  },
  {
    title: "E-Commerce & Digital Retail",
    icon: ShoppingCart,
    challenge: "High cart abandonment, database locks during flash sales, and manual inventory updates across multiple marketplaces.",
    solution: "Decoupled headless storefronts, multi-vendor marketplace engines, and automated multi-warehouse dispatch pipelines.",
    keyServices: ["Custom E-Commerce Storefront Development", "Multi-Vendor Marketplace Development"],
    demoRoute: "/live-demos/ecommerce-store",
    accent: "from-[#FF6900] to-amber-500",
  },
  {
    title: "Real Estate & Infrastructure",
    icon: Building,
    challenge: "Slow broker lead follow-ups, static property photos failing to engage NRI buyers, and disjointed visit tracking.",
    solution: "Interactive property portals with virtual tours, mortgage calculators, and automated lead distribution to broker CRM.",
    keyServices: ["Real Estate & Property Management Portals", "Landing Page Design & Optimization"],
    demoRoute: "/live-demos/real-estate-portal",
    accent: "from-blue-500 to-blue-700",
  },
  {
    title: "Travel & Hospitality",
    icon: Compass,
    challenge: "Complex multi-day itinerary customizations, manual booking calculations, and fragmented reservation vouchers.",
    solution: "Real-time travel booking engines, dynamic group pricing matrices, and automated customer itinerary dispatch.",
    keyServices: ["Custom Web Portal Development (B2B/B2C)", "On-Demand Delivery & Booking Apps"],
    demoRoute: "/live-demos/travel-booking",
    accent: "from-emerald-500 to-teal-600",
  },
  {
    title: "Finance & FinTech",
    icon: ShieldCheck,
    challenge: "Strict regulatory audit mandates, latency in payment gateway settlement, and security vulnerabilities.",
    solution: "PCI-compliant payment orchestration, automated GST invoicing engines, and real-time ledger reconciliation.",
    keyServices: ["Payment Gateway Integration (Razorpay, Stripe, UPI)", "Accounting, Billing & Invoicing Software"],
    demoRoute: "/live-demos/invoice-billing",
    accent: "from-[#082B59] to-[#0756A5]",
  },
  {
    title: "Logistics & Supply Chain",
    icon: Truck,
    challenge: "Lack of real-time consignment visibility, manual manifest paperwork, and warehouse inventory deadlocks.",
    solution: "Fleet tracking portals, barcode scan inventory tracking, and carrier API integration for instant consignment tracking.",
    keyServices: ["Supply Chain & Logistics Tracking Systems", "Inventory & Warehouse Management Software"],
    demoRoute: "/live-demos/inventory-management",
    accent: "from-amber-600 to-orange-500",
  },
  {
    title: "Industrial Manufacturing",
    icon: Layers,
    challenge: "Disparate shopfloor machine data, manual bill-of-materials tracking, and untracked raw material waste.",
    solution: "Centralized manufacturing ERP suites, real-time machine telemetry, and predictive procurement order generation.",
    keyServices: ["Custom Enterprise Resource Planning (ERP) Software", "Manufacturing & Production Management Software"],
    demoRoute: "/live-demos/erp-software",
    accent: "from-blue-600 to-indigo-700",
  },
  {
    title: "Retail & B2B Wholesaling",
    icon: Store,
    challenge: "Handling bulk order volume tiers, manual GST quote requests, and fragmented offline billing registers.",
    solution: "Self-service B2B wholesale portals with tiered price locks, instant GST invoicing, and POS counter sync.",
    keyServices: ["B2B Wholesale E-Commerce Portals", "Wholesale, Import-Export & Trading ERP"],
    demoRoute: "/live-demos/multi-vendor-marketplace",
    accent: "from-[#FF8A00] to-rose-500",
  },
  {
    title: "Fast-Growth Startups",
    icon: Zap,
    challenge: "High burn rates, slow development agencies missing MVP launch deadlines, and inability to pivot quickly.",
    solution: "Rapid agile prototyping, scalable cloud-native architectures, and dedicated full-stack engineering pods.",
    keyServices: ["SaaS Product Engineering", "Single-Page Application (SPA) Development"],
    demoRoute: "/live-demos/admin-dashboard",
    accent: "from-amber-500 to-[#FF6900]",
  },
  {
    title: "Professional Corporate Services",
    icon: Briefcase,
    challenge: "Unstructured client file sharing over emails, manual contract tracking, and poor time logging visibility.",
    solution: "Secure self-service client vaults, document lifecycle automation, and integrated billable project management.",
    keyServices: ["Customer Relationship Management (CRM) Systems", "Human Resource Management System (HRMS)"],
    demoRoute: "/live-demos/crm-software",
    accent: "from-cyan-600 to-blue-700",
  },
  {
    title: "Proprietary Government & Utilities",
    icon: ShieldCheck,
    challenge: "Legacy mainframe records, citizen access bottlenecks, and siloed administrative departments.",
    solution: "Secure citizen self-service portals, role-based departmental routing, and automated compliance auditing.",
    keyServices: ["Custom Web Portal Development (B2B/B2C)", "Cloud & DevOps Solutions"],
    demoRoute: "/live-demos/admin-dashboard",
    accent: "from-slate-700 to-blue-900",
  },
];

const Industries = () => {
  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = industryHeadlinePhrases[phraseIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % industryHeadlinePhrases.length);
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
                <span>Vertical Domain Expertise • 12 Industry Sectors</span>
              </div>

              {/* Animated Typewriter Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
                <span>Specialized Software For</span>{" "}
                <span className="block mt-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6900] via-[#FF8A00] to-amber-300">
                    {displayText}
                  </span>
                  <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF6900] ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                We engineer domain-specialized software architectures designed to solve regulatory, operational, and customer challenges across 12 core industries. Every architecture aligns directly with your sector's compliance mandates and commercial workflows.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/live-demos"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm tracking-wide hover:shadow-glowOrange transition-all shadow-lg shadow-orange-900/40 flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Explore 20 Live Demos</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/quote"
                    className="px-6 py-3.5 rounded-xl bg-[#0756A5] text-white font-bold text-sm tracking-wide hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2"
                  >
                    <span>Request Industry Scope</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>

              {/* Credibility Metric Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white">12</p>
                  <p className="text-xs text-gray-400">Core Sectors</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-[#FF8A00]">20</p>
                  <p className="text-xs text-gray-400">Functional Demos</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-400">100%</p>
                  <p className="text-xs text-gray-400">IP Handover</p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Floating 3D Animated Industry Terminal */}
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
                          DOMAIN ENGINE ACTIVE
                        </span>
                      </div>
                    </div>

                    {/* Catalog Query Code Box */}
                    <div className="bg-[#071426] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 border border-white/5 shadow-inner">
                      <p className="text-blue-400">{"// Industry Vertical Architecture"}</p>
                      <p>
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-amber-300">sectorEngine</span> ={" "}
                        <span className="text-purple-400">await</span> Vishwakarma.
                        <span className="text-blue-300">buildDomainSolution</span>({`{`}
                      </p>
                      <p className="pl-4">
                        industry: <span className="text-emerald-400">"Healthcare & FinTech"</span>,
                      </p>
                      <p className="pl-4">
                        compliance: <span className="text-[#FF8A00]">"HIPAA / PCI-DSS"</span>,
                      </p>
                      <p className="pl-4">
                        concurrency: <span className="text-cyan-400">"High-Volume Live Feeds"</span>,
                      </p>
                      <p className="pl-4">
                        security: <span className="text-emerald-400">"Bank-Grade Encryption"</span>
                      </p>
                      <p>{`});`}</p>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                          <Terminal size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Integration</p>
                          <p className="text-xs font-bold text-white">Full-Stack Custom</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF8A00] flex items-center justify-center font-bold">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Delivery</p>
                          <p className="text-xs font-bold text-white">Agile Milestones</p>
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
                  <span>12 Proven Verticals</span>
                </motion.div>

                {/* Floating Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 bg-[#0756A5] text-white p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-bold"
                >
                  <Lock size={16} className="text-cyan-300" />
                  <span>Regulatory Compliant</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. 12 BALANCED INDUSTRY VERTICAL CARDS (PERFECT 4x3 / 3x4 GRID)
         ========================================================================= */}
      <section className="py-20 bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Domain Architectures</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Specialized Infrastructure Across 12 Key Sectors
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Examine the critical operational bottlenecks we eliminate and our engineered software solutions for each market vertical.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industries.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  whileHover={{ y: -6 }}
                  className="bg-[#F5F8FC] rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-cardHover hover:border-blue-200 hover:bg-white transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ind.accent} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <IconComp size={22} />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-gray-400 group-hover:text-[#0756A5] transition-colors">
                        Sector #{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                      {ind.title}
                    </h3>

                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-red-50/70 border border-red-100">
                        <span className="font-bold text-red-600 uppercase text-[10px] block">
                          Industry Pain Point:
                        </span>
                        <p className="text-gray-700 mt-1 leading-relaxed">{ind.challenge}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                        <span className="font-bold text-emerald-700 uppercase text-[10px] block">
                          Our Engineered Solution:
                        </span>
                        <p className="text-gray-800 font-medium mt-1 leading-relaxed">{ind.solution}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-gray-200/60 mt-5 flex items-center justify-between gap-2">
                    <Link
                      to={ind.demoRoute}
                      className="text-xs font-bold text-[#FF6900] hover:text-orange-600 flex items-center gap-1 transition-colors"
                    >
                      <span>Try Live Demo</span>
                      <ExternalLink size={12} />
                    </Link>

                    <Link
                      to={`/quote?service=${encodeURIComponent(ind.title)}`}
                      className="text-xs font-bold text-[#0756A5] hover:text-[#082B59] transition-colors"
                    >
                      Consult Solutions →
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. COMMERCIAL COMMITMENT & SLA SPOTLIGHT BANNER
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
                  <span>The Vishwakarma Industry Guarantee</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Domain Engineering Rooted in Regulatory Rigor & Measurable ROI
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  We don't use generic templates for complex industry verticals. From healthcare HIPAA compliance to banking PCI DSS protocols and multi-warehouse logistics telemetry, every system is engineered custom for your regulatory reality.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/quote"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-md"
                  >
                    Request Industry Architecture Scope
                  </Link>

                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md"
                  >
                    Consult Domain Architects
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
                    Continuous monitoring, automated failover, and high availability.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">2 Weeks</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Sprint Velocity</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Agile milestones shipping working code verified bi-weekly.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Award size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">100% IP</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Full Asset Ownership</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    All source code, database architectures, and design files handed over.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Lock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">Zero-Trust</span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Industry Compliance</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    OWASP Level 3, HIPAA, and PCI-ready data protection.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          4. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-[#0756A5] via-[#082B59] to-[#071426] text-white relative overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#FF8A00] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} />
            <span>Ready to Build for Your Vertical?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Have a Specialized Industry Workflow? Let's Architect It.
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Partner with Vishwakarma Web Private Limited to turn complex industry bottlenecks into scalable, automated, and secure digital software.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/quote"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-lg block"
              >
                Request a Free Scope
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md block"
              >
                Contact Our Industry Team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Industries;