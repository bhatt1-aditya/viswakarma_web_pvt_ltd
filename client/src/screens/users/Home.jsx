import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Globe,
  FileCode,
  ShoppingCart,
  Smartphone,
  Cpu,
  Cloud,
  TrendingUp,
  Palette,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Server,
  ExternalLink,
  Zap,
  Users,
  Compass,
  Building,
  HeartPulse,
  GraduationCap,
  Truck,
  Briefcase,
  Store,
  Activity,
  BarChart3,
  Award,
  Lock,
  Clock,
  Check,
} from "lucide-react";
import categoriesData from "../../data/categoriesData.json";
import demosData from "../../data/demosData.json";
import API_BASE_URL from "../../utils/apiConfig";

const iconMap = {
  Globe: Globe,
  FileCode: FileCode,
  ShoppingCart: ShoppingCart,
  Smartphone: Smartphone,
  Layers: Layers,
  Cpu: Cpu,
  Cloud: Cloud,
  TrendingUp: TrendingUp,
  Palette: Palette,
};

const industryList = [
  { name: "Healthcare & Telemedicine", icon: HeartPulse, desc: "EMR systems, HIPAA-compliant patient portals, doctor scheduling engines." },
  { name: "Education & EdTech", icon: GraduationCap, desc: "Virtual classrooms, LMS engines, student SIS portals, campus ERPs." },
  { name: "E-Commerce & Retail", icon: ShoppingCart, desc: "Omnichannel marketplaces, headless commerce, automated stock synchronization." },
  { name: "Real Estate & Housing", icon: Building, desc: "Interactive property portals, virtual 3D tour booking, broker lead pipelines." },
  { name: "Travel & Hospitality", icon: Compass, desc: "Dynamic tour booking engines, reservation management, guest ticketing." },
  { name: "Finance & FinTech", icon: ShieldCheck, desc: "Digital payment gateways, billing reconciliation, automated invoicing." },
  { name: "Logistics & Supply Chain", icon: Truck, desc: "Fleet telemetry, multi-warehouse dispatching, barcode scanning software." },
  { name: "Industrial Manufacturing", icon: Layers, desc: "Shopfloor execution software, bill-of-materials management, machine telemetry." },
  { name: "Retail & Wholesaling", icon: Store, desc: "B2B wholesale trading portals, volume tiered pricing, POS systems." },
  { name: "Fast-Growth Startups", icon: Zap, desc: "Rapid MVP product engineering, scalable cloud architecture, fast iteration." },
  { name: "Professional Services", icon: Briefcase, desc: "Client self-service vaults, case management, billable hour tracking." },
  { name: "Custom Domain Verticals", icon: Layers, desc: "Bespoke digital architecture for specialized industries, government portals, and proprietary workflows." },
];

const developmentSteps = [
  { step: "01", title: "Discovery & Consultation", desc: "We study your business goals, target audience, technical constraints, and project scope." },
  { step: "02", title: "Requirement Analysis", desc: "Detailed technical architectural mapping, data schema design, and milestone roadmaps." },
  { step: "03", title: "UI/UX Design", desc: "Interactive Figma wireframes, clickable prototypes, and design system component libraries." },
  { step: "04", title: "Development", desc: "Clean modular frontend and backend coding adhering to enterprise security standards." },
  { step: "05", title: "Testing & QA", desc: "Rigorous functional testing, cross-device responsiveness, security audits, and load tests." },
  { step: "06", title: "Deployment", desc: "Zero-downtime cloud infrastructure deployment, SSL provisioning, and domain cutover." },
  { step: "07", title: "Maintenance & Support", desc: "Continuous SLA technical monitoring, daily backups, security patching, and ongoing updates." },
];

const coreStrategicPillars = [
  {
    number: "01",
    title: "Customized Solutions",
    desc: "Bespoke engineering tailored to your exact business workflows without bloated, rigid templates.",
    feature: "100% custom-crafted codebase built for your unique operational logic.",
    icon: Code2,
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    number: "02",
    title: "Modern Technology Stack",
    desc: "Built with React.js, Node.js, Next.js, Flutter, MongoDB, and AWS for peak speed and security.",
    feature: "Modern reactive frameworks ensuring lightning-fast load times.",
    icon: Zap,
    gradient: "from-[#FF6900] to-amber-500",
  },
  {
    number: "03",
    title: "Responsive Development",
    desc: "Flawless mobile-first user journeys designed to adapt seamlessly across smartphones, tablets, and desktops.",
    feature: "Pixel-perfect fluid layouts across all device viewports.",
    icon: Smartphone,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    number: "04",
    title: "Scalable Architecture",
    desc: "Microservices, decoupled frontends, and cloud databases ready to handle millions of transactions.",
    feature: "Engineered to scale effortlessly from 1,000 to 10M+ active users.",
    icon: Server,
    gradient: "from-cyan-500 to-blue-600",
  },
  {
    number: "05",
    title: "Security-Focused Development",
    desc: "Enterprise data encryption, role-based access control, CSRF protection, and OWASP compliance.",
    feature: "Zero-trust security architecture protecting critical corporate data.",
    icon: ShieldCheck,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    number: "06",
    title: "Ongoing Technical Support",
    desc: "Reliable post-launch warranty, 24/7 uptime monitoring, and dedicated developer maintenance retainers.",
    feature: "Guaranteed SLA response times with proactive cloud monitoring.",
    icon: Users,
    gradient: "from-[#FF8A00] to-orange-600",
  },
];

const headlinePhrases = [
  "Powerful Digital Experiences.",
  "Scalable Cloud Architecture.",
  "Intelligent AI & Automation.",
  "High-Performance Mobile Apps.",
  "Enterprise Custom Software.",
];

const Home = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchHomeContent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/settings/home`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.homeContent) {
            setHomeData(data.homeContent);
          }
        }
      } catch (e) {
        // Fallback gracefully to default constants
      }
    };
    fetchHomeContent();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeHeadlinePhrases =
    homeData?.heroHeadlines && homeData.heroHeadlines.length > 0
      ? homeData.heroHeadlines
      : headlinePhrases;

  // Typewriter effect state
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const phraseCount = activeHeadlinePhrases.length;
    const currentPhrase = activeHeadlinePhrases[phraseIndex % phraseCount] || activeHeadlinePhrases[0];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
        if (displayText.length <= 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phraseCount);
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
  }, [displayText, isDeleting, phraseIndex, activeHeadlinePhrases]);

  return (
    <div className="overflow-hidden">
      {/* =========================================================================
          A. HERO SECTION
         ========================================================================= */}
      <section className="relative bg-gradient-to-b from-[#071426] via-[#082B59] to-[#071426] text-white pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        {/* Animated Background Mesh & Glows */}
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
                <span>{homeData?.heroBadge || "Enterprise IT & Digital Solutions Partner"}</span>
              </div>

              {/* Animated Typewriter Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white min-h-[3.6em] sm:min-h-[2.4em] flex flex-col justify-center">
                <span>{homeData?.heroTitlePrefix || "Transforming Ideas Into"}</span>{" "}
                <span className="block mt-1">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6900] via-[#FF8A00] to-amber-300">
                    {displayText}
                  </span>
                  <span className="inline-block w-1 h-8 sm:h-10 md:h-12 bg-[#FF6900] ml-1.5 animate-pulse align-middle" />
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {homeData?.heroSubtitle ||
                  "Vishwakarma Web Private Limited delivers innovative software, web, mobile, AI, and digital solutions that help businesses grow, automate operations, and succeed in the digital world."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={homeData?.heroPrimaryBtnLink || "/services"}
                    className="px-6 py-3.5 rounded-xl bg-[#0756A5] text-white font-bold text-sm tracking-wide hover:bg-blue-600 transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2"
                  >
                    <span>{homeData?.heroPrimaryBtnText || "Explore Our Services"}</span>
                    <ArrowRight size={16} />
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/live-demos"
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm tracking-wide hover:shadow-glowOrange transition-all shadow-lg shadow-orange-900/40 flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Explore Live Demos</span>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to={homeData?.heroSecondaryBtnLink || "/quote"}
                    className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide border border-white/20 transition-all backdrop-blur-md block"
                  >
                    {homeData?.heroSecondaryBtnText || "Start Your Project"}
                  </Link>
                </motion.div>
              </div>

              {/* Feature Highlights Pills */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-white">108</p>
                  <p className="text-xs text-gray-400">Services Catalog</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-[#FF8A00]">20</p>
                  <p className="text-xs text-gray-400">Interactive Live Demos</p>
                </div>
                <div>
                  <p className="text-xl md:text-2xl font-extrabold text-blue-400">9</p>
                  <p className="text-xs text-gray-400">Core Technology Domains</p>
                </div>
              </div>
            </motion.div>

            {/* Right Visual Column: Floating 3D Animated Terminal */}
            <div className="lg:col-span-5 relative flex justify-center">
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative w-full max-w-md lg:max-w-none"
              >
                {/* Main Card */}
                <div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 p-1 border border-white/20 shadow-2xl backdrop-blur-xl">
                  <div className="rounded-xl bg-[#082B59]/90 p-5 space-y-4">
                    {/* Window Controls & Live System Badge */}
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
                          LIVE ENGINE
                        </span>
                      </div>
                    </div>

                    {/* Code Snippet Box */}
                    <div className="bg-[#071426] rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 border border-white/5 shadow-inner">
                      <p className="text-blue-400">{"// Vishwakarma Digital Architecture"}</p>
                      <p>
                        <span className="text-purple-400">const</span>{" "}
                        <span className="text-amber-300">enterprisePlatform</span> ={" "}
                        <span className="text-purple-400">await</span> Vishwakarma.
                        <span className="text-blue-300">architect</span>({`{`}
                      </p>
                      <p className="pl-4">
                        stack: [<span className="text-emerald-400">"React"</span>,{" "}
                        <span className="text-emerald-400">"Node.js"</span>,{" "}
                        <span className="text-emerald-400">"AI"</span>],
                      </p>
                      <p className="pl-4">
                        security: <span className="text-[#FF8A00]">"Enterprise-Grade"</span>,
                      </p>
                      <p className="pl-4">
                        performance: <span className="text-emerald-400">"Core Web Vitals 99+"</span>
                      </p>
                      <p>{`});`}</p>
                    </div>

                    {/* Live Metric Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Architecture</p>
                          <p className="text-xs font-bold text-white">Full-Stack Scalable</p>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-[#FF8A00] flex items-center justify-center font-bold">
                          <Zap size={18} />
                        </div>
                        <div>
                          <p className="text-[11px] text-gray-400">Turnaround</p>
                          <p className="text-xs font-bold text-white">Agile Sprints</p>
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
                  <Cpu size={16} />
                  <span>AI & Automation Ready</span>
                </motion.div>

                {/* Floating Badge 2 (Bottom Left) */}
                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-6 -left-4 bg-[#0756A5] text-white p-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2.5 text-xs font-bold"
                >
                  <ShieldCheck size={16} className="text-emerald-300" />
                  <span>24/7 Monitored Systems</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          B. COMPANY TRUST SECTION
         ========================================================================= */}
      <section className="bg-white py-8 border-b border-gray-100 shadow-sm relative z-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-6">
            Core Enterprise Engineering Capabilities
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
            {[
              { name: "Web Development", icon: Globe, color: "text-[#0756A5]" },
              { name: "Mobile Applications", icon: Smartphone, color: "text-[#FF6900]" },
              { name: "Custom Software", icon: Layers, color: "text-[#0756A5]" },
              { name: "AI & Automation", icon: Cpu, color: "text-[#FF8A00]" },
              { name: "Cloud Solutions", icon: Cloud, color: "text-[#0756A5]" },
              { name: "Digital Growth", icon: TrendingUp, color: "text-[#FF6900]" },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="flex items-center justify-center gap-2.5 p-3 rounded-xl bg-[#F5F8FC] border border-gray-100 hover:border-blue-200 transition-all hover:shadow-sm group cursor-pointer"
                  onClick={() => navigate("/services")}
                >
                  <IconComp size={18} className={`${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-bold text-gray-700 group-hover:text-[#082B59]">
                    {item.name}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          C. ABOUT US PREVIEW
         ========================================================================= */}
      <section className="py-20 bg-[#F5F8FC]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
                <span>Who We Are</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59] leading-tight">
                Your Technology & Digital Solutions Partner for the Modern Era.
              </h2>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Vishwakarma Web Private Limited is a specialized IT services and product engineering firm. We bridge the gap between complex software engineering and strategic business growth.
              </p>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                Whether you are an ambitious startup needing an MVP built from scratch, a growing mid-market business modernizing legacy spreadsheets, or an enterprise streamlining cross-departmental operations, our multi-disciplinary team delivers scalable, reliable software.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-blue-200 transition-all">
                  <h4 className="text-base font-bold text-[#0756A5]">Startup to Enterprise</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Flexible agile delivery frameworks adapted to your corporate size and speed.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:border-orange-200 transition-all">
                  <h4 className="text-base font-bold text-[#FF6900]">100% IP Ownership</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Complete source code, database architectures, and design files transferred to you.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0756A5] hover:text-[#FF6900] transition-colors"
                >
                  <span>Learn more about our methodology and vision</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6"
            >
              <div className="relative">
                <div className="rounded-3xl bg-gradient-to-tr from-[#082B59] to-[#0756A5] p-8 text-white shadow-2xl relative z-10 space-y-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#FF8A00]">
                    <ShieldCheck size={32} />
                  </div>

                  <h3 className="text-2xl font-bold">Engineering Quality at Every Step</h3>

                  <p className="text-sm text-gray-200 leading-relaxed">
                    We adhere strictly to clean code practices, modular architectures, and robust security protocols. Every project undergoes automated testing, code review, and performance benchmarking before deployment.
                  </p>

                  <ul className="space-y-3 pt-2 text-sm text-gray-200">
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FF8A00]" />
                      <span>Dedicated Senior Full-Stack Engineers & Architects</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FF8A00]" />
                      <span>Transparent Sprint Tracking & Bi-Weekly Milestone Demos</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-[#FF8A00]" />
                      <span>Comprehensive SLA Technical Support and Cloud Monitoring</span>
                    </li>
                  </ul>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Headquarters</p>
                      <p className="text-sm font-semibold text-white">Noida, Uttar Pradesh, India</p>
                    </div>
                    <Link
                      to="/contact"
                      className="text-xs font-bold px-4 py-2 rounded-xl bg-[#FF6900] text-white hover:bg-orange-600 transition-colors"
                    >
                      Connect Today
                    </Link>
                  </div>
                </div>

                {/* Decorative border box behind */}
                <div className="absolute -bottom-4 -right-4 w-full h-full rounded-3xl border-2 border-[#FF6900]/30 -z-0" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          D. SERVICES OVERVIEW (ALL 9 DOMAINS)
         ========================================================================= */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/80 text-[#FF6900] text-xs font-bold uppercase tracking-wider">
              <span>Comprehensive Capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              9 Core Service Domains • All 108 Services
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Explore our full directory of 108 specialized IT services designed to support every phase of your company's digital journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoriesData.map((cat, idx) => {
              const IconComp = iconMap[cat.icon] || Layers;
              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-gray-100 bg-[#F5F8FC] p-6 hover:bg-white hover:shadow-cardHover hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white group-hover:bg-[#0756A5] text-[#0756A5] group-hover:text-white flex items-center justify-center shadow-sm transition-colors duration-300">
                        <IconComp size={24} />
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100/70 text-[#0756A5]">
                        {cat.serviceCount} Services
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-200/60 mt-6 flex items-center justify-between">
                    <Link
                      to={`/services?category=${cat.slug}`}
                      className="text-xs font-bold text-[#0756A5] group-hover:text-[#FF6900] flex items-center gap-1.5 transition-colors"
                    >
                      <span>Explore Services</span>
                      <ArrowRight size={14} />
                    </Link>

                    <span className="text-[11px] text-gray-400 font-mono">0{idx + 1}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#082B59] text-white text-sm font-bold hover:bg-[#0756A5] transition-all shadow-md hover:scale-[1.02]"
            >
              <span>View The Complete Directory (All 108 Services)</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          E. WHY CHOOSE US / OUR STRATEGIC ADVANTAGE
          Balanced 3x2 Grid (Pillars 1-6) + Full-Width Feature Spotlight Banner (Pillar 7)
          Eliminating Any Asymmetrical Gaps Across All Devices
         ========================================================================= */}
      <section className="py-20 bg-[#071426] text-white relative overflow-hidden">
        {/* Ambient Glowing Orbs */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-[#0756A5]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#FF6900]/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#FF8A00] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles size={14} />
              <span>{homeData?.strategicAdvantageTag || "Our Strategic Advantage"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {homeData?.strategicAdvantageTitle || "Why Forward-Thinking Businesses Choose Vishwakarma Web"}
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              {homeData?.strategicAdvantageSubtitle ||
                "We eliminate technical friction and build high-performance software engineered for lasting commercial resilience."}
            </p>
          </div>

          {/* Balanced 3-Column Grid for Pillars 01 to 06 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(homeData?.strategicPillars && homeData.strategicPillars.length > 0
              ? homeData.strategicPillars
              : coreStrategicPillars
            ).map((point, idx) => {
              const defaultPillar = coreStrategicPillars[idx] || coreStrategicPillars[0];
              const IconComp = defaultPillar.icon || Code2;
              const gradientClass = defaultPillar.gradient || "from-blue-600 to-cyan-500";
              return (
                <motion.div
                  key={point.number || idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl bg-white/[0.04] border border-white/10 p-6 hover:bg-white/[0.08] hover:border-[#FF6900]/50 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden backdrop-blur-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientClass} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                        <IconComp size={22} />
                      </div>
                      <span className="text-xs font-mono font-bold text-gray-400 group-hover:text-[#FF8A00] transition-colors">
                        Pillar {point.number || `0${idx + 1}`}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#FF8A00] transition-colors">
                        {point.title}
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed mt-2">
                        {point.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 mt-4 flex items-center gap-2 text-xs text-gray-400 group-hover:text-gray-200">
                    <Check size={14} className="text-[#FF8A00] shrink-0" />
                    <span className="text-[11px] leading-tight">{point.feature}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* =========================================================================
              FEATURED STRATEGIC PILLAR 07: BUSINESS-ORIENTED ROI BANNER
              Spans 100% width, balancing the layout with zero empty gaps
             ========================================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 rounded-3xl bg-gradient-to-br from-[#082B59]/95 via-[#0756A5]/80 to-[#071426] border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            {/* Background glowing flare */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6900]/15 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Pillar Details */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#FF8A00] text-xs font-bold uppercase tracking-wider">
                  <BarChart3 size={14} />
                  <span>Strategic Advantage 07 • Commercial Focus</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  {homeData?.strategicBannerTitle ||
                    "Business-Oriented Approach: Technology Engineered for Measurable Commercial ROI"}
                </h3>

                <p className="text-sm text-gray-300 leading-relaxed">
                  {homeData?.strategicBannerDesc ||
                    "We eliminate technical friction and vanity metrics. Every line of code, cloud architectural decision, and database schema is directly benchmarked against conversion rates, user retention, operational cost reduction, and bottom-line revenue."}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to="/contact"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-md"
                  >
                    Schedule Architecture Consultation
                  </Link>

                  <Link
                    to="/quote"
                    className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md"
                  >
                    Calculate Project Estimate
                  </Link>
                </div>
              </div>

              {/* Right Column: 4 Live Commercial Impact Metrics */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Activity size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">
                      {homeData?.slaUptime || "99.99%"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Architecture SLA</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Mission-critical uptime & high-availability cloud configurations.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Clock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">
                      {homeData?.slaTurnaround || "40% Faster"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Sprint Velocity</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Agile milestones shipping production modules every 2 weeks.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-cyan-400">
                    <Award size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">
                      {homeData?.slaEscrow || "100% IP"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Full Ownership</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Complete source code, database architectures, and design files handed over.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md space-y-1.5">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Lock size={18} />
                    <span className="text-xl sm:text-2xl font-extrabold text-white">
                      {homeData?.slaSecurity || "Zero-Trust"}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-[#FF8A00]">Security Standard</p>
                  <p className="text-[11px] text-gray-300 leading-tight">
                    Bank-grade data encryption, RBAC, and automated OWASP audits.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* =========================================================================
          F. LIVE DEMO PREVIEW
         ========================================================================= */}
      <section className="py-20 bg-[#F5F8FC]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#FF6900] text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>Functional Demonstration Center</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
                Experience Our Work Before You Hire Us.
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Interact with live, working software modules right in your browser. From full ERP workflows and CRM pipelines to AI chatbots and retail stores.
              </p>
            </div>

            <Link
              to="/live-demos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6900] text-white font-bold text-xs uppercase tracking-wider hover:bg-orange-600 transition-colors shadow-md self-start md:self-auto shrink-0"
            >
              <span>Explore All 20 Demos</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demosData.slice(0, 8).map((demo, idx) => (
              <motion.div
                key={demo.demoId}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-cardHover hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-[#FF6900] uppercase tracking-wider">
                      Demo #{demo.demoNumber}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live Demo
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors line-clamp-1">
                    {demo.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {demo.description}
                  </p>

                  <div className="space-y-1 pt-1">
                    {demo.features?.slice(0, 2).map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4">
                  <Link
                    to={demo.route}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-50 text-[#0756A5] hover:bg-[#0756A5] hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Launch Live Demo</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          G. DEVELOPMENT PROCESS (7 STEPS + CTA CARD = BALANCED 4x2 GRID)
         ========================================================================= */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
              <span>Our Engineering Lifecycle</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              The 7-Step Development Process
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Predictable, milestone-driven development ensuring strict quality control from first consultation through global cloud deployment.
            </p>
          </div>

          {/* Balanced 4-column layout: Row 1 (Steps 01-04), Row 2 (Steps 05-07 + Project Kickoff Card) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {developmentSteps.slice(0, 4).map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-gray-100 bg-[#F5F8FC] p-6 space-y-3 relative hover:border-blue-300 transition-all hover:shadow-sm"
              >
                <span className="text-3xl font-extrabold text-blue-200 block font-mono">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-[#082B59]">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}

            {developmentSteps.slice(4).map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (idx + 4) * 0.08 }}
                whileHover={{ y: -4 }}
                className="rounded-2xl border border-gray-100 bg-[#F5F8FC] p-6 space-y-3 relative hover:border-orange-300 transition-all hover:shadow-sm"
              >
                <span className="text-3xl font-extrabold text-orange-200 block font-mono">
                  {step.step}
                </span>
                <h3 className="text-base font-bold text-[#082B59]">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}

            {/* 8th Balanced Grid Card: Launch Project CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl bg-gradient-to-br from-[#082B59] to-[#0756A5] text-white p-6 space-y-3 relative flex flex-col justify-between shadow-md"
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF8A00] block mb-1">
                  Ready to Build?
                </span>
                <h3 className="text-base font-bold text-white">Start Your Custom Sprint</h3>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">
                  Get a detailed technical roadmap, resource estimation, and timeline within 24 hours.
                </p>
              </div>
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF6900] text-white hover:bg-orange-600 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                <span>Request Project Scope</span>
                <ArrowRight size={14} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          H. INDUSTRIES WE SERVE (12 BALANCED ITEMS = PERFECT 4x3 GRID)
         ========================================================================= */}
      <section className="py-20 bg-[#F5F8FC] border-t border-gray-100">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#FF6900] text-xs font-bold uppercase tracking-wider">
              <span>Domain Specialization</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#082B59]">
              Industries We Serve
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We engineer specialized digital infrastructure across 12 key vertical markets, addressing unique industry compliance and workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {industryList.map((ind, idx) => {
              const IconComp = ind.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-cardHover hover:border-blue-300 transition-all duration-300 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                    <IconComp size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-[#082B59]">{ind.name}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{ind.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0756A5] hover:text-[#FF6900] transition-colors"
            >
              <span>Explore deep industry use cases & software architectures</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          I. FINAL CTA
         ========================================================================= */}
      <section className="py-20 bg-gradient-to-r from-[#0756A5] via-[#082B59] to-[#071426] text-white relative overflow-hidden">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#FF8A00] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles size={14} />
            <span>Ready to Elevate Your Technology?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            {homeData?.ctaHeadline || "Have an Idea? Let's Build Something Powerful."}
          </h2>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {homeData?.ctaSubtitle ||
              "Partner with Vishwakarma Web Private Limited to architect custom software, web platforms, and mobile applications built for scale and commercial success."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={homeData?.ctaPrimaryBtnLink || "/quote"}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-sm uppercase tracking-wider hover:shadow-glowOrange transition-all shadow-lg block"
              >
                {homeData?.ctaPrimaryBtnText || "Request a Free Quote"}
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              {homeData?.ctaWhatsappNumber ? (
                <a
                  href={`https://wa.me/${homeData.ctaWhatsappNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md block"
                >
                  {homeData?.ctaSecondaryBtnText || "Contact Our Team"}
                </a>
              ) : (
                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-wider border border-white/20 transition-all backdrop-blur-md block"
                >
                  {homeData?.ctaSecondaryBtnText || "Contact Our Team"}
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;