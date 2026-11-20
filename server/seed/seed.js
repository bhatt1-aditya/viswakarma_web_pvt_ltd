import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

// Models
import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import ServiceCategory from "../models/serviceCategory.model.js";
import Service from "../models/service.model.js";
import Demo from "../models/demo.model.js";
import WebsiteSettings from "../models/websiteSettings.model.js";
import Portfolio from "../models/portfolio.model.js";
import Blog from "../models/blog.model.js";
import Testimonial from "../models/testimonial.model.js";
import { categoriesData, demosData } from "./servicesData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// DNS resolution fix for MongoDB Atlas SRV
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) { }

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected successfully to DB!");

    // 1. Roles & Admin User
    console.log("Seeding Roles and Admin user...");
    let adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      adminRole = await Role.create({ name: "admin" });
    }
    let staffRole = await Role.findOne({ name: "staff" });
    if (!staffRole) {
      staffRole = await Role.create({ name: "staff" });
    }

    const existingAdmin = await User.findOne({ email: "admin@vishwakarmaweb.com" });
    if (!existingAdmin) {
      await User.create({
        name: "Vishwakarma Web Administrator",
        email: "admin@vishwakarmaweb.com",
        phone: "9876543210",
        password: "adminpassword123", // Single hashed automatically by userSchema pre-save hook
        role: adminRole._id,
        permissions: {
          sidebar: {
            dashboard: true,
            leads: true,
            staff: true,
            projects: true,
          },
          buttons: {
            leads: { add: true, edit: true, delete: true, assign: true },
            staff: { add: true, edit: true, delete: true },
            projects: { add: true, view: true, edit: true, delete: true },
          },
        },
      });
      console.log("Created master Admin: admin@vishwakarmaweb.com / adminpassword123");
    }

    // 2. Service Categories
    console.log("Seeding Service Categories...");
    await ServiceCategory.deleteMany({});
    await ServiceCategory.insertMany(categoriesData);
    console.log(`Seeded ${categoriesData.length} categories.`);

    // 3. All 108 Services
    console.log("Seeding All 108 Services...");
    const servicesFilePath = path.join(__dirname, "all108Services.json");
    const servicesRaw = fs.readFileSync(servicesFilePath, "utf8");
    const allServices = JSON.parse(servicesRaw);

    await Service.deleteMany({});
    await Service.insertMany(allServices);
    console.log(`Seeded ${allServices.length} services successfully.`);

    // 4. All 20 Demos
    console.log("Seeding All 20 Live Demos...");
    await Demo.deleteMany({});
    await Demo.insertMany(demosData);
    console.log(`Seeded ${demosData.length} live demos.`);

    // 5. Website Settings
    console.log("Seeding Website Settings...");
    await WebsiteSettings.deleteMany({});
    await WebsiteSettings.create({
      companyName: "Vishwakarma Web Private Limited",
      tagline: "Transforming Ideas Into Powerful Digital Experiences",
      email: "vishwakarmawebprivatelimited@gmail.com",
      phone: "+91 70775 60648",
      whatsapp: "+91 70775 60648",
      address: "Odisha Balangir Bandabahal Main Road Bus Station Pande Computer, 767022",
      workingHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
      socialLinks: {
        linkedin: "https://linkedin.com/company/vishwakarmaweb",
        twitter: "https://twitter.com/vishwakarmaweb",
        facebook: "https://facebook.com/vishwakarmaweb",
        instagram: "https://instagram.com/vishwakarmaweb",
        github: "https://github.com/vishwakarmaweb",
      },
      seo: {
        metaTitle: "Vishwakarma Web Private Limited – Full-Service IT & Digital Solutions",
        metaDescription: "Innovative software, web, mobile, AI, and digital solutions engineered for enterprise scale and startup agility.",
        keywords: [
          "Vishwakarma Web",
          "IT Services",
          "Software Development",
          "AI Automation",
          "Custom ERP",
          "Web Development",
          "Mobile Apps",
        ],
      },
    });

    // 6. Portfolio Case Studies
    console.log("Seeding Portfolio Case Studies...");
    await Portfolio.deleteMany({});
    await Portfolio.insertMany([
      {
        title: "Omnichannel B2B & B2C Marketplace Engine",
        slug: "omnichannel-b2b-b2c-marketplace",
        category: "E-Commerce Solutions",
        clientIndustry: "Wholesale & Retail Commerce",
        summary: "Multi-vendor digital commerce architecture capable of handling 20,000+ daily orders with real-time multi-warehouse dispatch.",
        description: "Engineered a decoupled headless marketplace powered by Next.js and high-throughput Node.js microservices. Integrated real-time logistics sync, automated vendor commission settlement, and multi-gateway payment fallback.",
        techStack: ["Next.js", "Node.js", "MongoDB", "Redis", "Razorpay", "Docker"],
        deliverables: ["Customer PWA Storefront", "Vendor Seller Portal", "Central Logistics Dispatch Hub", "Automated Billing Engine"],
        results: ["340% increase in checkout speed", "99.98% uptime during festive peak sale", "Zero inventory overselling"],
        liveUrl: "/live-demos/multi-vendor-marketplace",
        demoUrl: "/live-demos/multi-vendor-marketplace",
        featured: true,
        order: 1,
      },
      {
        title: "Cloud Enterprise ERP & Supply Chain Modernization",
        slug: "cloud-enterprise-erp-supply-chain",
        category: "Custom Software & Enterprise Solutions",
        clientIndustry: "Industrial Manufacturing",
        summary: "End-to-end manufacturing execution and supply chain visibility suite replacing 15 years of legacy spreadsheets.",
        description: "Designed a centralized enterprise resource planning suite connecting raw material procurement, assembly line floor tracking, warehouse inventory balances, and GST financial accounting into one unified interface.",
        techStack: ["React.js", "Node.js", "PostgreSQL", "Docker", "Tailwind CSS"],
        deliverables: ["Shopfloor Tablet Interface", "Procurement Approval Matrix", "Executive BI Analytics Dashboard"],
        results: ["45% reduction in production downtime", "Full inventory traceability across 4 facilities", "Real-time cost variance reporting"],
        liveUrl: "/live-demos/erp-software",
        demoUrl: "/live-demos/erp-software",
        featured: true,
        order: 2,
      },
      {
        title: "Telemedicine & Smart Clinical Consultation Mobile App",
        slug: "telemedicine-smart-clinical-app",
        category: "Mobile Application Development",
        clientIndustry: "Healthcare",
        summary: "HIPAA-compliant doctor consultation, e-prescription generation, and integrated diagnostic lab booking mobile suite.",
        description: "Built native iOS and Android apps with secure WebRTC encrypted video calling, appointment slot algorithms, and digital health record vaults for outpatient healthcare groups.",
        techStack: ["Flutter", "WebRTC", "Node.js", "MongoDB", "AWS S3"],
        deliverables: ["Patient Mobile App (iOS & Android)", "Doctor Consultation Tablet App", "Clinic Reception Management Desk"],
        results: ["Over 25,000 consultations completed", "4.8/5 App Store customer satisfaction score", "Average patient wait time reduced by 60%"],
        liveUrl: "/live-demos/hospital-management",
        demoUrl: "/live-demos/hospital-management",
        featured: true,
        order: 3,
      },
      {
        title: "Autonomous AI Customer Service & Sales Assistant",
        slug: "autonomous-ai-customer-service-agent",
        category: "AI, Machine Learning & Automation",
        clientIndustry: "Financial Services & SaaS",
        summary: "Context-aware conversational AI agent answering 80% of inbound customer queries and qualifying sales leads round-the-clock.",
        description: "Integrated a fine-tuned LLM retrieval-augmented generation (RAG) agent across web chat and WhatsApp, allowing instant policy quote estimations, document verification, and CRM lead pipeline injection.",
        techStack: ["Python", "FastAPI", "LangChain", "Vector DB", "React.js", "WhatsApp Business API"],
        deliverables: ["Omnichannel AI Chat Widget", "Knowledge Base Ingestion Pipeline", "CRM Lead Sync Webhook"],
        results: ["78% first-contact resolution without human intervention", "Sub-second response time", "24/7 lead qualification increase of 52%"],
        liveUrl: "/live-demos/ai-chatbot",
        demoUrl: "/live-demos/ai-chatbot",
        featured: true,
        order: 4,
      },
      {
        title: "High-Performance Institutional Real Estate Portal",
        slug: "institutional-real-estate-portal",
        category: "Custom Software & Enterprise Solutions",
        clientIndustry: "Real Estate & Commercial Infrastructure",
        summary: "Modern property discovery platform with interactive virtual tour booking, mortgage calculators, and lead attribution.",
        description: "Developed a property discovery experience featuring interactive neighborhood mapping, instant PDF brochure generation, dynamic lead routing to assigned brokers, and WhatsApp consultation triggers.",
        techStack: ["React.js", "Tailwind CSS", "Node.js", "Express.js", "MongoDB"],
        deliverables: ["Public Listing Portal", "Broker Lead Assignment Dashboard", "Virtual Tour Viewer"],
        results: ["62% increase in scheduled property walkthroughs", "100% lead capture speed under 2 minutes", "Zero slow-loading asset lag"],
        liveUrl: "/live-demos/real-estate-portal",
        demoUrl: "/live-demos/real-estate-portal",
        featured: true,
        order: 5,
      },
      {
        title: "Automated Corporate HRMS & Biometric Payroll",
        slug: "automated-corporate-hrms-payroll",
        category: "Custom Software & Enterprise Solutions",
        clientIndustry: "Professional Corporate Services",
        summary: "Automated personnel lifecycle system connecting biometric shift punches with statutory salary deductions and leave balances.",
        description: "A centralized employee dashboard facilitating self-service attendance corrections, manager approval chains, reimbursement filing, and instant tax-compliant payslip generation.",
        techStack: ["React.js", "Node.js", "Express.js", "MongoDB", "PDFKit"],
        deliverables: ["Employee Self-Service Portal", "HR Admin Payroll Console", "Automated Salary Slip Generator"],
        results: ["Payroll processing time dropped from 4 days to 20 minutes", "100% compliance with local statutory mandates"],
        liveUrl: "/live-demos/hrms-software",
        demoUrl: "/live-demos/hrms-software",
        featured: true,
        order: 6,
      },
    ]);
    console.log("Seeded 6 featured portfolio case studies.");

    // 7. Testimonials
    console.log("Seeding Testimonials...");
    await Testimonial.deleteMany({});
    await Testimonial.insertMany([
      {
        clientName: "Rajesh Sharma",
        clientRole: "Managing Director",
        company: "Apex Global Logistics",
        content: "Vishwakarma Web Private Limited delivered our logistics ERP on time and within scope. The operational visibility and speed they brought to our nationwide tracking system has been transformative.",
        rating: 5,
        active: true,
      },
      {
        clientName: "Ananya Deshmukh",
        clientRole: "Chief Technology Officer",
        company: "Nexus Health Systems",
        content: "The level of engineering rigor and architectural clarity provided by Vishwakarma Web is world-class. Our telemedicine platform runs flawlessly across thousands of daily appointments.",
        rating: 5,
        active: true,
      },
      {
        clientName: "Vikram Malhotra",
        clientRole: "Founder & CEO",
        company: "UrbanKart Wholesale",
        content: "From the initial Figma design sprints to the high-throughput payment gateway rollout, the team demonstrated total mastery over full-stack technology.",
        rating: 5,
        active: true,
      },
    ]);
    console.log("Seeded testimonials.");

    // 8. Blogs
    console.log("Seeding Blogs...");
    await Blog.deleteMany({});
    await Blog.insertMany([
      {
        title: "Architecting Resilient Microservices for High-Traffic E-Commerce",
        slug: "architecting-resilient-microservices-ecommerce",
        category: "E-Commerce Solutions",
        excerpt: "Key architectural patterns for preventing database locks, ensuring payment idempotency, and scaling checkout pipelines during flash sales.",
        content: "Modern digital commerce systems require extreme fault tolerance. In this article, we explore how decoupling frontend presentation with React and implementing asynchronous message queues with Redis prevents checkout downtime.",
        author: "Vishwakarma Technical Architecture Group",
        readTime: "7 min read",
        tags: ["Architecture", "E-Commerce", "Scalability", "Microservices"],
        published: true,
      },
      {
        title: "The Strategic ROI of Migrating Legacy ERPs to Cloud-Native Web Stacks",
        slug: "strategic-roi-migrating-legacy-erp-cloud-native",
        category: "Custom Software & Enterprise Solutions",
        excerpt: "Why forward-looking enterprises are retiring monolithic desktop software in favor of responsive, secure web-based operational hubs.",
        content: "Legacy software creates severe business risk: data silos, lack of mobile access, and steep security vulnerabilities. Migrating to modern web technologies unlocks real-time operational analytics and seamless API connectivity.",
        author: "Enterprise Solutions Advisory",
        readTime: "6 min read",
        tags: ["ERP", "Cloud", "Modernization", "Enterprise"],
        published: true,
      },
      {
        title: "Implementing Production AI Agents: Beyond Simple Chatbots",
        slug: "implementing-production-ai-agents-beyond-chatbots",
        category: "AI, Machine Learning & Automation",
        excerpt: "A practical guide to connecting LLMs to internal databases and APIs using Retrieval-Augmented Generation (RAG) and deterministic validation.",
        content: "Enterprise AI delivers real value when it moves from generic text generation to actionable business tasks: generating invoices, scheduling appointments, and querying CRM pipelines with strict guardrails.",
        author: "AI Research & Automation Team",
        readTime: "8 min read",
        tags: ["AI", "Automation", "LLM", "Business Workflows"],
        published: true,
      },
    ]);
    console.log("Seeded technical blogs.");

    console.log("✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
