import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";

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
  },
];

const Portfolio = () => {
  const [projects, setProjects] = useState(defaultCaseStudies);
  const [filterCat, setFilterCat] = useState("all");

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
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
            <span>Engineering Track Record</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#082B59] leading-tight">
            Case Studies & Portfolio
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Examine our flagship technology projects engineered for reliability, security, and measurable commercial return.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {["all", "E-Commerce Solutions", "Custom Software & Enterprise Solutions", "Mobile Application Development", "AI, Machine Learning & Automation"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterCat === cat
                  ? "bg-[#0756A5] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                }`}
            >
              {cat === "all" ? "All Case Studies" : cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((proj, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-cardHover hover:border-blue-200 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#FF6900] bg-orange-50 px-2.5 py-0.5 rounded-full">
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

                {/* Key Deliverables */}
                <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs">
                  <span className="text-[10px] font-bold uppercase text-gray-400">Key Deliverables:</span>
                  {proj.deliverables?.slice(0, 2).map((d, didx) => (
                    <div key={didx} className="flex items-center gap-1.5 text-gray-700">
                      <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                      <span className="line-clamp-1">{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
                {proj.demoUrl && (
                  <Link
                    to={proj.demoUrl}
                    className="text-xs font-bold text-[#FF6900] hover:underline flex items-center gap-1"
                  >
                    <span>Try Interactive Demo</span>
                    <ExternalLink size={12} />
                  </Link>
                )}

                <Link
                  to={`/quote?project=${encodeURIComponent(proj.title)}`}
                  className="text-xs font-bold text-[#0756A5] hover:text-[#082B59]"
                >
                  Request Similar →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
