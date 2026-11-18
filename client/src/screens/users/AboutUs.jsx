import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Target,
  Compass,
  Users,
  Code2,
  CheckCircle2,
  Server,
  Lock,
  Award,
  Activity,
  Clock,
  BarChart3,
  Layers,
  Terminal,
  Check,
} from "lucide-react";

const aboutPhrases = [
  "Mission-Critical Software.",
  "Scalable Digital Platforms.",
  "Enterprise-Grade Applications.",
  "Intelligent Automated Workflows.",
  "Future-Ready Cloud Systems.",
];

const coreValues = [
  {
    number: "01",
    title: "Engineering Integrity",
    desc: "We write clean, documented, future-proof code that scales gracefully without hidden shortcuts or technical debt.",
    feature: "Strict modular architecture adhering to clean code standards.",
    icon: Code2,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    number: "02",
    title: "Commercial Transparency",
    desc: "Predictable milestone-driven deliverables, transparent sprint tracking, and clear scope agreements without surprise fees.",
    feature: "Bi-weekly sprint reviews and verifiable milestone demos.",
    icon: ShieldCheck,
    gradient: "from-[#FF6900] to-amber-500",
  },
  {
    number: "03",
    title: "Total IP Ownership",
    desc: "100% of all intellectual property, source repositories, databases, and design tokens belong permanently to the client.",
    feature: "Complete transfer of repositories, docs, and assets.",
    icon: Target,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    number: "04",
    title: "Enduring Technical SLA",
    desc: "We stand firmly behind our builds with continuous uptime assurance, security patching, and ongoing feature enhancement.",
    feature: "Proactive uptime monitoring and rapid SLA response.",
    icon: Users,
    gradient: "from-emerald-500 to-teal-600",
  },
];

const engineeringFramework = [
  {
    step: "01",
    title: "Discovery & Enterprise Modeling",
    desc: "Comprehensive business process mapping, user journey planning, and data domain architecture.",
    icon: Compass,
  },
  {
    step: "02",
    title: "Decoupled Modular Architecture",
    desc: "Building scalable frontend micro-interfaces and resilient backend REST APIs designed for scale.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Automated QA & Security Auditing",
    desc: "End-to-end regression testing, OWASP vulnerability scans, and Core Web Vitals optimization.",
    icon: ShieldCheck,
  },
  {
    step: "04",
    title: "Cloud Orchestration & 24/7 SLA",
    desc: "Zero-downtime CI/CD container deployments, cloud monitoring, and dedicated developer retainers.",
    icon: Server,
  },
];

const AboutUs = () => {
  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = aboutPhrases[phraseIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % aboutPhrases.length);
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
    <div className="overflow-hidden bg-[#F5F8FC]">
      {/* =========================================================================
          1. HERO SECTION WITH ANIMATED TYPEWRITER & FLOATING TERMINAL
         ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#071426] via-[#082B59] to-[#071426] text-white pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
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
                <span>About Vishwakarma Web Private Limited</span>
              </div>

              {/* Animated Typewriter Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
                <span>Architecting & Engineering</span>{" "}
                <span className="block mt-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6900] via-[#FF8A00] to-amber-300">
                    {displayText}
                  </span>
                  <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF6900] ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Vishwakarma Web Private Limited is a specialized IT engineering and digital product firm based in Noida, India. We empower ambitious startups, growing mid-market companies, and large enterprises with resilient web platforms, mobile ecosystems, custom enterprise software, and automated AI workflows.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/services"
                    className="px-6 py-3.5 rounded-xl bg-[#0756A5] text-white font-bold text-sm tracking-wide hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2"
                  >
                    <span>Explore 108 Services</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/live-demos"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm tracking-wide hover:shadow-glowOrange transition-all shadow-lg shadow-orange-900/40 flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>View 20 Live Demos</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/contact"
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/20 transition-all backdrop-blur-md block"
                  >
                    Contact Our Team
                  </Link>
                </motion.div>
              </div>

              {/* Credibility Metric Highlights */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white">108</p>
                  <p className="text-xs text-gray-400">Services Catalog</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-[#FF8A00]">100%</p>
                  <p className="text-xs text-gray-400">Client IP Ownership</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-400">99.9%</p>
                  <p className="text-xs text-gray-400">Target Architecture SLA</p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Floating 3D Animated Architecture Card */}
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
                          ENGINEERING STANDARD
                        </span>
                      </div>
                    </div>

                    {/* Architectural Charter Code Box */}
                    <div className="bg-[#071426] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 border border-white/5 shadow-inner">
                      <p className="text-blue-400">{"// Vishwakarma Engineering Charter"}</p>
                      <p>
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-amber-300">companyCharter</span> = {`{`}
                      </p>
                      <p className="pl-4">
                        legalEntity: <span className="text-emerald-400">"Private Limited"</span>,
                      </p>
                      <p className="pl-4">
                        location: <span className="text-emerald-400">"Noida, Uttar Pradesh, India"</span>,
                      </p>
                      <p className="pl-4">
                        methodology: <span className="text-[#FF8A00]">"Agile Sprints + Clean Code"</span>,
                      </p>
                      <p className="pl-4">
                        ipTransfer: <span className="text-cyan-400">"100% Client Ownership"</span>,
                      </p>
                      <p className="pl-4">
                        securityStandard: <span className="text-emerald-400">"OWASP Level 3 Compliant"</span>
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
                          <p className="text-[11px] text-gray-400">Source Code</p>
                          <p className="text-xs font-bold text-white">Full Repos Handed Over</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF8A00] flex items-center justify-center font-bold">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Delivery</p>
                          <p className="text-xs font-bold text-white">2-Week Milestones</p>
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
                  <span>ISO & OWASP Best Practices</span>
                </motion.div>

                {/* Floating Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 bg-[#0756A5] text-white p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-bold"
                >
                  <Lock size={16} className="text-cyan-300" />
                  <span>Enterprise Data Protection</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CORPORATE MISSION & LONG-TERM VISION (ANIMATED CARDS)
         ========================================================================= */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Purpose & Direction</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Our Mission & Long-Term Vision
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              We operate with clear corporate intent: to deliver durable software that helps businesses operate with precision, intelligence, and commercial agility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Corporate Mission Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="p-8 sm:p-10 rounded-3xl bg-[#F5F8FC] border border-gray-100 hover:border-blue-200 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100/80 text-[#0756A5] group-hover:bg-[#0756A5] group-hover:text-white flex items-center justify-center font-bold shadow-sm transition-colors duration-300">
                    <Compass size={28} />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#0756A5] px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
                    MISSION CHARTER
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                  Our Corporate Mission
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  To empower startups, mid-market businesses, and global enterprises with high-reliability software, web platforms, mobile apps, and autonomous AI systems that streamline operations, eliminate human error, and accelerate commercial growth.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200/60 space-y-2.5">
                {[
                  "Architect decoupled, maintainable code with zero technical debt",
                  "Automate repetitive manual operations with intelligent software",
                  "Deliver transparent bi-weekly milestones with zero scope creep",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 size={16} className="text-[#0756A5] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Corporate Vision Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="p-8 sm:p-10 rounded-3xl bg-[#F5F8FC] border border-gray-100 hover:border-orange-200 hover:shadow-cardHover transition-all duration-300 flex flex-col justify-between group space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-[#FF6900] group-hover:bg-[#FF6900] group-hover:text-white flex items-center justify-center font-bold shadow-sm transition-colors duration-300">
                    <Target size={28} />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FF6900] px-3 py-1 rounded-full bg-orange-50 border border-orange-100">
                    VISION 2030
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-[#082B59] group-hover:text-[#FF6900] transition-colors">
                  Our Long-Term Vision
                </h3>

                <p className="text-sm text-gray-600 leading-relaxed">
                  To be the most trusted technology engineering partner for organizations navigating digital transformation, recognized internationally for exceptional code craftsmanship, robust enterprise security, and measurable commercial return on investment.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200/60 space-y-2.5">
                {[
                  "Global standard for reliable enterprise full-stack engineering",
                  "Pioneering pragmatic AI and autonomous workflow integrations",
                  "Long-term client partnerships grounded in mutual commercial ROI",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-700">
                    <CheckCircle2 size={16} className="text-[#FF6900] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. CORE VALUES & GUIDING ETHOS (BALANCED 4-COLUMN GRID)
         ========================================================================= */}
      <section className="py-20 bg-[#F5F8FC]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#FF6900] text-xs font-bold uppercase tracking-wider">
              <span>Our Code of Conduct</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Our Guiding Principles & Core Values
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              The engineering ethos behind every line of code we write, every architecture we deploy, and every partnership we foster.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const IconComp = val.icon;
              return (
                <motion.div
                  key={val.number}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-cardHover hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${val.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                        <IconComp size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-[#0756A5] transition-colors">
                        Value {val.number}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                      {val.title}
                    </h4>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {val.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 mt-2 flex items-center gap-2 text-[11px] text-gray-500">
                    <Check size={14} className="text-[#FF6900] shrink-0" />
                    <span className="leading-tight">{val.feature}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 4-PILLAR ENGINEERING LIFECYCLE & QUALITY ASSURANCE
         ========================================================================= */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Predictable Delivery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Our Engineering Architecture Framework
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              From business modeling to high-availability cloud orchestration, we apply structured engineering rigor at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {engineeringFramework.map((framework, idx) => {
              const IconComp = framework.icon;
              return (
                <motion.div
                  key={framework.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-gray-100 bg-[#F5F8FC] p-6 space-y-3 relative hover:border-blue-300 transition-all hover:shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-blue-200 block font-mono">
                      {framework.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#0756A5] flex items-center justify-center font-bold">
                      <IconComp size={16} />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-[#082B59]">{framework.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{framework.desc}</p>
                </motion.div>
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
            {/* Background glowing flare */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6900]/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Commitment Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF8A00] text-xs font-bold uppercase tracking-wider">
                  <BarChart3 size={14} />
                  <span>The Vishwakarma Commercial Guarantee</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Transparent Partnerships Rooted in Engineering Accountability
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  When you partner with Vishwakarma Web Private Limited, you retain 100% intellectual property ownership, direct access to dedicated senior developers, and milestone deliverables verified against pre-agreed acceptance criteria.
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

              {/* Right Column: 4 Live Commercial Impact Metrics */}
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
            <span>Ready to Build Something Meaningful?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Let's Engineer Your Next Digital Milestone.
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
                Schedule Consultation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;