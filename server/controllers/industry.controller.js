import Industry from "../models/industry.model.js";

const isUserAdmin = (user) => {
  if (!user) return false;
  const roleName = (
    user.role?.name ||
    (typeof user.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  return ["admin", "superadmin"].includes(roleName);
};

export const defaultIndustries = [
  {
    title: "Healthcare & Telemedicine",
    slug: "healthcare-telemedicine",
    icon: "HeartPulse",
    challenge: "Fragmented electronic medical records, non-compliant patient communication channels, and inefficient doctor OPD scheduling.",
    solution: "HIPAA-aligned patient portals, encrypted WebRTC clinical consultations, and automated diagnostic lab report synchronization.",
    keyServices: ["Hospital & Clinic Management Software", "Healthcare & Telemedicine Mobile Apps"],
    demoRoute: "/live-demos/hospital-management",
    accent: "from-blue-600 to-cyan-500",
    order: 1,
  },
  {
    title: "Education & EdTech",
    slug: "education-edtech",
    icon: "GraduationCap",
    challenge: "Disconnected student information systems, manual paper-based fee reconciliation, and low remote learning engagement.",
    solution: "Unified campus ERP suites, interactive video learning management systems (LMS), and automated grade report cards.",
    keyServices: ["School, College & Institute Management Systems", "EdTech & E-Learning Mobile Apps"],
    demoRoute: "/live-demos/school-management",
    accent: "from-indigo-600 to-purple-500",
    order: 2,
  },
  {
    title: "E-Commerce & Digital Retail",
    slug: "ecommerce-digital-retail",
    icon: "ShoppingCart",
    challenge: "High cart abandonment, database locks during flash sales, and manual inventory updates across multiple marketplaces.",
    solution: "Decoupled headless storefronts, multi-vendor marketplace engines, and automated multi-warehouse dispatch pipelines.",
    keyServices: ["Custom E-Commerce Storefront Development", "Multi-Vendor Marketplace Development"],
    demoRoute: "/live-demos/ecommerce-store",
    accent: "from-[#FF6900] to-amber-500",
    order: 3,
  },
  {
    title: "Real Estate & Infrastructure",
    slug: "real-estate-infrastructure",
    icon: "Building",
    challenge: "Slow broker lead follow-ups, static property photos failing to engage NRI buyers, and disjointed visit tracking.",
    solution: "Interactive property portals with virtual tours, mortgage calculators, and automated lead distribution to broker CRM.",
    keyServices: ["Real Estate & Property Management Portals", "Landing Page Design & Optimization"],
    demoRoute: "/live-demos/real-estate-portal",
    accent: "from-blue-500 to-blue-700",
    order: 4,
  },
  {
    title: "Travel & Hospitality",
    slug: "travel-hospitality",
    icon: "Compass",
    challenge: "Complex multi-day itinerary customizations, manual booking calculations, and fragmented reservation vouchers.",
    solution: "Real-time travel booking engines, dynamic group pricing matrices, and automated customer itinerary dispatch.",
    keyServices: ["Custom Web Portal Development (B2B/B2C)", "On-Demand Delivery & Booking Apps"],
    demoRoute: "/live-demos/travel-booking",
    accent: "from-emerald-500 to-teal-600",
    order: 5,
  },
  {
    title: "Finance & FinTech",
    slug: "finance-fintech",
    icon: "ShieldCheck",
    challenge: "Strict regulatory audit mandates, latency in payment gateway settlement, and security vulnerabilities.",
    solution: "PCI-compliant payment orchestration, automated GST invoicing engines, and real-time ledger reconciliation.",
    keyServices: ["Payment Gateway Integration (Razorpay, Stripe, UPI)", "Accounting, Billing & Invoicing Software"],
    demoRoute: "/live-demos/invoice-billing",
    accent: "from-[#082B59] to-[#0756A5]",
    order: 6,
  },
  {
    title: "Logistics & Supply Chain",
    slug: "logistics-supply-chain",
    icon: "Truck",
    challenge: "Lack of real-time consignment visibility, manual manifest paperwork, and warehouse inventory deadlocks.",
    solution: "Fleet tracking portals, barcode scan inventory tracking, and carrier API integration for instant consignment tracking.",
    keyServices: ["Supply Chain & Logistics Tracking Systems", "Inventory & Warehouse Management Software"],
    demoRoute: "/live-demos/inventory-management",
    accent: "from-amber-600 to-orange-500",
    order: 7,
  },
  {
    title: "Industrial Manufacturing",
    slug: "industrial-manufacturing",
    icon: "Layers",
    challenge: "Disparate shopfloor machine data, manual bill-of-materials tracking, and untracked raw material waste.",
    solution: "Centralized manufacturing ERP suites, real-time machine telemetry, and predictive procurement order generation.",
    keyServices: ["Custom Enterprise Resource Planning (ERP) Software", "Manufacturing & Production Management Software"],
    demoRoute: "/live-demos/erp-software",
    accent: "from-blue-600 to-indigo-700",
    order: 8,
  },
  {
    title: "Retail & B2B Wholesaling",
    slug: "retail-b2b-wholesaling",
    icon: "Store",
    challenge: "Handling bulk order volume tiers, manual GST quote requests, and fragmented offline billing registers.",
    solution: "Self-service B2B wholesale portals with tiered price locks, instant GST invoicing, and POS counter sync.",
    keyServices: ["B2B Wholesale E-Commerce Portals", "Wholesale, Import-Export & Trading ERP"],
    demoRoute: "/live-demos/multi-vendor-marketplace",
    accent: "from-[#FF8A00] to-rose-500",
    order: 9,
  },
  {
    title: "Fast-Growth Startups",
    slug: "fast-growth-startups",
    icon: "Zap",
    challenge: "High burn rates, slow development agencies missing MVP launch deadlines, and inability to pivot quickly.",
    solution: "Rapid agile prototyping, scalable cloud-native architectures, and dedicated full-stack engineering pods.",
    keyServices: ["SaaS Product Engineering", "Single-Page Application (SPA) Development"],
    demoRoute: "/live-demos/admin-dashboard",
    accent: "from-amber-500 to-[#FF6900]",
    order: 10,
  },
  {
    title: "Professional Corporate Services",
    slug: "professional-corporate-services",
    icon: "Briefcase",
    challenge: "Unstructured client file sharing over emails, manual contract tracking, and poor time logging visibility.",
    solution: "Secure self-service client vaults, document lifecycle automation, and integrated billable project management.",
    keyServices: ["Customer Relationship Management (CRM) Systems", "Human Resource Management System (HRMS)"],
    demoRoute: "/live-demos/crm-software",
    accent: "from-cyan-600 to-blue-700",
    order: 11,
  },
  {
    title: "Proprietary Government & Utilities",
    slug: "government-utilities",
    icon: "ShieldCheck",
    challenge: "Legacy mainframe records, citizen access bottlenecks, and siloed administrative departments.",
    solution: "Secure citizen self-service portals, role-based departmental routing, and automated compliance auditing.",
    keyServices: ["Custom Web Portal Development (B2B/B2C)", "Cloud & DevOps Solutions"],
    demoRoute: "/live-demos/corporate-website",
    accent: "from-blue-700 to-slate-800",
    order: 12,
  },
];

// GET ALL INDUSTRIES (Public)
export const getAllIndustries = async (req, res) => {
  try {
    let industries = await Industry.find({ active: true }).sort({ order: 1, createdAt: -1 });
    if (!industries || industries.length === 0) {
      try {
        await Industry.insertMany(defaultIndustries);
        industries = await Industry.find({ active: true }).sort({ order: 1 });
      } catch (seedErr) {
        console.warn("Auto-seed industries notice:", seedErr.message);
      }
    }
    res.status(200).json({ success: true, count: industries?.length || 0, industries: industries || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET INDUSTRY BY SLUG (Public)
export const getIndustryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const industry = await Industry.findOne({ slug });
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }
    res.status(200).json({ success: true, industry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE INDUSTRY (Protected)
export const createIndustry = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.industriesControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to create industry entries",
      });
    }

    const { title, slug, icon, challenge, solution, keyServices, demoRoute, accent, order } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Industry title is required" });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await Industry.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Industry slug already exists" });
    }

    const totalCount = await Industry.countDocuments();
    const industry = await Industry.create({
      title,
      slug: cleanSlug,
      icon: icon || "HeartPulse",
      challenge: challenge || "",
      solution: solution || "",
      keyServices: Array.isArray(keyServices) ? keyServices : [],
      demoRoute: demoRoute || "",
      accent: accent || "from-blue-600 to-cyan-500",
      order: order !== undefined ? Number(order) : totalCount + 1,
      active: true,
    });

    res.status(201).json({ success: true, message: "Industry created successfully", industry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE INDUSTRY (Protected)
export const updateIndustry = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.industriesControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit industry entries",
      });
    }

    const { id } = req.params;
    const industry = await Industry.findByIdAndUpdate(id, req.body, { new: true });
    if (!industry) {
      return res.status(404).json({ success: false, message: "Industry not found" });
    }

    res.status(200).json({ success: true, message: "Industry updated successfully", industry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE INDUSTRY (Protected)
export const deleteIndustry = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.industriesControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete industry entries",
      });
    }

    const { id } = req.params;
    await Industry.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Industry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
