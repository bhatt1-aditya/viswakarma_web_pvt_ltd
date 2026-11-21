import { PricingTier, PricingFaq } from "../models/pricing.model.js";

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

export const defaultTiers = [
  {
    name: "Starter Solutions",
    badge: "For Startups & SMBs",
    highlight: false,
    price: "Custom Scope",
    tagline: "High-impact MVP development to validate business concepts rapidly.",
    features: [
      "Custom responsive web application or mobile MVP",
      "Modern React.js / Node.js architecture",
      "Essential REST APIs & database schema",
      "Payment gateway integration (UPI / Razorpay / Stripe)",
      "Basic admin management dashboard",
      "30-day post-launch warranty & bug fixes",
      "100% source code & IP transfer",
    ],
    cta: "Request Starter Consultation",
    ctaLink: "/quote",
    order: 1,
    active: true,
  },
  {
    name: "Business Solutions",
    badge: "Most Popular For Mid-Market",
    highlight: true,
    price: "Growth Tier",
    tagline: "Scalable digital infrastructure engineered for heavy daily transaction volumes.",
    features: [
      "Full-stack web platform + cross-platform mobile app",
      "Tailored CRM / ERP modules & departmental workflows",
      "Automated WhatsApp & Email customer notification triggers",
      "Multi-role user permission hierarchies (RBAC)",
      "High-availability database optimization & indexing",
      "60-day post-launch warranty & SLA support",
      "Complete CI/CD deployment pipeline on AWS/GCP",
    ],
    cta: "Request Business Tier Quote",
    ctaLink: "/quote",
    order: 2,
    active: true,
  },
  {
    name: "Enterprise Solutions",
    badge: "For Corporations & Scale-ups",
    highlight: false,
    price: "Enterprise Scope",
    tagline: "Mission-critical architectures engineered for strict compliance, high concurrency, and zero downtime.",
    features: [
      "Multi-tenant SaaS product engineering or corporate ERP",
      "AI & machine learning autonomous workflow pipelines",
      "Microservices architecture with Redis & message queues",
      "ISO 27001 / SOC-2 security compliance architecture",
      "Biometric attendance, multi-warehouse & GST engine",
      "Dedicated senior engineering pod & architect lead",
      "24/7 technical monitoring & quarterly security audits",
    ],
    cta: "Consult Enterprise Architects",
    ctaLink: "/quote",
    order: 3,
    active: true,
  },
];

export const defaultFaqs = [
  {
    q: "How are project milestones structured and billed?",
    a: "We operate on transparent milestone deliverables. A project typically has 3-4 milestone gates (Discovery/Architecture, Alpha Prototype, Beta Testing/QA, and Production Go-Live). You only release milestone funds upon your review and approval of verifiable demo code.",
    order: 1,
    active: true,
  },
  {
    q: "Who owns the intellectual property and source code?",
    a: "You retain 100% full intellectual property ownership. Upon milestone sign-off, all Git repositories, Figma design systems, database schemas, and documentation are formally assigned to your organization.",
    order: 2,
    active: true,
  },
  {
    q: "Do you provide post-deployment warranty and technical SLA?",
    a: "Yes. Every engagement includes a 30 to 90-day post-launch warranty covering bug remediation and infrastructure stabilization, with ongoing annual SLA maintenance retainers available.",
    order: 3,
    active: true,
  },
  {
    q: "Can we hire dedicated full-stack developer pods on retainer?",
    a: "Yes. We offer dedicated engineering pods (Senior Full-Stack Engineer, UI/UX Designer, QA Specialist, and Solution Architect) on flexible monthly agile retainers.",
    order: 4,
    active: true,
  },
];

// GET ALL PRICING (Public)
export const getAllPricing = async (req, res) => {
  try {
    let tiers = await PricingTier.find({ active: true }).sort({ order: 1, createdAt: 1 });
    let faqs = await PricingFaq.find({ active: true }).sort({ order: 1, createdAt: 1 });

    if (!tiers || tiers.length === 0) {
      try {
        await PricingTier.insertMany(defaultTiers);
        tiers = await PricingTier.find({ active: true }).sort({ order: 1 });
      } catch (seedErr) {
        console.warn("Auto-seed tiers notice:", seedErr.message);
      }
    }

    if (!faqs || faqs.length === 0) {
      try {
        await PricingFaq.insertMany(defaultFaqs);
        faqs = await PricingFaq.find({ active: true }).sort({ order: 1 });
      } catch (seedErr) {
        console.warn("Auto-seed faqs notice:", seedErr.message);
      }
    }

    res.status(200).json({ success: true, tiers: tiers || [], faqs: faqs || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// CREATE TIER (Protected)
export const createTier = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.pricingControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to add pricing tiers",
      });
    }

    const { name, badge, highlight, price, tagline, features, cta, ctaLink, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Tier name is required" });
    }

    const totalCount = await PricingTier.countDocuments();
    const tier = await PricingTier.create({
      name,
      badge: badge || "Tier Package",
      highlight: Boolean(highlight),
      price: price || "Custom Scope",
      tagline: tagline || "",
      features: Array.isArray(features) ? features : [],
      cta: cta || "Request Consultation",
      ctaLink: ctaLink || "/quote",
      order: order !== undefined ? Number(order) : totalCount + 1,
      active: true,
    });

    res.status(201).json({ success: true, message: "Pricing tier created", tier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE TIER (Protected)
export const updateTier = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.pricingControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit pricing tiers",
      });
    }

    const { id } = req.params;
    const tier = await PricingTier.findByIdAndUpdate(id, req.body, { new: true });
    if (!tier) {
      return res.status(404).json({ success: false, message: "Pricing tier not found" });
    }

    res.status(200).json({ success: true, message: "Pricing tier updated", tier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE TIER (Protected)
export const deleteTier = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.pricingControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete pricing tiers",
      });
    }

    const { id } = req.params;
    await PricingTier.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Pricing tier deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// FAQS HANDLERS
export const createFaq = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.pricingControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { q, a, order } = req.body;
    if (!q || !a) {
      return res.status(400).json({ success: false, message: "Question and Answer are required" });
    }

    const totalCount = await PricingFaq.countDocuments();
    const faq = await PricingFaq.create({
      q,
      a,
      order: order !== undefined ? Number(order) : totalCount + 1,
      active: true,
    });

    res.status(201).json({ success: true, message: "FAQ created", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFaq = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.pricingControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const faq = await PricingFaq.findByIdAndUpdate(id, req.body, { new: true });
    if (!faq) return res.status(404).json({ success: false, message: "FAQ not found" });
    res.status(200).json({ success: true, message: "FAQ updated", faq });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFaq = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.pricingControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    await PricingFaq.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
