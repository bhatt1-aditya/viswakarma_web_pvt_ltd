import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  LayoutTemplate,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, permissions, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleName = (
    user?.role?.name ||
    (typeof user?.role === "string" ? user.role : "")
  ).toLowerCase();
  const isAdmin = ["admin", "superadmin"].includes(roleName);
  const displayRole =
    user?.role?.name ||
    (typeof user?.role === "string" && user.role.trim()
      ? user.role
      : isAdmin
      ? "Admin"
      : "Telecaller Staff");

  // Dynamic permission-based tab filtering: only show tabs that this user is granted
  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      badge: "Live",
      allowed: isAdmin || permissions?.sidebar?.dashboard === true,
    },
    {
      label: "Telecaller",
      icon: PhoneCall,
      path: "/telecaller",
      badge: "Inbound",
      allowed: isAdmin || permissions?.sidebar?.telecaller === true,
    },
    {
      label: "Home CMS",
      icon: LayoutTemplate,
      path: "/home-control",
      badge: "CMS",
      allowed: isAdmin || permissions?.sidebar?.homeControl === true,
    },
    {
      label: "Staff & Team",
      icon: Users,
      path: "/staff",
      badge: null,
      allowed: isAdmin || permissions?.sidebar?.staff === true,
    },
  ].filter((item) => item.allowed);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.aside
        animate={{ width: isSidebarOpen ? 250 : 76 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex flex-col bg-white border-r border-gray-200/80 shadow-xs h-[calc(100vh-4rem)] fixed top-16 left-0 z-40 select-none overflow-hidden"
      >
        {/* SIDEBAR HEADER / TOGGLE */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0 bg-gradient-to-r from-blue-50/40 via-white to-transparent">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="open-brand"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2.5 overflow-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0756A5] to-[#082B59] flex items-center justify-center text-white font-black text-sm shadow-sm shrink-0">
                  VK
                </div>
                <div className="leading-tight">
                  <span className="text-xs font-black tracking-wider text-[#082B59] block uppercase">
                    Vishwakarma
                  </span>
                  <span className="text-[10px] font-semibold text-[#FF6900] tracking-wide block uppercase">
                    Admin Suite
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="mini-brand"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="mx-auto"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0756A5] to-[#082B59] flex items-center justify-center text-white font-black text-sm shadow-sm">
                  VK
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-7 h-7 rounded-lg text-gray-500 hover:text-[#0756A5] hover:bg-blue-50 flex items-center justify-center transition-colors"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {/* NAVIGATION ITEMS */}
        <div className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2">
            {isSidebarOpen && (
              <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase">
                Core Console
              </span>
            )}
          </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.path ||
              (item.path === "/dashboard" && location.pathname === "/admin");

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group text-left ${
                  active
                    ? "text-[#0756A5] font-bold bg-blue-50/80 shadow-xs"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                {active && (
                  <motion.div
                    layoutId="activeAdminPill"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-[#0756A5] to-[#FF6900] rounded-r-full"
                  />
                )}

                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shrink-0 ${
                    active
                      ? "bg-[#0756A5] text-white shadow-xs"
                      : "bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-[#0756A5]"
                  }`}
                >
                  <Icon size={16} />
                </div>

                {isSidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex items-center justify-between overflow-hidden"
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                )}
              </button>
            );
          })}

          {/* QUICK LINKS SECTION (When expanded) */}
          {isSidebarOpen && (
            <div className="pt-6 px-3 space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase block">
                Public Portals
              </span>

              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-[#0756A5] hover:bg-blue-50/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink size={13} />
                  <span>Public Website</span>
                </span>
                <span className="text-[9px] font-mono text-gray-400">108 Services</span>
              </a>

              <a
                href="/live-demos"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-[#FF6900] hover:bg-orange-50/50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles size={13} className="text-[#FF6900]" />
                  <span>20 Live Demos</span>
                </span>
                <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                  Interactive
                </span>
              </a>
            </div>
          )}
        </div>

        {/* SIDEBAR FOOTER (USER & LOGOUT) */}
        <div className="p-3 border-t border-gray-100 bg-gray-50/60 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
              </div>
              {isSidebarOpen && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-gray-800 truncate">
                    {user?.name || "Administrator"}
                  </p>
                  <p className="text-[10px] text-gray-400 flex items-center gap-1 truncate">
                    <ShieldCheck size={10} className="text-[#0756A5]" />
                    <span className="capitalize">{displayRole}</span>
                  </p>
                </div>
              )}
            </div>

            {isSidebarOpen && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut size={15} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-72 bg-white h-full shadow-2xl flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0756A5] to-[#082B59] flex items-center justify-center text-white font-black text-sm shadow-sm">
                    VK
                  </div>
                  <div>
                    <span className="text-xs font-black tracking-wider text-[#082B59] block uppercase">
                      Vishwakarma
                    </span>
                    <span className="text-[10px] font-semibold text-[#FF6900] tracking-wide block uppercase">
                      Admin Workspace
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              {/* Menu items */}
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase px-2 block mb-1">
                  Admin Navigation
                </span>

                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active =
                    location.pathname === item.path ||
                    (item.path === "/dashboard" && location.pathname === "/admin");

                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors ${
                        active
                          ? "bg-blue-50 text-[#0756A5] shadow-xs"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon size={18} className={active ? "text-[#0756A5]" : "text-gray-500"} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-6 space-y-2 border-t border-gray-100 mt-6">
                  <span className="text-[10px] font-extrabold text-gray-400 tracking-wider uppercase px-2 block">
                    Public Portals
                  </span>
                  <a
                    href="/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs text-gray-600 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink size={14} />
                      <span>Public Website</span>
                    </span>
                  </a>
                  <a
                    href="/live-demos"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl text-xs text-[#FF6900] hover:bg-orange-50/50"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles size={14} />
                      <span>Live Demos Center</span>
                    </span>
                  </a>
                </div>
              </div>

              {/* Mobile Footer */}
              <div className="p-4 border-t border-gray-100 bg-gray-50/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {user?.name ? user.name.slice(0, 2).toUpperCase() : "AD"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-[10px] text-gray-400">Online</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    <span>Exit</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
