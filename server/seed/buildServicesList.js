import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Complete 108 services defined with exact titles from user specification
const rawServicesList = [
  // CATEGORY 1: WEBSITE DESIGN & DEVELOPMENT (1-15)
  {
    idNumber: 1,
    title: "Custom Business Website Design",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Tailor-made corporate and commercial web platforms built to reflect brand excellence and drive commercial inquiries.",
    demoSlug: "corporate-website",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Next.js", "Figma"],
    problems: [
      "Generic template websites fail to differentiate brand value from competitors.",
      "High bounce rates due to unoptimized visual hierarchy and confusing navigation.",
      "Inability to scale layout as company offerings and services expand."
    ],
    features: [
      "Custom responsive UI/UX tailored to unique brand identity",
      "Interactive service catalogs and lead-capture funnels",
      "Sub-second load times with Core Web Vitals optimization",
      "Modular design components for rapid future expansion"
    ],
    deliverables: ["Full source code repository", "Production build & deployment", "Figma UI/UX design file", "CMS documentation & admin training"]
  },
  {
    idNumber: 2,
    title: "Corporate Website Development",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Enterprise-grade digital web portals equipped with compliance standards, investor relations, and multi-department governance.",
    demoSlug: "corporate-website",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
    problems: [
      "Enterprises require strict security compliance, role separation, and high availability.",
      "Siloed departmental information confuses external stakeholders and investors.",
      "Slow legacy systems vulnerable to cyber attacks and downtime."
    ],
    features: [
      "Enterprise security architecture with SSL, CSRF, and XSS protection",
      "Investor relations, press release, and career portal modules",
      "High-availability cloud hosting configuration with auto-scaling",
      "Role-based content editorial workflow with draft approvals"
    ],
    deliverables: ["Enterprise web portal", "Security audit report", "DevOps CI/CD setup", "User management documentation"]
  },
  {
    idNumber: 3,
    title: "Responsive Mobile-First Web Design",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Pixel-perfect web interfaces engineered from mobile viewports upward for uncompromising touch experiences.",
    demoSlug: "landing-page",
    techStack: ["Tailwind CSS", "HTML5", "CSS Grid", "React.js", "Framer Motion"],
    problems: [
      "Over 65% of web traffic originates on mobile, yet desktop-first sites break on phones.",
      "Touch target frustration causing accidental taps and abandoned cart funnels.",
      "Heavy assets draining mobile bandwidth and slowing loading on cellular networks."
    ],
    features: [
      "Fluid breakpoint typography and dynamic viewport scaling",
      "Ergonomic thumb-zone navigation and gesture interactions",
      "Adaptive image delivery and lazy loading for cellular data saving",
      "Cross-browser and cross-device visual parity testing"
    ],
    deliverables: ["Adaptive responsive frontend code", "Cross-device browser compatibility test matrix", "Touch UX performance audit"]
  },
  {
    idNumber: 4,
    title: "Single-Page Application (SPA) Development",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Ultra-fast dynamic web applications that eliminate page reloads through client-side state routing.",
    demoSlug: "admin-dashboard",
    techStack: ["React.js", "Redux Toolkit", "React Router", "Vite", "Axios"],
    problems: [
      "Full page reloads disrupt user workflows in data-heavy platforms.",
      "High server load from rendering static assets repeatedly on every click.",
      "Inconsistent client-side state across multi-step transactions."
    ],
    features: [
      "Client-side routing with zero full-page browser reloads",
      "Centralized state management with persistent memory",
      "Optimistic UI updates for instantaneous user action feedback",
      "Asynchronous REST API data hydration and smart caching"
    ],
    deliverables: ["Production SPA application bundle", "API integration layer", "State architecture documentation"]
  },
  {
    idNumber: 5,
    title: "Progressive Web App (PWA) Development",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Web apps with native-like powers: home screen installation, background push notifications, and offline capability.",
    demoSlug: "mobile-app",
    techStack: ["Service Workers", "Web App Manifest", "IndexedDB", "React.js", "Workbox"],
    problems: [
      "Native apps face high barrier of download from App Store / Play Store.",
      "Poor connectivity in field environments renders standard web apps inoperable.",
      "Lack of re-engagement channels without native push notifications."
    ],
    features: [
      "One-click 'Add to Home Screen' installation without app stores",
      "Service worker offline caching with IndexedDB data sync",
      "Native web push notifications for user alerts and marketing",
      "Seamless background data synchronization upon reconnection"
    ],
    deliverables: ["PWA build with Service Worker & Web Manifest", "Offline strategy schema", "Push notification backend setup"]
  },
  {
    idNumber: 6,
    title: "Landing Page Design & Optimization",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "High-velocity campaign landing pages laser-focused on converting paid ad traffic into qualified sales inquiries.",
    demoSlug: "landing-page",
    techStack: ["React.js", "Tailwind CSS", "Framer Motion", "GA4", "Hotjar"],
    problems: [
      "Expensive ad campaigns bleeding budget due to low-converting destination pages.",
      "Cluttered visual distractions pulling prospects away from conversion CTAs.",
      "Slow page speeds causing high ad bounce rates before copy even renders."
    ],
    features: [
      "Strategic visual hierarchy highlighting singular value proposition",
      "Frictionless lead capture forms with instant field validation",
      "A/B testing architecture and conversion event tracking",
      "Interactive calculators and trust badges engineered for conversions"
    ],
    deliverables: ["High-conversion landing page", "UTM parameter tracking integration", "Conversion event analytics schema"]
  },
  {
    idNumber: 7,
    title: "Static & Dynamic Website Creation",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Hybrid architectures balancing static lightning-speed pages with dynamic database-driven components.",
    demoSlug: "corporate-website",
    techStack: ["Next.js", "React.js", "Node.js", "MongoDB", "Tailwind CSS"],
    problems: [
      "Pure static sites lack real-time data interaction and lead capture.",
      "Pure dynamic sites suffer from higher hosting costs and slower TTFB.",
      "Managing content updates requires developer intervention on rigid sites."
    ],
    features: [
      "Static Site Generation (SSG) for public marketing pages",
      "Server-Side Rendering (SSR) for real-time dynamic inventory",
      "Integrated database endpoints for real-time form processing",
      "Automated cache invalidation upon content publishing"
    ],
    deliverables: ["Full-stack website codebase", "Database configuration", "Automated build pipeline"]
  },
  {
    idNumber: 8,
    title: "Portfolio & Personal Branding Websites",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Distinguished digital footprints for executives, consultants, architects, and agency founders.",
    demoSlug: "corporate-website",
    techStack: ["React.js", "Tailwind CSS", "Framer Motion", "Markdown", "Vite"],
    problems: [
      "Generic LinkedIn profiles fail to establish authority for high-ticket consulting.",
      "Difficult to showcase multi-media case studies, press mentions, and speaking gigs.",
      "Lack of direct booking and advisory inquiry mechanism."
    ],
    features: [
      "Interactive case study galleries with metrics and client quotes",
      "Integrated consultation calendar scheduling (Calendly / custom)",
      "Thought leadership blog and media appearance repository",
      "Sleek micro-interactions conveying premium craftsmanship"
    ],
    deliverables: ["Personal brand website", "Media kit page", "Case study CMS structure"]
  },
  {
    idNumber: 9,
    title: "Multi-Language & Multi-Regional Websites",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Globalized digital presence supporting internationalization (i18n), localized currencies, and RTL layouts.",
    demoSlug: "corporate-website",
    techStack: ["i18next", "React.js", "Next.js", "GeoIP API", "Tailwind CSS"],
    problems: [
      "International expansion hampered by language barriers and unlocalized messaging.",
      "Search engines misindexing localized content without proper hreflang tags.",
      "Broken layouts when switching to Right-to-Left (RTL) languages like Arabic."
    ],
    features: [
      "Automated and manual locale switching with persistent user preference",
      "SEO-compliant hreflang architecture for regional Google ranking",
      "Comprehensive RTL/LTR bidirectional layout support",
      "GeoIP automated currency and regional branch routing"
    ],
    deliverables: ["Multi-lingual application architecture", "Translation dictionary files", "International SEO hreflang schema"]
  },
  {
    idNumber: 10,
    title: "Website Redesign & Modernization",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Complete revitalization of outdated websites into contemporary, high-performing digital flagships.",
    demoSlug: "corporate-website",
    techStack: ["React.js", "Tailwind CSS", "Modern JavaScript", "Webpack", "Figma"],
    problems: [
      "Dated design aesthetics driving away modern prospects and harming credibility.",
      "Spaghetti codebases that are difficult and expensive to maintain.",
      "Drop in organic search rank due to mobile usability penalties."
    ],
    features: [
      "Complete visual rebranding and contemporary typography systems",
      "Refactoring legacy code into modular, maintainable React components",
      "Preservation of existing SEO link equity via 301 redirect mapping",
      "Dramatically reduced load times and improved Core Web Vitals"
    ],
    deliverables: ["Modernized website", "SEO 301 redirection audit map", "Component design guide"]
  },
  {
    idNumber: 11,
    title: "Website Speed & Core Web Vitals Optimization",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Scientific performance engineering targeting 90+ Google PageSpeed scores, sub-second LCP, and zero layout shifts.",
    demoSlug: "analytics-dashboard",
    techStack: ["Lighthouse", "Web Vitals", "Next.js", "Image Optimization", "Brotli"],
    problems: [
      "Every 1-second delay in page load reduces conversions by up to 7%.",
      "Failing Google Core Web Vitals suppresses organic search positions.",
      "High bounce rates among cellular and rural users with slower connections."
    ],
    features: [
      "Largest Contentful Paint (LCP) reduction via critical CSS and preloading",
      "Cumulative Layout Shift (CLS) elimination with dimension reservations",
      "Next-gen image conversion (WebP/AVIF) and responsive srcsets",
      "JavaScript bundle tree-shaking, code-splitting, and minification"
    ],
    deliverables: ["Before/After Lighthouse audit report", "Optimized production bundle", "Performance monitoring setup"]
  },
  {
    idNumber: 12,
    title: "Web Accessibility (WCAG) Compliance Audits",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Accessibility audits and remediation ensuring adherence to WCAG 2.1 AA and ADA legal standards.",
    demoSlug: "corporate-website",
    techStack: ["axe-core", "WAVE", "Screen Readers", "ARIA", "Semantic HTML"],
    problems: [
      "Millions of users with disabilities excluded from accessing digital services.",
      "Legal risk and liability under ADA Title III and international compliance acts.",
      "Inaccessible markup penalizes screen-reader user journeys and SEO bots."
    ],
    features: [
      "Complete semantic HTML refactoring and ARIA role mapping",
      "Full keyboard navigation traps and logical tab-order enforcement",
      "Color contrast ratio audits meeting strict WCAG AA thresholds",
      "Screen-reader audit using NVDA and VoiceOver"
    ],
    deliverables: ["WCAG 2.1 compliance audit certificate", "Remediated accessible codebase", "Accessibility policy document"]
  },
  {
    idNumber: 13,
    title: "Legacy Website Migration & Upgrading",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Zero-downtime migration of end-of-life CMS and framework codebases to modern, secure tech stacks.",
    demoSlug: "corporate-website",
    techStack: ["Node.js", "Docker", "Database Migration", "Git", "REST APIs"],
    problems: [
      "Unpatched legacy CMS engines vulnerable to ransomware and malware injection.",
      "Database schema bottlenecks preventing integration with modern SaaS tools.",
      "Risk of massive data loss and SEO ranking destruction during unguided migration."
    ],
    features: [
      "Zero-downtime database extraction, transformation, and load (ETL)",
      "Preservation of user passwords, historical orders, and media assets",
      "Seamless DNS cutover strategy with automated rollback contingency",
      "Hardened server environment and automated database backups"
    ],
    deliverables: ["Migrated modern web system", "Database integrity verification report", "DNS cutover playbook"]
  },
  {
    idNumber: 14,
    title: "Custom Web Portal Development (B2B/B2C)",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Secure self-service customer, vendor, and partner portals with role-based authentication and document workflows.",
    demoSlug: "multi-vendor-marketplace",
    techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT"],
    problems: [
      "Overwhelmed support staff handling manual account and document requests.",
      "Clients lack transparency into active orders, invoices, and service tickets.",
      "Insecure sharing of confidential business files over unstructured emails."
    ],
    features: [
      "Secure authentication with multi-factor authentication (MFA)",
      "Granular role-based permissions for clients, managers, and external vendors",
      "Encrypted file vault and automated document generation",
      "Integrated transaction history, invoice downloads, and support messaging"
    ],
    deliverables: ["Full-featured web portal", "Role-based access control system", "Admin management dashboard"]
  },
  {
    idNumber: 15,
    title: "Ongoing Website Maintenance & Support",
    categorySlug: "website-design-development",
    categoryName: "Website Design & Development",
    shortDescription: "Proactive 24/7 technical monitoring, security patching, uptime assurance, and on-demand feature iterations.",
    demoSlug: "corporate-website",
    techStack: ["Uptime Kuma", "GitHub Actions", "Sentry", "Cloudflare", "Docker"],
    problems: [
      "Unmonitored sites experience silent outages that cost sales and brand trust.",
      "Outdated plugins and dependencies become open backdoors for attackers.",
      "Lack of dedicated technical bandwidth to roll out frequent marketing updates."
    ],
    features: [
      "Continuous 24/7 uptime monitoring with real-time alerting",
      "Automated daily encrypted offsite backups",
      "Monthly security patching and dependency updates",
      "Dedicated developer hours for ongoing UI and feature tweaks"
    ],
    deliverables: ["Monthly performance & security audit report", "SLA contract guarantee", "Incident response channel"]
  },

  // CATEGORY 2: CONTENT MANAGEMENT SYSTEMS (CMS) (16-25)
  {
    idNumber: 16,
    title: "Custom WordPress Theme Development",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Bespoke, lightweight WordPress themes coded from scratch without bloated visual page builders.",
    demoSlug: "cms-blog",
    techStack: ["WordPress", "PHP", "Tailwind CSS", "Gutenberg Blocks", "MySQL"],
    problems: [
      "Off-the-shelf themes bloated with 50+ unnecessary scripts that ruin page speed.",
      "Frequent plugin conflicts causing catastrophic site crashes after core updates.",
      "Rigid layouts that cannot accommodate unique branding requirements."
    ],
    features: [
      "Clean, zero-bloat code architecture scoring 95+ on Google PageSpeed",
      "Custom Gutenberg blocks tailored specifically to editorial needs",
      "Custom Post Types and Advanced Custom Fields (ACF) architecture",
      "Built-in schema markup and SEO-friendly semantic markup"
    ],
    deliverables: ["Custom WordPress theme package", "ACF field group definitions", "Block editor user documentation"]
  },
  {
    idNumber: 17,
    title: "Custom WordPress Plugin Development",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Specialized WordPress plugins delivering unique business logic, custom calculators, and proprietary third-party integrations.",
    demoSlug: "cms-blog",
    techStack: ["PHP", "WordPress REST API", "React.js", "MySQL", "Composer"],
    problems: [
      "Existing public plugins do not match proprietary business workflows.",
      "Third-party plugins frequently introduce unvetted security vulnerabilities.",
      "Unoptimized database queries in third-party plugins causing high server CPU usage."
    ],
    features: [
      "Secure object-oriented plugin architecture adhering to WordPress VIP coding standards",
      "Custom REST API endpoints for seamless frontend data consumption",
      "Dedicated admin configuration settings panels",
      "Optimized custom database tables with indexed queries"
    ],
    deliverables: ["Packaged installable WordPress plugin", "Unit tests & code documentation", "Version upgrade hook setup"]
  },
  {
    idNumber: 18,
    title: "Headless CMS Architecture & Integration",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Decoupled content architecture pairing Strapi, Sanity, or Contentful with blistering-fast React/Next.js frontends.",
    demoSlug: "cms-blog",
    techStack: ["Strapi", "Sanity.io", "Next.js", "GraphQL", "Tailwind CSS"],
    problems: [
      "Monolithic CMS platforms struggle to distribute content to mobile apps and multiple sites.",
      "Frontend developers constrained by rigid backend CMS templating engines.",
      "CMS security breaches directly compromise the frontend presentation layer."
    ],
    features: [
      "Decoupled architecture: pure API backend + lightning-fast React frontend",
      "GraphQL and REST content distribution to web, mobile, and digital signage",
      "Rich editorial previews and draft visualization before publishing",
      "Static edge caching ensuring zero frontend vulnerability to backend attacks"
    ],
    deliverables: ["Headless CMS instance configuration", "React/Next.js frontend integration", "Content model schema definitions"]
  },
  {
    idNumber: 19,
    title: "Shopify CMS Setup & Customization",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Tailored Shopify architecture configured for high sales volume, custom Liquid sections, and seamless checkout.",
    demoSlug: "ecommerce-store",
    techStack: ["Shopify Liquid", "HTML5", "CSS3", "JavaScript", "Shopify Apps"],
    problems: [
      "Stock Shopify stores lack the unique polish needed to build brand equity.",
      "High cart abandonment caused by generic, unoptimized product page layouts.",
      "Messy app integrations causing sluggish mobile loading times."
    ],
    features: [
      "Custom Shopify 2.0 sections and modular drag-and-drop templates",
      "High-converting product detail pages with sticky CTAs and social proof",
      "Strategic app configuration eliminating conflicting redundant scripts",
      "Omnichannel inventory synchronization and payment gateway setup"
    ],
    deliverables: ["Fully customized Shopify store", "Liquid theme files", "Store launch checklist & staff training"]
  },
  {
    idNumber: 20,
    title: "WooCommerce Store Configuration",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Enterprise WooCommerce configurations engineered to handle thousands of SKUs and concurrent checkouts reliably.",
    demoSlug: "ecommerce-store",
    techStack: ["WooCommerce", "WordPress", "PHP", "MySQL", "Redis"],
    problems: [
      "WooCommerce slows to a crawl as product catalogs exceed a few thousand items.",
      "Checkout database locks during peak promotional flash sales.",
      "Inadequate tax and shipping rule calculation for multi-state merchants."
    ],
    features: [
      "High-performance WooCommerce setup with Redis object caching",
      "Custom checkout flow with streamlined one-page order placement",
      "Dynamic shipping rates and tax rule automation (GST/VAT)",
      "Automated stock level notifications and vendor invoice dispatch"
    ],
    deliverables: ["Optimized WooCommerce installation", "Payment gateway test report", "Performance caching config"]
  },
  {
    idNumber: 21,
    title: "Drupal & Joomla Web Solutions",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Complex content taxonomy management and enterprise governance for institutions, NGOs, and public sector bodies.",
    demoSlug: "cms-blog",
    techStack: ["Drupal", "Joomla", "PHP", "PostgreSQL", "Apache"],
    problems: [
      "Organizations with hundreds of editors struggle with unorganized content sprawl.",
      "Strict data privacy regulations requiring on-premise CMS hosting.",
      "Complex taxonomy and inter-departmental document relationships."
    ],
    features: [
      "Enterprise content modeling with multifaceted taxonomy tags",
      "Granular editorial permissions with revision rollback workflows",
      "High-security configurations compliant with institutional mandates",
      "Robust multisite management from a single centralized codebase"
    ],
    deliverables: ["Configured Drupal/Joomla portal", "Taxonomy mapping schema", "Administrator workflow guide"]
  },
  {
    idNumber: 22,
    title: "Custom Admin Panel & Dashboard Development",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Purpose-built management portals offering frictionless operational control over business data and assets.",
    demoSlug: "admin-dashboard",
    techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
    problems: [
      "Cluttered third-party admin panels overwhelm non-technical business staff.",
      "Lack of unified dashboards combining sales, leads, and content metrics.",
      "Security vulnerabilities when staff use raw database viewers."
    ],
    features: [
      "Clean, intuitive control panel tailored precisely to your operational workflow",
      "Real-time data visualization with interactive charts and KPI widgets",
      "Bulk data export/import capabilities (CSV, Excel, PDF)",
      "Comprehensive audit logging tracking every create, update, and delete action"
    ],
    deliverables: ["Custom admin dashboard frontend & backend", "Role-based authentication system", "Admin operations manual"]
  },
  {
    idNumber: 23,
    title: "Blog & News Publishing Platforms",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "High-traffic digital media platforms built for journalists, content creators, and corporate editorial teams.",
    demoSlug: "cms-blog",
    techStack: ["React.js", "Node.js", "Markdown", "MongoDB", "Cloudflare CDN"],
    problems: [
      "Media websites crashing under viral traffic spikes from social and Google Discover.",
      "Poor reader retention caused by intrusive ads and laggy reading layouts.",
      "Slow article publishing pipelines requiring technical assistance."
    ],
    features: [
      "Edge-cached content delivery handling 100k+ concurrent readers without lag",
      "Rich text visual editor with media embeds, syntax highlighting, and drafts",
      "Integrated social sharing, reading time indicators, and related articles",
      "Automated XML sitemaps and News schema markup for rapid search indexing"
    ],
    deliverables: ["Publishing platform application", "Editorial workflow setup", "RSS and News schema integration"]
  },
  {
    idNumber: 24,
    title: "Membership & Subscription Portal Setup",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Gated content platforms with automated recurring billing, tier-based access rights, and member directories.",
    demoSlug: "admin-dashboard",
    techStack: ["React.js", "Node.js", "Razorpay / Stripe", "MongoDB", "JWT"],
    problems: [
      "Manual tracking of recurring membership dues leading to revenue leakage.",
      "Unauthorized sharing of premium content due to lack of device session controls.",
      "Difficulties offering tiered subscription levels with varying privileges."
    ],
    features: [
      "Automated recurring subscription billing with automated invoice generation",
      "Paywall protection and gated content access controlled by active plan tiers",
      "Self-service member profile management and payment method updates",
      "Member discussion forums, event calendars, and community directory"
    ],
    deliverables: ["Membership platform codebase", "Payment gateway subscription webhooks", "Member onboarding guide"]
  },
  {
    idNumber: 25,
    title: "CMS Content Migration & Staff Training",
    categorySlug: "content-management-systems",
    categoryName: "Content Management Systems (CMS)",
    shortDescription: "Frictionless transfer of thousands of legacy articles and assets coupled with hands-on staff training workshops.",
    demoSlug: "cms-blog",
    techStack: ["Python ETL", "Node.js", "WordPress API", "JSON", "Video Tutorials"],
    problems: [
      "Risk of broken internal links, missing images, and lost author metadata.",
      "Staff intimidation and resistance when adopting unfamiliar content tools.",
      "SEO traffic crashes caused by altered URL slugs and unmapped redirects."
    ],
    features: [
      "Automated migration scripts preserving all article bodies, dates, and media",
      "Complete 301 URL redirect mapping ensuring zero lost SEO ranking",
      "Custom recorded video training walkthroughs for internal content creators",
      "Post-launch hand-holding support during initial publishing cycles"
    ],
    deliverables: ["Full data migration audit report", "Staff training video library", "CMS quick-start handbook"]
  }
];

// Helper to generate remaining services dynamically with deep technical authenticity
const categoryTemplates = {
  "ecommerce-solutions": {
    name: "E-Commerce Solutions",
    demoSlug: "ecommerce-store",
    techStack: ["Next.js", "React.js", "Node.js", "MongoDB", "Razorpay", "Tailwind CSS"],
    startId: 26,
    titles: [
      "Custom E-Commerce Storefront Development",
      "Shopify Theme & App Development",
      "Headless Shopify Commerce Builds",
      "Multi-Vendor Marketplace Development",
      "Payment Gateway Integration (Razorpay, Stripe, PayU, UPI)",
      "Shopping Cart & Checkout Flow Optimization",
      "Product Catalog & Inventory Management Systems",
      "Order Tracking & Logistics API Integration",
      "B2B Wholesale E-Commerce Portals",
      "Subscription Box & Recurring Billing Setup",
      "Abandoned Cart Recovery Automation",
      "E-Commerce Security & PCI Compliance",
      "Marketplace Listing & Feed Management"
    ]
  },
  "mobile-app-development": {
    name: "Mobile Application Development",
    demoSlug: "mobile-app",
    techStack: ["React Native", "Flutter", "Swift", "Kotlin", "Node.js", "Firebase"],
    startId: 39,
    titles: [
      "Native Android App Development (Kotlin/Java)",
      "Native iOS App Development (Swift)",
      "Cross-Platform App Development (Flutter)",
      "React Native Mobile App Development",
      "Enterprise Mobility & Field Force Apps",
      "On-Demand Delivery & Booking Apps",
      "E-Commerce & Retail Shopping Apps",
      "Healthcare & Telemedicine Mobile Apps",
      "EdTech & E-Learning Mobile Apps",
      "FinTech & Digital Wallet Applications",
      "App Store (iOS) & Play Store (Android) Deployment",
      "Mobile App Maintenance, Updates & Crash Analytics"
    ]
  },
  "custom-software-enterprise": {
    name: "Custom Software & Enterprise Solutions",
    demoSlug: "erp-software",
    techStack: ["Node.js", "Express.js", "React.js", "MongoDB", "PostgreSQL", "Docker"],
    startId: 51,
    titles: [
      "Custom Enterprise Resource Planning (ERP) Software",
      "Customer Relationship Management (CRM) Systems",
      "Inventory & Warehouse Management Software",
      "Supply Chain & Logistics Tracking Systems",
      "Manufacturing & Production Management Software",
      "Wholesale, Import-Export & Trading ERP",
      "Accounting, Billing & Invoicing Software",
      "Human Resource Management System (HRMS) & Payroll",
      "School, College & Institute Management Systems",
      "Hospital & Clinic Management Software",
      "Real Estate & Property Management Portals",
      "SaaS (Software-as-a-Service) Product Engineering",
      "Legacy Spreadsheet-to-Software Modernization"
    ]
  },
  "ai-machine-learning-automation": {
    name: "AI, Machine Learning & Automation",
    demoSlug: "ai-chatbot",
    techStack: ["Python", "TensorFlow", "Node.js", "LangChain", "OpenAI API", "FastAPI"],
    startId: 64,
    titles: [
      "Custom AI Customer Support Chatbots",
      "AI Sales & Lead Qualification Assistants",
      "WhatsApp & Web AI Bot Integration",
      "Business Workflow & Process Automation",
      "Automated Document Processing & OCR Pipelines",
      "Predictive Analytics & Demand Forecasting",
      "Recommendation Engines for E-Commerce",
      "AI Content & Knowledge Base Search Systems",
      "Automated Email & CRM Trigger Workflows",
      "Custom API & Webhook Integrations"
    ]
  },
  "cloud-devops-infrastructure": {
    name: "Cloud, DevOps & IT Infrastructure",
    demoSlug: "admin-dashboard",
    techStack: ["AWS", "Google Cloud", "Docker", "Kubernetes", "Linux", "Terraform", "GitHub Actions"],
    startId: 74,
    titles: [
      "Cloud Architecture Design (AWS, Google Cloud, Azure)",
      "Cloud Migration & Server Setup",
      "CI/CD Automated Deployment Pipelines",
      "Docker & Kubernetes Containerization",
      "Linux & Windows Server Administration",
      "Database Design, Optimization & Backup (SQL/NoSQL)",
      "Domain Registration & DNS Management",
      "Web Hosting & VPS Management",
      "SSL Certificate Installation & HTTPS Enforcement",
      "Website Malware Removal & Security Hardening",
      "Business Email Setup (Google Workspace / Microsoft 365)"
    ]
  },
  "digital-marketing-seo": {
    name: "Digital Marketing & SEO",
    demoSlug: "analytics-dashboard",
    techStack: ["Google Analytics 4", "Google Tag Manager", "SEMrush", "Google Ads", "Meta Ads Manager"],
    startId: 85,
    titles: [
      "Technical Search Engine Optimization (SEO)",
      "On-Page SEO & Schema Markup Implementation",
      "Off-Page SEO & Authority Link Building",
      "Local SEO & Google Business Profile Optimization",
      "Google Ads (Search, Display & Shopping Campaigns)",
      "Meta Ads (Facebook & Instagram Advertising)",
      "LinkedIn B2B Lead Generation Campaigns",
      "Pay-Per-Click (PPC) Campaign Management",
      "Social Media Management & Content Calendars",
      "Conversion Rate Optimization (CRO)",
      "Email Marketing & Newsletter Campaigns",
      "Bulk SMS & Enterprise Messaging Solutions",
      "Google Analytics 4 (GA4) & Tag Manager Tracking"
    ]
  },
  "ui-ux-design-branding": {
    name: "UI/UX Design & Branding",
    demoSlug: "corporate-website",
    techStack: ["Figma", "Adobe Creative Suite", "Illustrator", "After Effects", "Design Systems"],
    startId: 98,
    titles: [
      "User Experience (UX) Research & User Journey Mapping",
      "Wireframing & Interactive Prototyping (Figma)",
      "User Interface (UI) Design for Web & Mobile",
      "Design Systems & Component Libraries",
      "Logo Design & Brand Identity Guidelines",
      "Corporate Stationery & Brochure Design",
      "Social Media Creative & Ad Banner Design",
      "Product Packaging & Label Mockups",
      "Pitch Deck & Presentation Design",
      "Infographic & Data Visualization Design",
      "Explainer Video & Motion Graphics Production"
    ]
  }
};

// Generate full array
const allServices = [...rawServicesList];

for (const [catSlug, catData] of Object.entries(categoryTemplates)) {
  catData.titles.forEach((title, idx) => {
    const idNumber = catData.startId + idx;
    
    // Choose appropriate demo
    let demoSlug = catData.demoSlug;
    if (title.includes("Marketplace")) demoSlug = "multi-vendor-marketplace";
    if (title.includes("Billing") || title.includes("Invoicing") || title.includes("Accounting") || title.includes("Payment Gateway")) demoSlug = "invoice-billing";
    if (title.includes("CRM") || title.includes("Lead")) demoSlug = "crm-software";
    if (title.includes("HRMS") || title.includes("Payroll")) demoSlug = "hrms-software";
    if (title.includes("School") || title.includes("Education")) demoSlug = "school-management";
    if (title.includes("Hospital") || title.includes("Clinic") || title.includes("Telemedicine")) demoSlug = "hospital-management";
    if (title.includes("Delivery") || title.includes("Restaurant")) demoSlug = "restaurant-management";
    if (title.includes("Real Estate") || title.includes("Property")) demoSlug = "real-estate-portal";
    if (title.includes("Travel") || title.includes("Booking")) demoSlug = "travel-booking";
    if (title.includes("Chatbot") || title.includes("Bot") || title.includes("AI Sales")) demoSlug = "ai-chatbot";
    if (title.includes("Analytics") || title.includes("SEO") || title.includes("Ads") || title.includes("Tracking")) demoSlug = "analytics-dashboard";
    if (title.includes("Inventory") || title.includes("Warehouse")) demoSlug = "inventory-management";
    if (title.includes("Workflow") || title.includes("Automation") || title.includes("CI/CD")) demoSlug = "automation-workflow";
    if (title.includes("Mobile") || title.includes("Android") || title.includes("iOS") || title.includes("Flutter") || title.includes("React Native")) demoSlug = "mobile-app";
    if (title.includes("Landing") || title.includes("CRO")) demoSlug = "landing-page";

    // Create unique slug
    const slug = title
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    allServices.push({
      idNumber,
      title,
      slug,
      categorySlug: catSlug,
      categoryName: catData.name,
      shortDescription: `Professional ${title} engineered by Vishwakarma Web Private Limited to accelerate operational efficiency, strengthen digital capability, and deliver measurable ROI.`,
      overview: `At Vishwakarma Web Private Limited, our ${title} service combines deep domain intelligence, robust engineering standards, and enterprise-grade execution. We partner with fast-growing startups and established corporations to design, develop, and deploy solutions that are scalable, secure, and aligned with commercial goals.`,
      businessProblemsSolved: [
        `Eliminates operational bottlenecks associated with manual, unstandardized processes.`,
        `Addresses fragmented customer data and improves overall digital engagement touchpoints.`,
        `Mitigates technical debt by replacing brittle legacy workarounds with modern, maintainable architecture.`
      ],
      features: [
        `Enterprise-grade architecture adhering to industry compliance and security standards`,
        `Intuitive user interface focused on high adoption and minimal user training`,
        `Modular microservices and RESTful API endpoints for seamless third-party connectivity`,
        `Comprehensive performance monitoring, error logging, and high availability`
      ],
      developmentApproach: [
        `Phase 1: Discovery, requirement analysis, and architectural scoping`,
        `Phase 2: Interactive UI/UX prototyping and client alignment`,
        `Phase 3: Agile development sprints with bi-weekly milestone demonstrations`,
        `Phase 4: Rigorous quality assurance, automated security testing, and production deployment`
      ],
      techStack: catData.techStack,
      deliverables: [
        `Complete source code repository with comprehensive documentation`,
        `Production-deployed application or assets with cloud configuration`,
        `Administrator training manual and operational runbook`,
        `Post-launch warranty and technical support period`
      ],
      demoSlug,
      faqs: [
        {
          question: `What is the estimated timeline for delivering ${title}?`,
          answer: `Depending on project scope and custom integration requirements, typical timelines range from 2 to 6 weeks. We provide an exact project milestone schedule during our initial discovery consultation.`
        },
        {
          question: `Can this solution be integrated with our existing business systems?`,
          answer: `Yes. All solutions developed by Vishwakarma Web Private Limited are engineered with modern API connectivity to integrate cleanly with your existing ERP, CRM, databases, and payment processors.`
        },
        {
          question: `Do we own the full intellectual property (IP) and source code?`,
          answer: `Absolutely. Upon project completion and milestone signoff, 100% of all intellectual property, source code, and design assets are formally transferred to your company.`
        }
      ],
      active: true,
      featured: idNumber % 12 === 1
    });
  });
}

// Generate slugs for the first 25 items as well
for (let i = 0; i < 25; i++) {
  const item = allServices[i];
  if (!item.slug) {
    item.slug = item.title
      .toLowerCase()
      .replace(/[()]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  if (!item.overview) {
    item.overview = `At Vishwakarma Web Private Limited, our ${item.title} service delivers state-of-the-art technical architecture, human-centric design, and reliable performance tailored to your strategic goals.`;
  }
  if (!item.faqs) {
    item.faqs = [
      {
        question: `How does Vishwakarma Web approach ${item.title}?`,
        answer: `We utilize our 7-step development methodology starting with discovery, technical scoping, UX wireframing, sprint-based coding, testing, deployment, and ongoing SLA maintenance.`
      },
      {
        question: `Can we request custom modifications after deployment?`,
        answer: `Yes, we provide flexible ongoing maintenance retainers and agile sprints to continuously enhance and scale your solution.`
      }
    ];
  }
  if (!item.businessProblemsSolved) {
    item.businessProblemsSolved = item.problems || [
      "Inefficient manual workflows causing operational slowdowns.",
      "Inability to scale digital systems alongside business expansion.",
      "Poor user engagement resulting from outdated legacy interfaces."
    ];
  }
  if (!item.developmentApproach) {
    item.developmentApproach = [
      "1. Discovery & Consultation",
      "2. Requirement Analysis & UI/UX Wireframing",
      "3. Agile Development & Code Review",
      "4. QA Testing, Deployment & 24/7 Support"
    ];
  }
  item.active = true;
  item.featured = item.idNumber % 12 === 1;
}

console.log(`Generated all ${allServices.length} services!`);

// Write to files
const outputPathServer = path.join(__dirname, "all108Services.json");
fs.writeFileSync(outputPathServer, JSON.stringify(allServices, null, 2));

const clientDataDir = path.resolve(__dirname, "../../client/src/data");
if (!fs.existsSync(clientDataDir)) {
  fs.mkdirSync(clientDataDir, { recursive: true });
}
const outputPathClient = path.join(clientDataDir, "all108Services.json");
fs.writeFileSync(outputPathClient, JSON.stringify(allServices, null, 2));

console.log(`Saved to ${outputPathServer} and ${outputPathClient}`);
