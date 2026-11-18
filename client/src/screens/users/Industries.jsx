import React from "react";
import { Link } from "react-router-dom";
import {
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
  ArrowRight,
} from "lucide-react";

const industries = [
  {
    title: "Healthcare & Telemedicine",
    icon: HeartPulse,
    challenge: "Fragmented electronic medical records, non-compliant patient communication channels, and inefficient doctor OPD scheduling.",
    solution: "HIPAA-aligned patient portals, encrypted WebRTC clinical consultations, and automated diagnostic lab report synchronization.",
    keyServices: ["Hospital & Clinic Management Software", "Healthcare & Telemedicine Mobile Apps"],
    demoRoute: "/live-demos/hospital-management",
  },
  {
    title: "Education & EdTech",
    icon: GraduationCap,
    challenge: "Disconnected student information systems, manual paper-based fee reconciliation, and low remote learning engagement.",
    solution: "Unified campus ERP suites, interactive video learning management systems (LMS), and automated grade report cards.",
    keyServices: ["School, College & Institute Management Systems", "EdTech & E-Learning Mobile Apps"],
    demoRoute: "/live-demos/school-management",
  },
  {
    title: "E-Commerce & Digital Retail",
    icon: ShoppingCart,
    challenge: "High cart abandonment, database locks during flash sales, and manual inventory updates across multiple marketplaces.",
    solution: "Decoupled headless storefronts, multi-vendor marketplace engines, and automated multi-warehouse dispatch pipelines.",
    keyServices: ["Custom E-Commerce Storefront Development", "Multi-Vendor Marketplace Development"],
    demoRoute: "/live-demos/ecommerce-store",
  },
  {
    title: "Real Estate & Infrastructure",
    icon: Building,
    challenge: "Slow broker lead follow-ups, static property photos failing to engage NRI buyers, and disjointed visit tracking.",
    solution: "Interactive property portals with virtual tours, mortgage calculators, and automated lead distribution to broker CRM.",
    keyServices: ["Real Estate & Property Management Portals", "Landing Page Design & Optimization"],
    demoRoute: "/live-demos/real-estate-portal",
  },
  {
    title: "Travel & Hospitality",
    icon: Compass,
    challenge: "Complex multi-day itinerary customizations, manual booking calculations, and fragmented reservation vouchers.",
    solution: "Real-time travel booking engines, dynamic group pricing matrices, and automated customer itinerary dispatch.",
    keyServices: ["Custom Web Portal Development (B2B/B2C)", "On-Demand Delivery & Booking Apps"],
    demoRoute: "/live-demos/travel-booking",
  },
  {
    title: "Finance & FinTech",
    icon: ShieldCheck,
    challenge: "Strict regulatory audit mandates, latency in payment gateway settlement, and security vulnerabilities.",
    solution: "PCI-compliant payment orchestration, automated GST invoicing engines, and real-time ledger reconciliation.",
    keyServices: ["Payment Gateway Integration (Razorpay, Stripe, UPI)", "Accounting, Billing & Invoicing Software"],
    demoRoute: "/live-demos/invoice-billing",
  },
  {
    title: "Logistics & Supply Chain",
    icon: Truck,
    challenge: "Lack of real-time consignment visibility, manual manifest paperwork, and warehouse inventory deadlocks.",
    solution: "Fleet tracking portals, barcode scan inventory tracking, and carrier API integration for instant consignment tracking.",
    keyServices: ["Supply Chain & Logistics Tracking Systems", "Inventory & Warehouse Management Software"],
    demoRoute: "/live-demos/inventory-management",
  },
  {
    title: "Industrial Manufacturing",
    icon: Layers,
    challenge: "Disparate shopfloor machine data, manual bill-of-materials tracking, and untracked raw material waste.",
    solution: "Centralized manufacturing ERP suites, real-time machine telemetry, and predictive procurement order generation.",
    keyServices: ["Custom Enterprise Resource Planning (ERP) Software", "Manufacturing & Production Management Software"],
    demoRoute: "/live-demos/erp-software",
  },
  {
    title: "Retail & B2B Wholesaling",
    icon: Store,
    challenge: "Handling bulk order volume tiers, manual GST quote requests, and fragmented offline billing registers.",
    solution: "Self-service B2B wholesale portals with tiered price locks, instant GST invoicing, and POS counter sync.",
    keyServices: ["B2B Wholesale E-Commerce Portals", "Wholesale, Import-Export & Trading ERP"],
    demoRoute: "/live-demos/multi-vendor-marketplace",
  },
  {
    title: "Fast-Growth Startups",
    icon: Zap,
    challenge: "High burn rates, slow development agencies missing MVP launch deadlines, and inability to pivot quickly.",
    solution: "Rapid agile prototyping, scalable cloud-native architectures, and dedicated full-stack engineering pods.",
    keyServices: ["SaaS Product Engineering", "Single-Page Application (SPA) Development"],
    demoRoute: "/live-demos/admin-dashboard",
  },
  {
    title: "Professional Corporate Services",
    icon: Briefcase,
    challenge: "Unstructured client file sharing over emails, manual contract tracking, and poor time logging visibility.",
    solution: "Secure self-service client vaults, document lifecycle automation, and integrated billable project management.",
    keyServices: ["Customer Relationship Management (CRM) Systems", "Human Resource Management System (HRMS)"],
    demoRoute: "/live-demos/crm-software",
  },
];

const Industries = () => {
  return (
    <div className="bg-[#F5F8FC] min-h-screen py-12 md:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-[#0756A5] text-xs font-bold uppercase tracking-wider">
            <span>Specialized Vertical Expertise</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#082B59] leading-tight">
            Industries We Serve
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            We deliver domain-specialized software architectures engineered to address the regulatory, operational, and customer challenges of 11 core industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((ind, idx) => {
            const IconComp = ind.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-cardHover hover:border-blue-200 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0756A5] group-hover:bg-[#0756A5] group-hover:text-white flex items-center justify-center transition-colors">
                    <IconComp size={24} />
                  </div>

                  <h3 className="text-lg font-bold text-[#082B59] group-hover:text-[#0756A5] transition-colors">
                    {ind.title}
                  </h3>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-red-600 uppercase text-[10px] block">
                        Industry Pain Point:
                      </span>
                      <p className="text-gray-600 mt-0.5 leading-relaxed">{ind.challenge}</p>
                    </div>

                    <div className="pt-2">
                      <span className="font-bold text-emerald-600 uppercase text-[10px] block">
                        Our Engineered Solution:
                      </span>
                      <p className="text-gray-700 font-medium mt-0.5 leading-relaxed">{ind.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
                  <Link
                    to={ind.demoRoute}
                    className="text-xs font-bold text-[#FF6900] hover:text-orange-600 flex items-center gap-1.5"
                  >
                    <span>Try Relevant Demo</span>
                    <ArrowRight size={13} />
                  </Link>

                  <Link
                    to={`/quote?service=${encodeURIComponent(ind.title)}`}
                    className="text-xs font-bold text-[#0756A5] hover:underline"
                  >
                    Consult Solutions
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

export default Industries;
