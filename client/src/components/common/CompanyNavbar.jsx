import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Mail,
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

const CompanyNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]?.slug || "website-design-development");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services", hasMegaMenu: true },
    { name: "Industries", path: "/industries" },
    { name: "Live Demos", path: "/live-demos", badge: "20 Demos" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <>
      {/* TOP NOTIFICATION & CONTACT BAR */}
      <div className="bg-[#082B59] text-white/90 text-xs py-2.5 border-b border-white/10 hidden sm:block">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a
              href="tel:+917008156600"
              className="flex items-center gap-1.5 hover:text-[#FF6900] transition-colors"
            >
              <Phone size={13} className="text-[#FF6900]" />
              <span>+91 70775 60648</span>
            </a>
            <a
              href="mailto:vishwakarmawebprivatelimited@gmail.com"
              className="flex items-center gap-1.5 hover:text-[#FF6900] transition-colors"
            >
              <Mail size={13} className="text-[#FF6900]" />
              <span>vishwakarmawebprivatelimited@gmail.com</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white/60">Mon - Sat: 9:00 AM - 7:00 PM IST</span>
            <span className="text-white/30">|</span>
            <Link
              to="/quote"
              className="text-[#FF8A00] font-semibold hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Instant Project Estimator</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* MAIN STICKY NAVBAR */}
      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-gray-100"
          : "bg-white py-4 border-b border-gray-100"
          }`}
      >
        <div className="mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* BRAND LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/leadLogo.png"
              alt="Vishwakarma Web Private Limited Logo"
              className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* DESKTOP NAVIGATION MENU */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;

              if (link.hasMegaMenu) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => navigate("/services")}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${location.pathname.startsWith("/services")
                        ? "text-[#0756A5] bg-blue-50/60"
                        : "text-gray-700 hover:text-[#0756A5] hover:bg-gray-50"
                        }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${servicesDropdownOpen ? "rotate-180 text-[#0756A5]" : ""
                          }`}
                      />
                    </button>

                    {/* SERVICES MEGA MENU */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full -left-20 w-[780px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 pt-5 grid grid-cols-12 gap-6 animate-fade-in z-50">
                        {/* Categories List (Left) */}
                        <div className="col-span-5 border-r border-gray-100 pr-4 space-y-1">
                          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              9 Service Domains
                            </span>
                            <Link
                              to="/services"
                              className="text-xs font-bold text-[#0756A5] hover:text-[#FF6900]"
                            >
                              All 108 Services →
                            </Link>
                          </div>

                          {categoriesData.map((cat) => {
                            const IconComponent = iconMap[cat.icon] || Layers;
                            const isCurrent = activeCategory === cat.slug;
                            return (
                              <div
                                key={cat.slug}
                                onMouseEnter={() => setActiveCategory(cat.slug)}
                                onClick={() => navigate(`/services?category=${cat.slug}`)}
                                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${isCurrent
                                  ? "bg-[#0756A5] text-white shadow-md shadow-blue-500/20"
                                  : "text-gray-700 hover:bg-blue-50/60 hover:text-[#0756A5]"
                                  }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <IconComponent
                                    size={16}
                                    className={isCurrent ? "text-[#FF8A00]" : "text-[#0756A5]"}
                                  />
                                  <span className="text-xs font-semibold leading-tight line-clamp-1">
                                    {cat.name}
                                  </span>
                                </div>
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${isCurrent ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                  {cat.serviceCount}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Category Detail Preview (Right) */}
                        <div className="col-span-7 flex flex-col justify-between pl-2">
                          {(() => {
                            const cat = categoriesData.find((c) => c.slug === activeCategory) || categoriesData[0];
                            const IconComponent = iconMap[cat.icon] || Layers;
                            return (
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center font-bold">
                                    <IconComponent size={20} />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-[#082B59]">{cat.name}</h4>
                                    <p className="text-xs text-gray-400">
                                      {cat.serviceCount} Enterprise Services Available
                                    </p>
                                  </div>
                                </div>

                                <p className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                                  {cat.description}
                                </p>

                                <div className="space-y-2">
                                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                    Popular Offerings in this Domain:
                                  </p>
                                  <div className="grid grid-cols-1 gap-1.5">
                                    <Link
                                      to={`/services?category=${cat.slug}`}
                                      className="text-xs text-gray-700 hover:text-[#0756A5] hover:underline flex items-center gap-1.5 font-medium"
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
                                      Explore complete service catalog ({cat.serviceCount} modules)
                                    </Link>
                                    <Link
                                      to="/live-demos"
                                      className="text-xs text-[#0756A5] hover:text-[#FF6900] flex items-center gap-1.5 font-medium"
                                    >
                                      <Sparkles size={12} className="text-[#FF6900]" />
                                      Experience mapped interactive software demos
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-medium">Ready to get started?</span>
                            <Link
                              to="/quote"
                              className="text-xs font-bold px-4 py-2 rounded-lg bg-[#FF6900] text-white hover:bg-orange-600 transition-colors shadow-sm"
                            >
                              Get Detailed Quotation →
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${isActive
                    ? "text-[#0756A5] bg-blue-50/60 font-bold"
                    : "text-gray-700 hover:text-[#0756A5] hover:bg-gray-50"
                    }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-orange-100 text-[#FF6900]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* DESKTOP CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/quote"
              className="text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border border-[#0756A5] text-[#0756A5] hover:bg-[#0756A5] hover:text-white transition-all duration-200"
            >
              Get Free Quote
            </Link>
            <Link
              to="/contact"
              className="text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white hover:shadow-glowOrange hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-md shadow-orange-500/20"
            >
              Book Consultation
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-200 px-6 py-5 max-h-[85vh] overflow-y-auto animate-fade-in shadow-xl">
            <div className="space-y-1 pb-4 border-b border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2.5 px-3 rounded-xl text-base font-medium ${location.pathname === link.path
                    ? "bg-blue-50 text-[#0756A5] font-bold"
                    : "text-gray-800 hover:bg-gray-50"
                    }`}
                >
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6900]">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Quick 9 Categories in Mobile */}
            <div className="py-4 border-b border-gray-100">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                Service Categories (108 Services)
              </span>
              <div className="grid grid-cols-1 gap-1">
                {categoriesData.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/services?category=${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xs py-1.5 px-2 rounded-lg text-gray-600 hover:text-[#0756A5] hover:bg-gray-50 flex items-center justify-between"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">({cat.serviceCount})</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Contact & CTAs */}
            <div className="pt-4 space-y-3">
              <Link
                to="/quote"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-3 rounded-xl bg-gradient-to-r from-[#0756A5] to-[#082B59] text-white text-sm font-bold uppercase tracking-wider shadow-md"
              >
                Request a Free Quote
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-3 rounded-xl bg-[#FF6900] text-white text-sm font-bold uppercase tracking-wider shadow-md"
              >
                Book a Consultation
              </Link>

              <div className="pt-2 text-center text-xs text-gray-500">
                Call Us: <a href="tel:+917008156600" className="font-semibold text-gray-800">+91 70775 60648</a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default CompanyNavbar;
