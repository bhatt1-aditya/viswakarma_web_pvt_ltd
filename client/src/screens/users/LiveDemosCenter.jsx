import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Search,
  ExternalLink,
  Layers,
  Globe,
  ShoppingCart,
  Store,
  Users,
  UserCheck,
  GraduationCap,
  HeartPulse,
  Utensils,
  Building,
  Compass,
  Bot,
  BarChart3,
  Package,
  Receipt,
  ShieldCheck,
  Smartphone,
  Target,
  PenTool,
  Workflow,
  CheckCircle2,
} from "lucide-react";
import demosData from "../../data/demosData.json";

const demoIcons = {
  "corporate-website": Globe,
  "ecommerce-store": ShoppingCart,
  "multi-vendor-marketplace": Store,
  "crm-software": Users,
  "erp-software": Layers,
  "hrms-software": UserCheck,
  "school-management": GraduationCap,
  "hospital-management": HeartPulse,
  "restaurant-management": Utensils,
  "real-estate-portal": Building,
  "travel-booking": Compass,
  "ai-chatbot": Bot,
  "analytics-dashboard": BarChart3,
  "inventory-management": Package,
  "invoice-billing": Receipt,
  "admin-dashboard": ShieldCheck,
  "mobile-app": Smartphone,
  "landing-page": Target,
  "cms-blog": PenTool,
  "automation-workflow": Workflow,
};

const LiveDemosCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(demosData.map((d) => d.category));
    return ["all", ...Array.from(set)];
  }, []);

  const filteredDemos = useMemo(() => {
    return demosData.filter((demo) => {
      const matchesCategory =
        selectedCategory === "all" || demo.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        demo.title.toLowerCase().includes(query) ||
        demo.description.toLowerCase().includes(query) ||
        demo.category.toLowerCase().includes(query) ||
        demo.features.some((f) => f.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HERO SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-[#FF6900] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Interactive Software Experience</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#082B59] leading-tight">
            Don't Just Take Our Word for It. Experience It.
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Explore 20 interactive demonstrations of our software, applications, business systems, and digital solutions. Test features, simulate workflows, and experience the build quality before project kickoff.
          </p>
        </div>

        {/* SEARCH & CATEGORY FILTERS */}
        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-sm space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search demos (e.g. ERP, CRM, Hospital, E-Commerce, Chatbot, Mobile)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === cat
                    ? "bg-[#0756A5] text-white shadow-md shadow-blue-500/20"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {cat === "all" ? "All Demos (20)" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* DEMOS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDemos.map((demo) => {
            const IconComponent = demoIcons[demo.demoId] || Layers;
            return (
              <div
                key={demo.demoId}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-cardHover hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A5] group-hover:bg-[#FF6900] group-hover:text-white flex items-center justify-center transition-colors">
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono font-bold text-[#FF6900] uppercase block">
                          Demo #{String(demo.demoNumber).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {demo.category}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                      Live
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                    {demo.title}
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">
                    {demo.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Interactive Features:
                    </p>
                    {demo.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between gap-3">
                  <Link
                    to={demo.route}
                    className="w-full py-3 px-4 rounded-xl bg-[#0756A5] hover:bg-[#082B59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <span>Launch Live Interactive Demo</span>
                    <ExternalLink size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveDemosCenter;
