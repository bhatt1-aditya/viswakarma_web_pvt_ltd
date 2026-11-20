import React from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  MessageCircle,
} from "lucide-react";
import categoriesData from "../../data/categoriesData.json";

const CompanyFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services (All 108)", path: "/services" },
    { name: "Industries We Serve", path: "/industries" },
    { name: "Interactive Live Demos", path: "/live-demos" },
    { name: "Client Portfolio", path: "/portfolio" },
    { name: "Pricing & Calculator", path: "/pricing" },
    { name: "Request a Quote", path: "/quote" },
    { name: "Contact & Consultation", path: "/contact" },
    { name: "Client / Staff Portal", path: "/login" },
  ];

  return (
    <footer className="bg-[#071426] text-gray-300 pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0756A5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF6900]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* COLUMN 1: BRAND IDENTITY & SOCIALS (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src="/leadLogo.png"
                alt="Vishwakarma Web Private Limited Logo"
                className="h-12 w-auto object-contain brightness-110"
              />
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Vishwakarma Web Private Limited is a full-service IT and digital solutions engineering company. We architect, develop, and scale modern web platforms, mobile apps, enterprise ERPs, and AI automation systems.
            </p>

            <div className="space-y-3 pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                Connect With Us
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com/company/vishwakarmaweb"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#0756A5] text-white flex items-center justify-center transition-all duration-200"
                >
                  <Linkedin size={18} />
                </a>
                <a
                  href="https://twitter.com/vishwakarmaweb"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#0756A5] text-white flex items-center justify-center transition-all duration-200"
                >
                  <Twitter size={18} />
                </a>
                <a
                  href="https://facebook.com/vishwakarmaweb"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#0756A5] text-white flex items-center justify-center transition-all duration-200"
                >
                  <Facebook size={18} />
                </a>
                <a
                  href="https://instagram.com/vishwakarmaweb"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-[#FF6900] text-white flex items-center justify-center transition-all duration-200"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href="https://github.com/vishwakarmaweb"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="w-9 h-9 rounded-xl bg-white/5 hover:bg-gray-700 text-white flex items-center justify-center transition-all duration-200"
                >
                  <Github size={18} />
                </a>
                <a
                  href="https://wa.me/917008156600"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="w-9 h-9 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-400 hover:text-white flex items-center justify-center transition-all duration-200"
                >
                  <MessageCircle size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#FF6900] pl-2.5">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              {quickLinks.slice(0, 8).map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#FF8A00] transition-colors flex items-center gap-1.5 py-0.5"
                  >
                    <ArrowRight size={11} className="text-[#0756A5]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: 9 MAJOR SERVICE DOMAINS (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#0756A5] pl-2.5">
              Services Directory
            </h4>
            <ul className="space-y-2 text-xs">
              {categoriesData.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/services?category=${cat.slug}`}
                    className="text-gray-400 hover:text-[#0756A5] hover:text-white transition-colors flex items-center justify-between py-0.5 group"
                  >
                    <span className="line-clamp-1 group-hover:text-white transition-colors">{cat.name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">({cat.serviceCount})</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: CONTACT & OFFICIAL ADDRESS (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white border-l-2 border-[#FF6900] pl-2.5">
              Contact & Inquiries
            </h4>

            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#FF6900] shrink-0 mt-0.5" />
                <span>Tech Hub Tower, Sector 62, Noida, Uttar Pradesh 201301, India</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={15} className="text-[#0756A5] shrink-0" />
                <a href="tel:+917008156600" className="hover:text-white transition-colors font-medium">
                  +91 70775 60648
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={15} className="text-[#0756A5] shrink-0" />
                <a href="mailto:contact@vishwakarmaweb.com" className="hover:text-white transition-colors">
                  contact@vishwakarmaweb.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Clock size={15} className="text-gray-500 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM IST</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/917008156600"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all"
              >
                <MessageCircle size={14} />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT AND LEGAL LINKS */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>
            Copyright © {currentYear} <span className="text-gray-300 font-semibold">Vishwakarma Web Private Limited</span>. All rights reserved.
          </p>

          <div className="flex items-center flex-wrap gap-4 md:gap-6">
            <Link to="/privacy-policy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-gray-300 transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link to="/refund-policy" className="hover:text-gray-300 transition-colors">
              Refund Policy
            </Link>
            <span>•</span>
            <Link to="/services" className="hover:text-gray-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CompanyFooter;
