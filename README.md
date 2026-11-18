# Vishwakarma Web Private Limited – Full-Stack Enterprise Platform

A complete, production-ready corporate website and SaaS digital solutions suite built for **Vishwakarma Web Private Limited**. Built with React, Tailwind CSS, Express, and MongoDB.

---

## 🌟 Key Highlights

- **Brand Identity & Design System**:
  - Exact brand colors: Primary Blue (`#0756A5`), Deep Navy (`#082B59`), Primary Orange (`#FF6900`), Secondary Orange (`#FF8A00`), Soft Background (`#F5F8FC`), Dark Accent (`#071426`).
  - Preserved original vector/raster company logo across Sticky Navbar, Footer, Favicon, and System Modals.
  - Subtle glassmorphism, crisp typography, and responsive micro-interactions.
- **100% WebSocket-Free Architecture**:
  - Pure RESTful APIs with polling, optimistic updates, and clean HTTP lifecycle.
- **Complete 108 Services Directory**:
  - Organized across **9 major service categories**.
  - Searchable, filterable, and deep-linked with dedicated detail pages (`/services/:categorySlug/:serviceSlug`) outlining problems solved, deliverables, technical stacks, development approaches, and FAQs.
- **20 Fully Functional Interactive Live Demos**:
  - Live sandbox environments for enterprise products with state simulation, actions, filters, and reset capabilities.
- **Project Cost Estimator & Quote Engine**:
  - Interactive pricing & cost calculator with step-by-step selection for project type, platforms, design tier, features, and timeline with instant lead capture (`/api/quotes/submit`).
- **Comprehensive Admin Suite & Lead Management**:
  - Role-based admin portal with JWT authentication, dashboard analytics, service CRUD management, and lead tracking.

---

## 🏢 9 Service Categories & All 108 Services

1. **Website Design & Development (Services 1–15)**: Custom Business Websites, Corporate Websites, Mobile-First Web Design, SPAs, PWAs, Landing Pages, Portfolios, Multi-Language, Modernization, Core Web Vitals, WCAG Audits, Migrations, Web Portals, Ongoing Maintenance.
2. **Content Management Systems (CMS) (Services 16–25)**: Custom WordPress Themes & Plugins, Headless CMS, Shopify CMS, WooCommerce, Drupal/Joomla, Custom Admin Panels, Publishing Platforms, Membership Portals, CMS Migration.
3. **E-Commerce Solutions (Services 26–38)**: Custom Storefronts, Shopify Themes/Apps, Headless Commerce, Multi-Vendor Marketplaces, Payment Gateway Integrations (Razorpay, Stripe, UPI), Checkout Flow Optimization, Inventory Systems, Order Tracking, B2B Wholesale Portals, Subscription Billing, Abandoned Cart Recovery, PCI Compliance.
4. **Mobile Application Development (Services 39–50)**: Native Android (Kotlin), Native iOS (Swift), Flutter, React Native, Enterprise Mobility, On-Demand Delivery & Booking, Healthcare/Telemedicine, EdTech Apps, FinTech & Digital Wallets, App Store/Play Store Deployment, App Crash Analytics & Maintenance.
5. **Custom Software & Enterprise Solutions (Services 51–63)**: Custom ERP, CRM Systems, Inventory & Warehouse Software, Supply Chain Tracking, Manufacturing & Production ERP, Wholesale & Trading ERP, Accounting & Invoicing, HRMS & Payroll, School/College Management, Hospital & Clinic Systems, Real Estate Portals, SaaS Engineering, Legacy Modernization.
6. **AI, Machine Learning & Automation (Services 64–73)**: Custom AI Support Chatbots, AI Sales & Lead Qualification, WhatsApp & Web AI Bots, Business Workflow Automation, OCR Pipelines, Predictive Analytics, Recommendation Engines, AI Knowledge Base Search, Automated CRM Triggers, Webhooks & Custom APIs.
7. **Cloud, DevOps & IT Infrastructure (Services 74–84)**: Cloud Architecture (AWS, GCP, Azure), Cloud Migration, CI/CD Automated Pipelines, Docker & Kubernetes Containerization, Server Administration, Database Design & Backups, Domain & DNS Management, VPS Hosting, SSL/HTTPS Security, Malware Removal, Google Workspace/M365 Setup.
8. **Digital Marketing & SEO (Services 85–96)**: Technical SEO, On-Page SEO, Off-Page Link Building, Local SEO & GMB, Google Ads, Meta Ads, LinkedIn B2B Lead Gen, PPC Campaigns, Social Media Calendars, Conversion Rate Optimization (CRO), Email Marketing, Analytics & Attribution.
9. **UI/UX Design, Branding & Creative (Services 97–108)**: UI/UX Audits, Wireframing & Prototyping, Mobile App UX, Website Redesigns, Design Systems & Component Libraries, Corporate Brand Identity, Logo Design, Pitch Decks, Iconography, Marketing Creatives, Micro-Interactions, Usability Testing.

---

## 🚀 20 Functional Interactive Live Demos

| # | Demo Title | Route | Description & Key Features |
|---|---|---|---|
| 1 | **Corporate Website** | `/live-demos/corporate-website` | Hero carousel, capability filters, interactive contact modal |
| 2 | **E-Commerce Storefront** | `/live-demos/ecommerce-store` | Category filters, real-time cart drawer, instant checkout simulation |
| 3 | **Multi-Vendor Marketplace** | `/live-demos/marketplace` | Multi-vendor product browsing, store filter, mock checkout |
| 4 | **CRM Software** | `/live-demos/crm-software` | Pipeline stages, drag-and-drop lead status movement, deal summary |
| 5 | **Enterprise ERP** | `/live-demos/erp-system` | Financials, procurement, inventory tracking, KPI charts |
| 6 | **HRMS & Payroll** | `/live-demos/hrms-payroll` | Employee directory, leave requests approval/rejection, payroll disbursement simulation |
| 7 | **School Management System** | `/live-demos/school-management` | Students list, attendance marker, fee status ledger |
| 8 | **Hospital & Clinic Portal** | `/live-demos/hospital-clinic` | Patient directory, doctor appointment booking scheduler |
| 9 | **Restaurant Online Ordering** | `/live-demos/restaurant-ordering` | Menu categories, add-ons, table/takeout order simulation |
| 10 | **Real Estate Portal** | `/live-demos/real-estate` | Property listings, bedroom/price filter, schedule viewing modal |
| 11 | **Travel & Tour Booking** | `/live-demos/travel-booking` | Tour packages, booking modal, itinerary inspector |
| 12 | **AI Support Chatbot** | `/live-demos/ai-chatbot` | Interactive simulated AI conversation, intent replies, prompt suggestions |
| 13 | **Analytics & Business Intelligence** | `/live-demos/analytics-bi` | Interactive date range toggle, revenue & traffic metrics, visual bar charts |
| 14 | **Inventory & Warehouse System** | `/live-demos/inventory-warehouse` | Stock level trackers, restock triggers, warehouse locations |
| 15 | **Invoice & Billing Generator** | `/live-demos/invoice-billing` | Line item additions, tax calculations, instant printable preview |
| 16 | **Admin Dashboard** | `/live-demos/admin-dashboard` | Full system overview, quick stats, customer table, system logs |
| 17 | **Mobile App Simulator** | `/live-demos/mobile-app` | Interactive smartphone device frame with tabbed iOS/Android mock screens |
| 18 | **High-Converting Landing Page** | `/live-demos/landing-page` | Hero countdown, social proof, lead capture form |
| 19 | **CMS & Blog Platform** | `/live-demos/cms-blog` | Dynamic article reader, tag filter, comment simulation |
| 20 | **Automation & Workflow Engine** | `/live-demos/automation-workflows` | Visual node trigger/action pipeline, test execution simulation |

---

## 🛠️ Tech Stack & Directory Structure

```
vishwakarma_pvt_ltd/
├── client/                     # Frontend (React 18 + Tailwind CSS + Lucide Icons)
│   ├── public/                 # Favicon, logo assets, index.html with SEO JSON-LD
│   └── src/
│       ├── Assets/             # Official company logo files
│       ├── components/
│       │   ├── common/         # CompanyNavbar (MegaMenu), CompanyFooter, Floating WhatsApp
│       │   └── AdminComponents/# Service CRUD modals, stats widgets
│       ├── data/               # Seeded JSON catalog for 108 services & 20 demos
│       ├── routes/             # AllRoutes.js, UserLayout.jsx, AdminLayout.jsx
│       └── screens/
│           ├── users/          # Home, About, ServicesDirectory, ServiceDetail,
│           │                   # Industries, Portfolio, Pricing, Contact, RequestQuote, Policies
│           ├── demos/          # 20 Interactive live demo components + DemoLayout
│           ├── auth/           # Admin Dashboard, Services CRUD, Leads, Profile
│           └── nonAuth/        # Login screen with credentials helper
└── server/                     # Backend (Node.js + Express + MongoDB Mongoose)
    ├── config/                 # db.js (Atlas MongoDB with fallback & Google DNS resolver)
    ├── controllers/            # service, demo, inquiry, quote, portfolio, blog, user
    ├── middleware/             # auth.middleware.js (JWT verify + RBAC)
    ├── models/                 # Mongoose schemas for all entities
    ├── routes/                 # REST routes
    └── seed/                   # seed.js (populates all 108 services, 9 categories, 20 demos, master admin)
```

---

## 🔐 Default Admin Credentials

- **URL**: `http://localhost:3000/login`
- **Email**: `admin@vishwakarmaweb.com` *(or phone: `9876543210`)*
- **Password**: `adminpassword123`
- **Role**: Super Admin

---

## ⚙️ Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas or local MongoDB instance

### 2. Backend Setup
```bash
cd server
npm install
node seed/seed.js   # Seeds 108 services, 9 categories, 20 demos, and initial admin
node app.js         # Starts server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install --legacy-peer-deps
npm start           # Starts dev server on http://localhost:3000
```

### 4. Build for Production
```bash
cd client
npm run build
```
