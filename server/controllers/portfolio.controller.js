import Portfolio from "../models/portfolio.model.js";

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

export const defaultCaseStudies = [
  {
    title: "Omnichannel B2B & B2C Marketplace Engine",
    slug: "omnichannel-marketplace-engine",
    category: "E-Commerce Solutions",
    clientIndustry: "Wholesale & Retail Commerce",
    summary: "Multi-vendor digital commerce architecture capable of handling 20,000+ daily orders with real-time multi-warehouse dispatch.",
    description: "Architected a high-concurrency multi-tenant marketplace platform with real-time inventory synchronization, vendor payout orchestration, and automated warehouse dispatch pipelines.",
    techStack: ["Next.js", "Node.js", "MongoDB", "Redis", "Razorpay"],
    deliverables: ["Customer PWA Storefront", "Vendor Seller Portal", "Logistics Dispatch Hub"],
    results: ["340% increase in checkout speed", "99.98% uptime during festive peak sale"],
    demoUrl: "/live-demos/multi-vendor-marketplace",
    featured: true,
    order: 1,
  },
  {
    title: "Cloud Enterprise ERP & Supply Chain Modernization",
    slug: "enterprise-erp-supply-chain",
    category: "Custom Software & Enterprise Solutions",
    clientIndustry: "Industrial Manufacturing",
    summary: "End-to-end manufacturing execution and supply chain visibility suite replacing 15 years of legacy spreadsheets.",
    description: "Designed a centralized enterprise resource planning system linking raw material procurement, shop floor machine tracking, QA inspection checkpoints, and automated GST billing.",
    techStack: ["React.js", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
    deliverables: ["Shopfloor Tablet Interface", "Procurement Approval Matrix", "Executive BI Dashboard"],
    results: ["45% reduction in production downtime", "Full inventory traceability across 4 facilities"],
    demoUrl: "/live-demos/erp-software",
    featured: true,
    order: 2,
  },
  {
    title: "Telemedicine & Smart Clinical Consultation Mobile App",
    slug: "telemedicine-clinical-consultation-app",
    category: "Mobile Application Development",
    clientIndustry: "Healthcare",
    summary: "HIPAA-compliant doctor consultation, e-prescription generation, and integrated diagnostic lab booking mobile suite.",
    description: "Constructed cross-platform iOS and Android telemedicine apps featuring peer-to-peer encrypted WebRTC video calls, patient electronic health records, and prescription PDF generation.",
    techStack: ["Flutter", "WebRTC", "Node.js", "MongoDB", "AWS S3"],
    deliverables: ["Patient Mobile App", "Doctor Consultation Tablet App", "Clinic Reception Desk"],
    results: ["Over 25,000 consultations completed", "4.8/5 App Store customer satisfaction score"],
    demoUrl: "/live-demos/hospital-management",
    featured: true,
    order: 3,
  },
  {
    title: "Autonomous AI Customer Service & Sales Assistant",
    slug: "autonomous-ai-sales-assistant",
    category: "AI, Machine Learning & Automation",
    clientIndustry: "Financial Services & SaaS",
    summary: "Context-aware conversational AI agent answering 80% of inbound customer queries and qualifying sales leads round-the-clock.",
    description: "Deployed specialized vector database embeddings and LLM orchestration enabling round-the-clock sales discovery, lead qualification scoring, and direct CRM contact sync.",
    techStack: ["Python", "FastAPI", "LangChain", "Vector DB", "React.js"],
    deliverables: ["Omnichannel AI Chat Widget", "Knowledge Base Ingestion Pipeline", "CRM Lead Sync"],
    results: ["78% first-contact resolution without human intervention", "Sub-second response time"],
    demoUrl: "/live-demos/ai-chatbot",
    featured: false,
    order: 4,
  },
  {
    title: "High-Performance Institutional Real Estate Portal",
    slug: "institutional-real-estate-portal",
    category: "Custom Software & Enterprise Solutions",
    clientIndustry: "Real Estate & Commercial Infrastructure",
    summary: "Modern property discovery platform with interactive virtual tour booking, mortgage calculators, and lead attribution.",
    description: "Engineered high-speed property listing engine with interactive unit floorplan previews, automated mortgage amortization tables, and instant WhatsApp broker routing.",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    deliverables: ["Public Listing Portal", "Broker Lead Assignment Dashboard", "Virtual Tour Viewer"],
    results: ["62% increase in scheduled property walkthroughs", "100% lead capture speed under 2 minutes"],
    demoUrl: "/live-demos/real-estate-portal",
    featured: false,
    order: 5,
  },
  {
    title: "Automated Corporate HRMS & Biometric Payroll",
    slug: "automated-hrms-biometric-payroll",
    category: "Custom Software & Enterprise Solutions",
    clientIndustry: "Professional Corporate Services",
    summary: "Automated personnel lifecycle system connecting biometric shift punches with statutory salary deductions and leave balances.",
    description: "Connected real-time hardware biometric attendance scanners with automatic shift calculations, overtime approvals, leave balance accruals, and statutory Form 16 generation.",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "PDFKit"],
    deliverables: ["Employee Self-Service Portal", "HR Admin Payroll Console", "Automated Payslip Generator"],
    results: ["Payroll processing time dropped from 4 days to 20 minutes", "100% statutory compliance"],
    demoUrl: "/live-demos/hrms-software",
    featured: false,
    order: 6,
  },
];

// GET ALL PORTFOLIO (Public)
export const getAllPortfolio = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }

    let projects = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    if ((!projects || projects.length === 0) && (!category || category === "all")) {
      try {
        await Portfolio.insertMany(defaultCaseStudies);
        projects = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
      } catch (seedErr) {
        console.warn("Auto-seed portfolio notice:", seedErr.message);
      }
    }

    res.status(200).json({ success: true, count: projects?.length || 0, projects: projects || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET PORTFOLIO BY SLUG (Public)
export const getPortfolioBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Portfolio.findOne({ slug });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE PORTFOLIO (Protected)
export const createPortfolio = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.portfolioControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to create portfolio projects",
      });
    }

    const { title, slug } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Project title is required" });
    }

    const cleanSlug = (slug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await Portfolio.findOne({ slug: cleanSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Project slug already exists" });
    }

    const totalCount = await Portfolio.countDocuments();
    const project = await Portfolio.create({
      ...req.body,
      slug: cleanSlug,
      order: req.body.order !== undefined ? Number(req.body.order) : totalCount + 1,
    });

    res.status(201).json({ success: true, message: "Project created", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE PORTFOLIO (Protected)
export const updatePortfolio = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.portfolioControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit portfolio projects",
      });
    }

    const { id } = req.params;
    const project = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    res.status(200).json({ success: true, message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE PORTFOLIO (Protected)
export const deletePortfolio = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.portfolioControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete portfolio projects",
      });
    }

    const { id } = req.params;
    await Portfolio.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
