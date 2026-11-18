import React, { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
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
} from "lucide-react";
import allServicesData from "../../data/all108Services.json";
import categoriesData from "../../data/categoriesData.json";

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

const ServicesDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === "all") {
      searchParams.delete("category");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: slug });
    }
  };

  const filteredServices = useMemo(() => {
    return allServicesData.filter((service) => {
      const matchesCategory =
        selectedCategory === "all" || service.categorySlug === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.shortDescription.toLowerCase().includes(query) ||
        service.categoryName.toLowerCase().includes(query) ||
        service.techStack?.some((tech) => tech.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
            <span>Complete Engineering Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#082B59] leading-tight">
            All 108 Digital & IT Services
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Browse our full catalog across 9 specialized technology categories. Every service is delivered with enterprise rigor, dedicated milestones, and full IP ownership.
          </p>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="rounded-2xl bg-white border border-gray-200/80 p-5 shadow-sm space-y-5">
          {/* Search Input Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search services by keyword, tech stack (e.g. React, ERP, AI, Flutter)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#0756A5] focus:outline-none text-sm transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>

          {/* 9 Category Filter Pills */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Filter size={13} />
                Filter by Category
              </span>
              <span className="text-xs font-semibold text-[#0756A5]">
                Showing {filteredServices.length} of 108 Services
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${selectedCategory === "all"
                    ? "bg-[#082B59] text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                All Categories (108)
              </button>

              {categoriesData.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                const CatIcon = iconMap[cat.icon] || Globe;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryChange(cat.slug)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${isSelected
                        ? "bg-[#0756A5] text-white shadow-md shadow-blue-500/20"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    <CatIcon size={14} className={isSelected ? "text-amber-300" : "text-gray-500"} />
                    <span>{cat.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                    >
                      {cat.serviceCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SERVICES CARDS GRID */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 p-8">
            <Layers size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-bold text-gray-700">No Services Found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your search query or reset category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                handleCategoryChange("all");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#0756A5] text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.idNumber}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-cardHover hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Card Header: Service ID + Category Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-extrabold text-[#0756A5] bg-blue-50 px-2.5 py-1 rounded-md">
                      #{String(service.idNumber).padStart(3, "0")}
                    </span>

                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full line-clamp-1 max-w-[190px]">
                      {service.categoryName}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors leading-snug">
                    <Link to={`/services/${service.categorySlug}/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Tech Stack Pills */}
                  {service.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {service.techStack.slice(0, 3).map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-50 text-gray-600 border border-gray-100"
                        >
                          {tech}
                        </span>
                      ))}
                      {service.techStack.length > 3 && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-50 text-gray-400">
                          +{service.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Mapped Live Demo Link */}
                  {service.demoSlug && (
                    <div className="pt-1">
                      <Link
                        to={`/live-demos/${service.demoSlug}`}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#FF6900] hover:text-orange-600 transition-colors"
                      >
                        <Sparkles size={12} />
                        <span>Interactive Demo: {service.demoSlug}</span>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-5 border-t border-gray-100 mt-5 flex items-center justify-between gap-3">
                  <Link
                    to={`/services/${service.categorySlug}/${service.slug}`}
                    className="text-xs font-bold text-[#0756A5] hover:text-[#082B59] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Service Details</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    to={`/quote?service=${encodeURIComponent(service.title)}`}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-[#FF6900]/10 text-[#FF6900] hover:bg-[#FF6900] hover:text-white transition-colors"
                  >
                    Request Quote
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesDirectory;
