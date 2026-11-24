import React from "react";
import { Navigate } from "react-router-dom";

// Auth & Admin Screens
import Login from "../screens/nonAuth/Login";
import Register from "../screens/nonAuth/Register";
import ForgotPassword from "../screens/nonAuth/ForgotPassword";
import Dashboard from "../screens/auth/Dashboard";
import Staff from "../screens/auth/Staff";
import Telecaller from "../screens/auth/Telecaller";
import HomeControl from "../screens/auth/HomeControl";
import AboutControl from "../screens/auth/AboutControl";
import ServicesControl from "../screens/auth/ServicesControl";
import IndustriesControl from "../screens/auth/IndustriesControl";
import PortfolioControl from "../screens/auth/PortfolioControl";
import PricingControl from "../screens/auth/PricingControl";
import Profile from "../screens/auth/Profile";

// Enterprise Client Project Lifecycle Dashboards & Workspaces
import ProjectManagerDashboard from "../screens/dashboards/ProjectManagerDashboard";
import DeveloperDashboard from "../screens/dashboards/DeveloperDashboard";
import QADashboard from "../screens/dashboards/QADashboard";
import ClientPortal from "../screens/dashboards/ClientPortal";
import DealManagement from "../screens/auth/DealManagement";
import ProjectWorkspace from "../screens/projects/ProjectWorkspace";

// Public User Screens
import Home from "../screens/users/Home";
import AboutUs from "../screens/users/AboutUs";
import ServicesDirectory from "../screens/users/ServicesDirectory";
import ServiceDetail from "../screens/users/ServiceDetail";
import Industries from "../screens/users/Industries";
import LiveDemosCenter from "../screens/users/LiveDemosCenter";
import Portfolio from "../screens/users/Portfolio";
import Pricing from "../screens/users/Pricing";
import Contact from "../screens/users/Contact";
import RequestQuote from "../screens/users/RequestQuote";
import PrivacyPolicy from "../screens/users/PrivacyPolicy";
import Terms from "../screens/users/Terms";
import RefundPolicy from "../screens/users/RefundPolicy";

// 20 Interactive Live Demos
import DemoCorporateWebsite from "../screens/demos/DemoCorporateWebsite";
import DemoEcommerceStore from "../screens/demos/DemoEcommerceStore";
import DemoMarketplace from "../screens/demos/DemoMarketplace";
import DemoCRM from "../screens/demos/DemoCRM";
import DemoERP from "../screens/demos/DemoERP";
import DemoHRMS from "../screens/demos/DemoHRMS";
import DemoSchool from "../screens/demos/DemoSchool";
import DemoHospital from "../screens/demos/DemoHospital";
import DemoRestaurant from "../screens/demos/DemoRestaurant";
import DemoRealEstate from "../screens/demos/DemoRealEstate";
import DemoTravel from "../screens/demos/DemoTravel";
import DemoAIChatbot from "../screens/demos/DemoAIChatbot";
import DemoAnalytics from "../screens/demos/DemoAnalytics";
import DemoInventory from "../screens/demos/DemoInventory";
import DemoInvoiceBilling from "../screens/demos/DemoInvoiceBilling";
import DemoAdminDashboard from "../screens/demos/DemoAdminDashboard";
import DemoMobileApp from "../screens/demos/DemoMobileApp";
import DemoLandingPage from "../screens/demos/DemoLandingPage";
import DemoCMSBlog from "../screens/demos/DemoCMSBlog";
import DemoAutomationWorkflow from "../screens/demos/DemoAutomationWorkflow";

export const authRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/admin", component: <Dashboard /> },
  { path: "/telecaller", component: <Telecaller /> },
  { path: "/deals", component: <DealManagement /> },
  { path: "/pm-dashboard", component: <ProjectManagerDashboard /> },
  { path: "/developer-dashboard", component: <DeveloperDashboard /> },
  { path: "/qa-dashboard", component: <QADashboard /> },
  { path: "/client-portal", component: <ClientPortal /> },
  { path: "/projects/:id", component: <ProjectWorkspace /> },
  { path: "/project-workspace/:id", component: <ProjectWorkspace /> },
  { path: "/home-control", component: <HomeControl /> },
  { path: "/about-control", component: <AboutControl /> },
  { path: "/services-control", component: <ServicesControl /> },
  { path: "/services-admin", component: <ServicesControl /> },
  { path: "/industries-control", component: <IndustriesControl /> },
  { path: "/industries-admin", component: <IndustriesControl /> },
  { path: "/portfolio-control", component: <PortfolioControl /> },
  { path: "/portfolio-admin", component: <PortfolioControl /> },
  { path: "/pricing-control", component: <PricingControl /> },
  { path: "/pricing-admin", component: <PricingControl /> },
  { path: "/staff", component: <Staff /> },
  { path: "/profile", component: <Profile /> },
  // Lead and Projects redirects
  { path: "/lead", component: <Navigate to="/dashboard" replace /> },
  { path: "/projects", component: <Navigate to="/pm-dashboard" replace /> },
];

export const nonAuthRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/admin/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
];

export const userRoutes = [
  // Core Corporate Pages
  { path: "/", component: <Home /> },
  { path: "/about", component: <AboutUs /> },
  { path: "/services", component: <ServicesDirectory /> },
  { path: "/services/:categorySlug/:serviceSlug", component: <ServiceDetail /> },
  { path: "/service/:serviceSlug", component: <ServiceDetail /> },
  { path: "/industries", component: <Industries /> },
  { path: "/live-demos", component: <LiveDemosCenter /> },
  { path: "/portfolio", component: <Portfolio /> },
  { path: "/pricing", component: <Pricing /> },
  { path: "/contact", component: <Contact /> },
  { path: "/quote", component: <RequestQuote /> },
  { path: "/privacy-policy", component: <PrivacyPolicy /> },
  { path: "/terms-and-conditions", component: <Terms /> },
  { path: "/refund-policy", component: <RefundPolicy /> },

  // All 20 Individual Interactive Demos
  { path: "/live-demos/corporate-website", component: <DemoCorporateWebsite /> },
  { path: "/live-demos/ecommerce-store", component: <DemoEcommerceStore /> },
  { path: "/live-demos/multi-vendor-marketplace", component: <DemoMarketplace /> },
  { path: "/live-demos/crm-software", component: <DemoCRM /> },
  { path: "/live-demos/erp-software", component: <DemoERP /> },
  { path: "/live-demos/hrms-software", component: <DemoHRMS /> },
  { path: "/live-demos/school-management", component: <DemoSchool /> },
  { path: "/live-demos/hospital-management", component: <DemoHospital /> },
  { path: "/live-demos/restaurant-management", component: <DemoRestaurant /> },
  { path: "/live-demos/real-estate-portal", component: <DemoRealEstate /> },
  { path: "/live-demos/travel-booking", component: <DemoTravel /> },
  { path: "/live-demos/ai-chatbot", component: <DemoAIChatbot /> },
  { path: "/live-demos/analytics-dashboard", component: <DemoAnalytics /> },
  { path: "/live-demos/inventory-management", component: <DemoInventory /> },
  { path: "/live-demos/invoice-billing", component: <DemoInvoiceBilling /> },
  { path: "/live-demos/admin-dashboard", component: <DemoAdminDashboard /> },
  { path: "/live-demos/mobile-app", component: <DemoMobileApp /> },
  { path: "/live-demos/landing-page", component: <DemoLandingPage /> },
  { path: "/live-demos/cms-blog", component: <DemoCMSBlog /> },
  { path: "/live-demos/automation-workflow", component: <DemoAutomationWorkflow /> },
];
