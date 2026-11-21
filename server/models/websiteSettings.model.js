import mongoose from "mongoose";

const defaultHeroHeadlines = [
  "Powerful Digital Experiences.",
  "Scalable Cloud Architecture.",
  "Intelligent AI & Automation.",
  "High-Performance Mobile Apps.",
  "Enterprise Custom Software.",
];

const defaultStrategicPillars = [
  {
    number: "01",
    title: "Customized Solutions",
    desc: "Bespoke engineering tailored to your exact business workflows without bloated, rigid templates.",
    feature: "100% custom-crafted codebase built for your unique operational logic.",
  },
  {
    number: "02",
    title: "Modern Technology Stack",
    desc: "Built with React.js, Node.js, Next.js, Flutter, MongoDB, and AWS for peak speed and security.",
    feature: "Modern reactive frameworks ensuring lightning-fast load times.",
  },
  {
    number: "03",
    title: "Responsive Development",
    desc: "Flawless mobile-first user journeys designed to adapt seamlessly across smartphones, tablets, and desktops.",
    feature: "Pixel-perfect fluid layouts across all device viewports.",
  },
  {
    number: "04",
    title: "Scalable Architecture",
    desc: "Microservices, decoupled frontends, and cloud databases ready to handle millions of transactions.",
    feature: "Engineered to scale effortlessly from 1,000 to 10M+ active users.",
  },
  {
    number: "05",
    title: "Security-Focused Development",
    desc: "Enterprise data encryption, role-based access control, CSRF protection, and OWASP compliance.",
    feature: "Zero-trust security architecture protecting critical corporate data.",
  },
  {
    number: "06",
    title: "Ongoing Technical Support",
    desc: "Reliable post-launch warranty, 24/7 uptime monitoring, and dedicated developer maintenance retainers.",
    feature: "Guaranteed SLA response times with proactive cloud monitoring.",
  },
];

const defaultAboutPhrases = [
  "Mission-Critical Software.",
  "Scalable Digital Platforms.",
  "Enterprise-Grade Applications.",
  "Intelligent Automated Workflows.",
  "Future-Ready Cloud Systems.",
];

const defaultAboutCoreValues = [
  {
    number: "01",
    title: "Engineering Integrity",
    desc: "We write clean, documented, future-proof code that scales gracefully without hidden shortcuts or technical debt.",
    feature: "Strict modular architecture adhering to clean code standards.",
  },
  {
    number: "02",
    title: "Commercial Transparency",
    desc: "Predictable milestone-driven deliverables, transparent sprint tracking, and clear scope agreements without surprise fees.",
    feature: "Bi-weekly sprint reviews and verifiable milestone demos.",
  },
  {
    number: "03",
    title: "Total IP Ownership",
    desc: "100% of all intellectual property, source repositories, databases, and design tokens belong permanently to the client.",
    feature: "Complete transfer of repositories, docs, and assets.",
  },
  {
    number: "04",
    title: "Enduring Technical SLA",
    desc: "We stand firmly behind our builds with continuous uptime assurance, security patching, and ongoing feature enhancement.",
    feature: "Proactive uptime monitoring and rapid SLA response.",
  },
];

const defaultEngineeringFramework = [
  {
    step: "01",
    title: "Discovery & Enterprise Modeling",
    desc: "Comprehensive business process mapping, user journey planning, and data domain architecture.",
  },
  {
    step: "02",
    title: "Decoupled Modular Architecture",
    desc: "Building scalable frontend micro-interfaces and resilient backend REST APIs designed for scale.",
  },
  {
    step: "03",
    title: "Automated QA & Security Auditing",
    desc: "End-to-end regression testing, OWASP vulnerability scans, and Core Web Vitals optimization.",
  },
  {
    step: "04",
    title: "Cloud Orchestration & 24/7 SLA",
    desc: "Zero-downtime CI/CD container deployments, cloud monitoring, and dedicated developer retainers.",
  },
];

const websiteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Vishwakarma Web Private Limited" },
    tagline: { type: String, default: "Transforming Ideas Into Powerful Digital Experiences" },
    email: { type: String, default: "vishwakarmawebprivatelimited@gmail.com" },
    phone: { type: String, default: "+91  +91 7684931759, 7008156600" },
    whatsapp: { type: String, default: "+91  +91 7684931759, 7008156600" },
    address: { type: String, default: "Tech Hub Tower, Sector 62, Noida, Uttar Pradesh, India" },
    workingHours: { type: String, default: "Mon - Sat: 9:00 AM - 7:00 PM IST" },
    socialLinks: {
      linkedin: { type: String, default: "https://linkedin.com/company/vishwakarmaweb" },
      twitter: { type: String, default: "https://twitter.com/vishwakarmaweb" },
      facebook: { type: String, default: "https://facebook.com/vishwakarmaweb" },
      instagram: { type: String, default: "https://instagram.com/vishwakarmaweb" },
      github: { type: String, default: "https://github.com/vishwakarmaweb" },
    },
    seo: {
      metaTitle: { type: String, default: "Vishwakarma Web Private Limited – Full-Service IT & Digital Solutions" },
      metaDescription: { type: String, default: "Vishwakarma Web Private Limited delivers innovative software, web, mobile, AI, and digital solutions that help businesses grow." },
      keywords: [{ type: String }],
    },

    // ── DYNAMIC HOME SCREEN CMS CONTENT ──
    homeContent: {
      // Hero Section
      heroBadge: {
        type: String,
        default: "ISO 9001:2015 Certified Software Engineering Company",
      },
      heroTitlePrefix: {
        type: String,
        default: "Transforming Ideas Into",
      },
      heroHeadlines: {
        type: [String],
        default: defaultHeroHeadlines,
      },
      heroSubtitle: {
        type: String,
        default:
          "Vishwakarma Web Private Limited crafts high-performance software applications, enterprise portals, scalable mobile apps, and AI automation systems. Backed by a strict 99.98% production SLA and zero-trust security.",
      },
      heroPrimaryBtnText: {
        type: String,
        default: "Explore 108 Services",
      },
      heroPrimaryBtnLink: {
        type: String,
        default: "/services",
      },
      heroSecondaryBtnText: {
        type: String,
        default: "Apply For Project",
      },
      heroSecondaryBtnLink: {
        type: String,
        default: "/quote",
      },

      // Strategic Advantage Section
      strategicAdvantageTag: {
        type: String,
        default: "Engineered For Enterprise Growth",
      },
      strategicAdvantageTitle: {
        type: String,
        default: "Our Strategic Advantage",
      },
      strategicAdvantageSubtitle: {
        type: String,
        default:
          "We do not deliver off-the-shelf templates. Every line of code is purpose-built to accelerate your revenue, automate manual bottlenecks, and scale without technical debt.",
      },
      strategicPillars: {
        type: [
          {
            number: String,
            title: String,
            desc: String,
            feature: String,
          },
        ],
        default: defaultStrategicPillars,
      },
      strategicBannerTitle: {
        type: String,
        default: "Measurable ROI & Transparent Delivery Milestones",
      },
      strategicBannerDesc: {
        type: String,
        default:
          "Every sprint is governed by milestone escrow approvals. You inspect working code on staging environments before releasing funds.",
      },

      // Commercial SLA Guarantee Banner
      slaGuaranteeTitle: {
        type: String,
        default: "Enterprise SLA & Engineering Assurance",
      },
      slaGuaranteeSubtitle: {
        type: String,
        default:
          "Our client contracts are backed by concrete engineering SLAs, zero-trust cybersecurity protocols, and dedicated post-release maintenance.",
      },
      slaUptime: { type: String, default: "99.98%" },
      slaTurnaround: { type: String, default: "24-Hour" },
      slaSecurity: { type: String, default: "Zero-Trust" },
      slaEscrow: { type: String, default: "Milestone-Escrow" },

      // Final Call to Action
      ctaHeadline: {
        type: String,
        default: "Ready to Transform Your Digital Infrastructure?",
      },
      ctaSubtitle: {
        type: String,
        default:
          "Speak directly with our senior software architects. Receive a comprehensive scope breakdown and preliminary estimate within 24 business hours.",
      },
      ctaPrimaryBtnText: { type: String, default: "Apply For Project" },
      ctaPrimaryBtnLink: { type: String, default: "/quote" },
      ctaSecondaryBtnText: { type: String, default: "Chat on WhatsApp" },
      ctaWhatsappNumber: { type: String, default: "+91 70775 60648" },
    },

    // ── DYNAMIC ABOUT US SCREEN CMS CONTENT ──
    aboutContent: {
      // 1. Hero Section
      heroBadge: {
        type: String,
        default: "About Vishwakarma Web Private Limited",
      },
      heroTitlePrefix: {
        type: String,
        default: "Architecting & Engineering",
      },
      heroHeadlines: {
        type: [String],
        default: defaultAboutPhrases,
      },
      heroSubtitle: {
        type: String,
        default:
          "Vishwakarma Web Private Limited is a specialized IT engineering and digital product firm based in Noida, India. We empower ambitious startups, growing mid-market companies, and large enterprises with resilient web platforms, mobile ecosystems, custom enterprise software, and automated AI workflows.",
      },
      heroPrimaryBtnText: {
        type: String,
        default: "Explore 108 Services",
      },
      heroPrimaryBtnLink: {
        type: String,
        default: "/services",
      },
      heroSecondaryBtnText: {
        type: String,
        default: "Contact Our Team",
      },
      heroSecondaryBtnLink: {
        type: String,
        default: "/contact",
      },

      // 2. Corporate Mission & Vision
      missionTag: { type: String, default: "MISSION CHARTER" },
      missionTitle: { type: String, default: "Our Corporate Mission" },
      missionDesc: {
        type: String,
        default:
          "To empower startups, mid-market businesses, and global enterprises with high-reliability software, web platforms, mobile apps, and autonomous AI systems that streamline operations, eliminate human error, and accelerate commercial growth.",
      },
      missionPoints: {
        type: [String],
        default: [
          "Architect decoupled, maintainable code with zero technical debt",
          "Automate repetitive manual operations with intelligent software",
          "Deliver transparent bi-weekly milestones with zero scope creep",
        ],
      },

      visionTag: { type: String, default: "VISION 2030" },
      visionTitle: { type: String, default: "Our Long-Term Vision" },
      visionDesc: {
        type: String,
        default:
          "To be the most trusted technology engineering partner for organizations navigating digital transformation, recognized internationally for exceptional code craftsmanship, robust enterprise security, and measurable commercial return on investment.",
      },
      visionPoints: {
        type: [String],
        default: [
          "Global standard for reliable enterprise full-stack engineering",
          "Pioneering pragmatic AI and autonomous workflow integrations",
          "Long-term client partnerships grounded in mutual commercial ROI",
        ],
      },

      // 3. Core Values
      coreValuesTag: { type: String, default: "Our Code of Conduct" },
      coreValuesTitle: { type: String, default: "Our Guiding Principles & Core Values" },
      coreValuesSubtitle: {
        type: String,
        default:
          "The engineering ethos behind every line of code we write, every architecture we deploy, and every partnership we foster.",
      },
      coreValues: {
        type: [
          {
            number: String,
            title: String,
            desc: String,
            feature: String,
          },
        ],
        default: defaultAboutCoreValues,
      },

      // 4. Engineering Framework
      frameworkTag: { type: String, default: "Predictable Delivery" },
      frameworkTitle: { type: String, default: "Our Engineering Architecture Framework" },
      frameworkSubtitle: {
        type: String,
        default:
          "From business modeling to high-availability cloud orchestration, we apply structured engineering rigor at every stage.",
      },
      engineeringFramework: {
        type: [
          {
            step: String,
            title: String,
            desc: String,
          },
        ],
        default: defaultEngineeringFramework,
      },

      // 5. Commercial Commitment Banner
      guaranteeTag: { type: String, default: "The Vishwakarma Commercial Guarantee" },
      guaranteeTitle: {
        type: String,
        default: "Transparent Partnerships Rooted in Engineering Accountability",
      },
      guaranteeDesc: {
        type: String,
        default:
          "When you partner with Vishwakarma Web Private Limited, you retain 100% intellectual property ownership, direct access to dedicated senior developers, and milestone deliverables verified against pre-agreed acceptance criteria.",
      },
      slaUptime: { type: String, default: "99.99%" },
      slaTurnaround: { type: String, default: "2 Weeks" },
      slaEscrow: { type: String, default: "100% IP" },
      slaSecurity: { type: String, default: "Zero-Trust" },

      // 6. Final Call to Action
      ctaTag: { type: String, default: "Ready to Build Something Meaningful?" },
      ctaHeadline: {
        type: String,
        default: "Let's Engineer Your Next Digital Milestone.",
      },
      ctaSubtitle: {
        type: String,
        default:
          "Partner with Vishwakarma Web Private Limited to turn business vision into scalable, enterprise-grade software.",
      },
      ctaPrimaryBtnText: { type: String, default: "Request a Free Quote" },
      ctaPrimaryBtnLink: { type: String, default: "/quote" },
      ctaSecondaryBtnText: { type: String, default: "Schedule Consultation" },
      ctaSecondaryBtnLink: { type: String, default: "/contact" },
    },
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteSettings", websiteSettingsSchema);
