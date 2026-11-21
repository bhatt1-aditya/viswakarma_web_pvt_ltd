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

const websiteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Vishwakarma Web Private Limited" },
    tagline: { type: String, default: "Transforming Ideas Into Powerful Digital Experiences" },
    email: { type: String, default: "vishwakarmawebprivatelimited@gmail.com" },
    phone: { type: String, default: "+91 70775 60648" },
    whatsapp: { type: String, default: "+91 70775 60648" },
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
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteSettings", websiteSettingsSchema);
