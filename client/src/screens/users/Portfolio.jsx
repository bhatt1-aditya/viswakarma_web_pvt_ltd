import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  Lock,
  Activity,
  BarChart3,
  Terminal,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";

const portfolioHeadlinePhrases = [
  "Mission-Critical Enterprise Systems.",
  "High-Volume Marketplace Engines.",
  "Intelligent AI & Automation Bots.",
  "Secure Healthcare Telemedicine Apps.",
  "Automated Industrial ERP Solutions.",
];

const defaultCaseStudies = [
  {
    title: "Omnichannel B2B & B2C Marketplace Engine",
    category: "E-Commerce Solutions",
    clientIndustry: "Wholesale & Retail Commerce",
    summary: "Multi-vendor digital commerce architecture capable of handling 20,000+ daily orders with real-time multi-warehouse dispatch.",
    techStack: ["Next.js", "Node.js", "MongoDB", "Redis", "Razorpay"],
    deliverables: ["Customer PWA Storefront", "Vendor Seller Portal", "Logistics Dispatch Hub"],
    results: ["340% increase in checkout speed", "99.98% uptime during festive peak sale"],
    demoUrl: "/live-demos/multi-vendor-marketplace",
    accent: "from-[#FF6900] to-amber-500",
  },
  {
    title: "Cloud Enterprise ERP & Supply Chain Modernization",
    category: "Custom Software & Enterprise Solutions",
    clientIndustry: "Industrial Manufacturing",
    summary: "End-to-end manufacturing execution and supply chain visibility suite replacing 15 years of legacy spreadsheets.",
    techStack: ["React.js", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
    deliverables: ["Shopfloor Tablet Interface", "Procurement Approval Matrix", "Executive BI Dashboard"],
    results: ["45% reduction in production downtime", "Full inventory traceability across 4 facilities"],
    demoUrl: "/live-demos/erp-software",
    accent: "from-blue-600 to-indigo-600",
  },
  {
    title: "Telemedicine & Smart Clinical Consultation Mobile App",
    category: "Mobile Application Development",
    clientIndustry: "Healthcare",
    summary: "HIPAA-compliant doctor consultation, e-prescription generation, and integrated diagnostic lab booking mobile suite.",
    techStack: ["Flutter", "WebRTC", "Node.js", "MongoDB", "AWS S3"],
    deliverables: ["Patient Mobile App", "Doctor Consultation Tablet App", "Clinic Reception Desk"],
    results: ["Over 25,000 consultations completed", "4.8/5 App Store customer satisfaction score"],
    demoUrl: "/live-demos/hospital-management",
    accent: "from-cyan-500 to-blue-600",
  },
  {
    title: "Autonomous AI Customer Service & Sales Assistant",
    category: "AI, Machine Learning & Automation",
    clientIndustry: "Financial Services & SaaS",
    summary: "Context-aware conversational AI agent answering 80% of inbound customer queries and qualifying sales leads round-the-clock.",
    techStack: ["Python", "FastAPI", "LangChain", "Vector DB", "React.js"],
    deliverables: ["Omnichannel AI Chat Widget", "Knowledge Base Ingestion Pipeline", "CRM Lead Sync"],
    results: ["78% first-contact resolution without human intervention", "Sub-second response time"],
    demoUrl: "/live-demos/ai-chatbot",
    accent: "from-purple-600 to-indigo-600",
  },
  {
    title: "High-Performance Institutional Real Estate Portal",
    category: "Custom Software & Enterprise Solutions",
    clientIndustry: "Real Estate & Commercial Infrastructure",
    summary: "Modern property discovery platform with interactive virtual tour booking, mortgage calculators, and lead attribution.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    deliverables: ["Public Listing Portal", "Broker Lead Assignment Dashboard", "Virtual Tour Viewer"],
    results: ["62% increase in scheduled property walkthroughs", "100% lead capture speed under 2 minutes"],
    demoUrl: "/live-demos/real-estate-portal",
    accent: "from-blue-500 to-teal-500",
  },
  {
    title: "Automated Corporate HRMS & Biometric Payroll",
    category: "Custom Software & Enterprise Solutions",
    clientIndustry: "Professional Corporate Services",
    summary: "Automated personnel lifecycle system connecting biometric shift punches with statutory salary deductions and leave balances.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "PDFKit"],
    deliverables: ["Employee Self-Service Portal", "HR Admin Payroll Console", "Automated Payslip Generator"],
    results: ["Payroll processing time dropped from 4 days to 20 minutes", "100% statutory compliance"],
    demoUrl: "/live-demos/hrms-software",
    accent: "from-emerald-600 to-teal-600",
  },
];

const Portfolio = () => {
  const [projects, setProjects] = useState(defaultCaseStudies);
  const [filterCat, setFilterCat] = useState("all");

  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = portfolioHeadlinePhrases[phraseIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % portfolioHeadlinePhrases.length);
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

  useEffect(() => {
    // Optionally hydrate from backend
    axios
      .get(`${API_BASE_URL}/portfolio/all`)
      .then((res) => {
        if (res.data?.projects?.length > 0) {
          setProjects(res.data.projects);
        }
      })
      .catch(() => { });
  }, []);

  const filtered = projects.filter(
    (p) => filterCat === "all" || p.category === filterCat
  );

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
                <span>Verified Engineering Case Studies & Client Builds</span>
              </div>

              {/* Animated Typewriter Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
                <span>Production Builds For</span>{" "}
                <span className="block mt-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6900] via-[#FF8A00] to-amber-300">
                    {displayText}
                  </span>
                  <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF6900] ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Explore our portfolio of delivered custom software architectures, e-commerce engines, enterprise ERP suites, and AI automations. Every case study represents production-tested code delivered on-time and backed by strict SLAs.
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
                    <span>Request Project Estimation</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </div>

              {/* Credibility Metric Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white">6</p>
                  <p className="text-xs text-gray-400">Flagship Case Studies</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-[#FF8A00]">20</p>
                  <p className="text-xs text-gray-400">Live Demonstrations</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-400">100%</p>
                  <p className="text-xs text-gray-400">Client Code Ownership</p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Floating 3D Animated Telemetry Terminal */}
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
                          PRODUCTION VERIFIED
                        </span>
                      </div>
                    </div>

                    {/* Case Study Code Box */}
                    <div className="bg-[#071426] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 border border-white/5 shadow-inner">
                      <p className="text-blue-400">{"// Vishwakarma Production Deployment"}</p>
                      <p>
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-amber-300">verifiedBuild</span> ={" "}
                        <span className="text-purple-400">await</span> Production.deploy({`{`}
                      </p>
                      <p className="pl-4">
                        uptime: <span className="text-emerald-400">"99.98% High-Availability"</span>,
                      </p>
                      <p className="pl-4">
                        security: <span className="text-[#FF8A00]">"OWASP Level 3 Audited"</span>,
                      </p>
                      <p className="pl-4">
                        codebase: <span className="text-cyan-400">"Zero Technical Debt"</span>,
                      </p>
                      <p className="pl-4">
                        ipHandover: <span className="text-emerald-400">"100% Client Owned"</span>
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
                          <p className="text-[11px] text-gray-400">Performance</p>
                          <p className="text-xs font-bold text-white">Core Vitals 99+</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF8A00] flex items-center justify-center font-bold">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Milestones</p>
                          <p className="text-xs font-bold text-white">Bi-Weekly Sprints</p>
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
                  <span>Enterprise Track Record</span>
                </motion.div>

                {/* Floating Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 bg-[#0756A5] text-white p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-bold"
                >
                  <Lock size={16} className="text-cyan-300" />
                  <span>Full Repository Transfer</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. FILTER PILLS & CASE STUDIES CARDS GRID
         ========================================================================= */}
      <section className="py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Category Filter Pills Ribbon */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              "all",
              "E-Commerce Solutions",
              "Custom Software & Enterprise Solutions",
              "Mobile Application Development",
              "AI, Machine Learning & Automation",
            ].map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterCat(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterCat === cat
                    ? "bg-[#0756A5] text-white shadow-md shadow-blue-500/20"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
              >
                {cat === "all" ? "All Case Studies" : cat}
              </motion.button>
            ))}
          </div>

          {/* Project Cards Grid (Balanced 3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filtered.map((proj, idx) => (
                <motion.div
                  key={proj.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-cardHover hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-[#FF6900] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
                        {proj.clientIndustry}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">Verified Build</span>
                    </div>

                    <h3 className="text-base font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors leading-snug">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {proj.summary}
                    </p>

                    {/* Tech Stack */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack?.map((t, tidx) => (
                        <span
                          key={tidx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-50 border border-gray-100 text-gray-600"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Deliverables */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        Engineered Handover:
                      </span>
                      {proj.deliverables?.map((d, didx) => (
                        <div key={didx} className="flex items-center gap-2 text-xs text-gray-700">
                          <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>

                    {/* Production Results Badges */}
                    {proj.results?.length > 0 && (
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                        <span className="text-[10px] font-extrabold text-[#0756A5] uppercase tracking-wider block">
                          Verified Commercial Result:
                        </span>
                        {proj.results.map((r, ridx) => (
                          <p key={ridx} className="text-xs font-semibold text-gray-800 leading-tight">
                            ⚡ {r}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between gap-3">
                    <Link
                      to={proj.demoUrl}
                      className="text-xs font-bold text-[#FF6900] hover:text-orange-600 flex items-center gap-1.5 transition-colors"
                    >
                      <span>Interactive Demo</span>
                      <ExternalLink size={13} />
                    </Link>

                    <Link
                      to={`/quote?project=${encodeURIComponent(proj.title)}`}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#0756A5]/10 text-[#0756A5] hover:bg-[#0756A5] hover:text-white transition-colors"
                    >
                      Request Similar Build
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
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
                  <span>The Vishwakarma Quality Standard</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Transparent Partnerships Rooted in Engineering Accountability
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  Every case study shown above was delivered with 100% intellectual property transfer, direct sprint review demos, and pre-agreed milestone sign-offs. We take pride in building software that drives commercial ROI for our clients.
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
                    Consult Senior Architects
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
          4. FINAL CALL TO ACTION
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-[#0756A5] via-[#082B59] to-[#071426] text-white relative overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#FF8A00] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} />
            <span>Ready to Build Your Case Study?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Have a Project in Mind? Let's Architect It.
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Partner with Vishwakarma Web Private Limited to turn business vision into scalable, enterprise-grade software.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/quote"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-lg block"
              >
                Request a Free Quote
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/contact"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md block"
              >
                Contact Our Team
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;