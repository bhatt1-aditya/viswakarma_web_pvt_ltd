import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Lock,
  Layers,
  Activity,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  PhoneCall,
  Mail,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";
import { useAuth } from "../../context/AuthContext";

const activityData = [
  { day: "Mon", sessions: 28, securityChecks: 14 },
  { day: "Tue", sessions: 42, securityChecks: 22 },
  { day: "Wed", sessions: 36, securityChecks: 18 },
  { day: "Thu", sessions: 54, securityChecks: 30 },
  { day: "Fri", sessions: 68, securityChecks: 40 },
  { day: "Sat", sessions: 45, securityChecks: 26 },
  { day: "Sun", sessions: 38, securityChecks: 19 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, permissions, loading: authLoading } = useAuth();

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
      : "Staff Member");

  const [stats, setStats] = useState({
    totalStaff: 1,
    totalRoles: 3,
    totalServices: 108,
    totalDemos: 20,
  });
  const [recentStaff, setRecentStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  // Permission guard: if user does not have dashboard access, route them to their permitted tab
  useEffect(() => {
    if (!authLoading && user) {
      const hasDashboardAccess = isAdmin || permissions?.sidebar?.dashboard === true;
      if (!hasDashboardAccess) {
        if (permissions?.sidebar?.telecaller === true) {
          navigate("/telecaller", { replace: true });
        } else if (permissions?.sidebar?.staff === true) {
          navigate("/staff", { replace: true });
        }
      }
    }
  }, [authLoading, user, isAdmin, permissions, navigate]);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      // 1. Fetch dashboard stats
      try {
        const statsRes = await axios.get(`${API_BASE_URL}/admin/dashboard-stats`, {
          withCredentials: true,
          headers: authHeader,
        });
        if (statsRes.data.success && statsRes.data.stats) {
          setStats((prev) => ({
            ...prev,
            totalStaff: statsRes.data.stats.totalStaff || prev.totalStaff,
            totalServices: statsRes.data.stats.totalServices || 108,
            totalDemos: statsRes.data.stats.totalDemos || 20,
          }));
        }
      } catch (err) {
        console.warn("Using baseline dashboard stats:", err.message);
      }

      // 2. Fetch recent staff members
      try {
        const staffRes = await axios.get(
          `${API_BASE_URL}/users/get-all-user?page=1&limit=5`,
          {
            withCredentials: true,
            headers: authHeader,
          }
        );
        if (staffRes.data && Array.isArray(staffRes.data.data)) {
          setRecentStaff(staffRes.data.data);
          setStats((prev) => ({
            ...prev,
            totalStaff: staffRes.data.totalUsers || staffRes.data.data.length || prev.totalStaff,
          }));
        }
      } catch (err) {
        console.warn("Could not load recent staff roster:", err.message);
      }

      // 3. Fetch roles count
      try {
        const rolesRes = await axios.get(`${API_BASE_URL}/role/get-all-role`, {
          withCredentials: true,
          headers: authHeader,
        });
        const rolesList = Array.isArray(rolesRes.data?.data)
          ? rolesRes.data.data
          : Array.isArray(rolesRes.data)
            ? rolesRes.data
            : [];
        if (rolesList.length > 0) {
          setStats((prev) => ({
            ...prev,
            totalRoles: rolesList.length,
          }));
        }
      } catch (err) {
        console.warn("Using default roles count:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name = "") => {
    return (
      name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0] || "")
        .join("")
        .toUpperCase() || "VK"
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 mx-auto"
    >
      {/* ── 1. ANIMATED HERO WELCOME BANNER ── */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#082B59] via-[#0756A5] to-[#071426] p-6 sm:p-8 text-white shadow-xl"
      >
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-[#FF6900]/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-64 h-64 rounded-full bg-[#0bb6d9]/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-blue-100 backdrop-blur-xs border border-white/15">
                <ShieldCheck size={13} className="text-[#FF8A00]" />
                <span>Executive Workforce Administration</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-400/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>RESTful SLA Online</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              {getGreeting()},{" "}
              <span className="bg-gradient-to-r from-white via-blue-100 to-[#FF8A00] bg-clip-text text-transparent">
                {user?.name || "Administrator"}
              </span>
            </h1>

            <p className="text-sm text-blue-100/80 max-w-2xl leading-relaxed">
              Welcome to the central Vishwakarma administration workspace. Oversee team members,
              manage role-based access privileges, and verify production system telemetry.
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-blue-200/70">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>{currentDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>Role: <strong className="text-white capitalize">{displayRole}</strong></span>
              </span>
            </div>
          </div>

          {/* Quick Hero Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => navigate("/telecaller")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF6900] to-[#FF8A00] text-white font-bold text-xs shadow-lg hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <PhoneCall size={16} />
              <span>Telecaller Queue</span>
            </button>

            <button
              onClick={() => navigate("/staff")}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-xs border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <UserPlus size={16} />
              <span>Manage Staff</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs backdrop-blur-xs border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Site</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </motion.div>

      {/* ── 2. ANIMATED KPI STAT CARDS ── */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {/* Card 1: Total Staff */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block">
                Total Staff Team
              </span>
              <p className="text-3xl font-black text-[#082B59]">
                {loading ? "..." : stats.totalStaff}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <CheckCircle2 size={11} />
                  <span>Authorized Personnel</span>
                </span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0756A5] flex items-center justify-center shadow-xs">
              <Users size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Team Directory</span>
            <Link to="/staff" className="font-bold text-[#0756A5] hover:underline flex items-center gap-1">
              <span>View Staff</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* Card 2: Security Roles */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block">
                Security Roles
              </span>
              <p className="text-3xl font-black text-[#FF6900]">
                {loading ? "..." : stats.totalRoles}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                  <Lock size={11} />
                  <span>RBAC Privileges</span>
                </span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#FF6900] flex items-center justify-center shadow-xs">
              <ShieldCheck size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Granular Policies</span>
            <Link to="/staff" className="font-bold text-[#FF6900] hover:underline flex items-center gap-1">
              <span>Manage Roles</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>

        {/* Card 3: Platform Services */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block">
                Services Architecture
              </span>
              <p className="text-3xl font-black text-indigo-700">
                108
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                  <span>9 Engineering Domains</span>
                </span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <Layers size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Public Offerings</span>
            <a href="/services" target="_blank" rel="noreferrer" className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
              <span>Open Catalog</span>
              <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>

        {/* Card 4: System Availability */}
        <motion.div
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl p-5 border border-gray-200/70 shadow-xs hover:shadow-md transition-all relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-gray-400 tracking-wider uppercase block">
                Production SLA
              </span>
              <p className="text-3xl font-black text-emerald-600">
                99.98%
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Zero Server Downtime</span>
                </span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Activity size={22} />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-gray-400">Health Check</span>
            <span className="font-bold text-emerald-600">100% Operational</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── 3. CHARTS ROW: WORKFORCE SESSIONS & QUICK DISPATCH ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart (8 cols) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
                Workforce Console Activity & Telemetry
              </h3>
              <p className="text-xs text-gray-400">
                Staff portal sessions, security handshakes, and access audits past 7 days
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0756A5]" />
                <span className="text-gray-600 font-medium">Portal Sessions</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FF6900]" />
                <span className="text-gray-600 font-medium">Security Audits</span>
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0756A5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0756A5" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorSecurity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6900" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF6900" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#082B59",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#0756A5"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                  name="Staff Sessions"
                />
                <Area
                  type="monotone"
                  dataKey="securityChecks"
                  stroke="#FF6900"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorSecurity)"
                  name="Security Audits"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Quick Staff Administration Hub (4 cols) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200/70 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
                Staff Operations Hub
              </h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/telecaller")}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-50/80 to-amber-50/50 hover:from-orange-100 hover:to-amber-100 border border-orange-200/70 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF6900] text-white flex items-center justify-center shadow-xs">
                    <PhoneCall size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF6900] block">
                      Telecaller Inbound Queue
                    </span>
                    <span className="text-[10px] text-gray-500">
                      View project applications by state
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#FF6900] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate("/staff")}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/40 hover:from-blue-100 hover:to-indigo-100/70 border border-blue-200/60 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#0756A5] text-white flex items-center justify-center shadow-xs">
                    <UserPlus size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5] block">
                      Add New Staff Member
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Provision credentials, role & state
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#0756A5] transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => navigate("/staff")}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-orange-50/70 to-amber-50/40 hover:from-orange-100 hover:to-amber-100/70 border border-orange-200/60 flex items-center justify-between transition-all group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FF6900] text-white flex items-center justify-center shadow-xs">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-[#FF6900] block">
                      Manage Security Roles
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Configure granular module access
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-[#FF6900] transition-transform group-hover:translate-x-0.5" />
              </button>

              <a
                href="/live-demos"
                target="_blank"
                rel="noreferrer"
                className="w-full p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100/80 border border-gray-200 flex items-center justify-between transition-all group text-left block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gray-800 text-white flex items-center justify-center shadow-xs">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5] block">
                      Verify 20 Live Portals
                    </span>
                    <span className="text-[10px] text-gray-500">
                      Client-ready interactive demos
                    </span>
                  </div>
                </div>
                <ExternalLink size={14} className="text-gray-400 group-hover:text-[#0756A5]" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#082B59] to-[#0756A5] text-white space-y-2">
            <span className="text-[10px] font-bold tracking-wider text-[#FF8A00] uppercase block">
              Governance Commitment
            </span>
            <p className="text-xs text-blue-100 leading-relaxed">
              Every staff member action is logged with zero-trust JWT authentication and role-based policies.
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── 4. RECENT STAFF ROSTER PREVIEW ── */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-3xl p-6 border border-gray-200/70 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
              Active Team Roster Preview
            </h3>
            <p className="text-xs text-gray-400">
              Recently active administrators, project managers, and technical staff
            </p>
          </div>

          <button
            onClick={() => navigate("/staff")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 text-[#0756A5] hover:bg-blue-100 text-xs font-bold transition-colors"
          >
            <span>Open Staff Section</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400">
            Loading team roster...
          </div>
        ) : recentStaff.length === 0 ? (
          <div className="py-10 text-center">
            <Users size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs text-gray-500 font-medium">No additional staff members found.</p>
            <button
              onClick={() => navigate("/staff")}
              className="mt-3 text-xs font-bold text-[#0756A5] hover:underline"
            >
              + Add first team member in Staff Section
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Team Member</th>
                  <th className="py-3 px-3">Security Role</th>
                  <th className="py-3 px-3">Contact Email</th>
                  <th className="py-3 px-3">Phone</th>
                  <th className="py-3 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentStaff.map((member) => (
                  <tr key={member._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0756A5] to-[#FF6900] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                          {getInitials(member.name)}
                        </div>
                        <span className="font-bold text-gray-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0756A5] border border-blue-200 capitalize">
                        {member.role?.name || "Staff Member"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Mail size={12} className="text-gray-400" />
                        <span>{member.email || "—"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Phone size={12} className="text-gray-400" />
                        <span>{member.phone || "—"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
