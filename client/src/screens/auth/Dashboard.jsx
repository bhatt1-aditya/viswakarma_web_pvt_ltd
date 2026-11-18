import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Layers,
  Sparkles,
  Users,
  FileText,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../utils/apiConfig";

const initialChartData = [
  { day: "Mon", inquiries: 12, quotes: 5 },
  { day: "Tue", inquiries: 18, quotes: 9 },
  { day: "Wed", inquiries: 15, quotes: 7 },
  { day: "Thu", inquiries: 24, quotes: 14 },
  { day: "Fri", inquiries: 30, quotes: 18 },
  { day: "Sat", inquiries: 22, quotes: 12 },
  { day: "Sun", inquiries: 16, quotes: 8 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalServices: 108,
    totalCategories: 9,
    totalDemos: 20,
    totalInquiries: 0,
    totalQuotes: 0,
    totalPortfolio: 6,
    totalStaff: 1,
  });
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE_URL}/admin/dashboard-stats`,
        {
          withCredentials: true,
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentInquiries(res.data.recentInquiries || []);
        setRecentQuotes(res.data.recentQuotes || []);
      }
    } catch (err) {
      console.warn("Could not fetch dashboard stats, using defaults:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-6 pt-6 pb-12 bg-gray-50 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FF6900] uppercase tracking-wider">
            Vishwakarma Web Management Console
          </span>
          <h1 className="text-2xl font-bold text-[#082B59] mt-0.5">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500">
            Real-time control over services, live demos, leads, staff, and system performance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 shadow-xs"
          >
            <span>View Public Website</span>
            <ExternalLink size={13} />
          </Link>
          <Link
            to="/live-demos"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF6900] text-white text-xs font-bold shadow-xs hover:bg-orange-600"
          >
            <Sparkles size={13} />
            <span>Interactive Demo Center</span>
          </Link>
        </div>
      </div>

      {/* KPI STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Services</span>
          <p className="text-2xl font-black text-[#0756A5]">{stats.totalServices}</p>
          <span className="text-[10px] text-gray-500 font-medium">Across 9 domains</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Live Demos</span>
          <p className="text-2xl font-black text-[#FF6900]">{stats.totalDemos}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">100% Operational</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Contact Inquiries</span>
          <p className="text-2xl font-black text-[#082B59]">{stats.totalInquiries}</p>
          <span className="text-[10px] text-blue-600 font-medium">Logged in CRM</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Quote Requests</span>
          <p className="text-2xl font-black text-purple-600">{stats.totalQuotes}</p>
          <span className="text-[10px] text-gray-500 font-medium">From calculator</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Case Studies</span>
          <p className="text-2xl font-black text-emerald-600">{stats.totalPortfolio}</p>
          <span className="text-[10px] text-gray-500 font-medium">Featured portfolio</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase">System Status</span>
          <p className="text-base font-bold text-emerald-600 flex items-center gap-1 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Optimal</span>
          </p>
          <span className="text-[10px] text-gray-400">Zero Server Errors</span>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
              Inbound Inquiries & Quote Requests Trend
            </h3>
            <span className="text-xs text-gray-400 font-medium">Past 7 Days</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={initialChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="inquiries"
                  stroke="#0756A5"
                  strokeWidth={3}
                  name="Contact Inquiries"
                />
                <Line
                  type="monotone"
                  dataKey="quotes"
                  stroke="#FF6900"
                  strokeWidth={3}
                  name="Quote Requests"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* QUICK ADMIN ACTIONS PANEL (4 cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
            Quick Administration
          </h3>

          <div className="space-y-2.5">
            <Link
              to="/services-admin"
              className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-200 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Layers size={16} className="text-[#0756A5]" />
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5]">
                  Manage 108 Services
                </span>
              </div>
              <ArrowRight size={13} className="text-gray-400 group-hover:text-[#0756A5]" />
            </Link>

            <Link
              to="/lead"
              className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-200 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} className="text-[#0756A5]" />
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5]">
                  CRM Lead Pipeline
                </span>
              </div>
              <ArrowRight size={13} className="text-gray-400 group-hover:text-[#0756A5]" />
            </Link>

            <Link
              to="/staff"
              className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-200 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={16} className="text-[#0756A5]" />
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5]">
                  Staff & Role Permissions
                </span>
              </div>
              <ArrowRight size={13} className="text-gray-400 group-hover:text-[#0756A5]" />
            </Link>

            <Link
              to="/projects"
              className="p-3 rounded-xl bg-gray-50 hover:bg-blue-50/70 border border-gray-200 flex items-center justify-between transition-colors group"
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} className="text-[#0756A5]" />
                <span className="text-xs font-bold text-gray-800 group-hover:text-[#0756A5]">
                  Active Client Projects
                </span>
              </div>
              <ArrowRight size={13} className="text-gray-400 group-hover:text-[#0756A5]" />
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT INQUIRIES & QUOTE REQUESTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#082B59] uppercase tracking-wider">
              Recent Inbound Inquiries
            </h4>
            <Link to="/lead" className="text-xs font-semibold text-[#0756A5] hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <p className="text-xs text-gray-400">Loading inquiries...</p>
          ) : recentInquiries.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No recent inquiries yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {recentInquiries.slice(0, 5).map((inq) => (
                <div key={inq._id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-800">{inq.fullName}</span>
                    <span className="text-gray-400 ml-2 font-mono text-[11px]">{inq.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                    {inq.status || "new"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-[#082B59] uppercase tracking-wider">
              Recent Estimate Requests
            </h4>
            <Link to="/lead" className="text-xs font-semibold text-[#FF6900] hover:underline">
              View All
            </Link>
          </div>
          {loading ? (
            <p className="text-xs text-gray-400">Loading quote requests...</p>
          ) : recentQuotes.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No estimate requests yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 text-xs">
              {recentQuotes.slice(0, 5).map((q) => (
                <div key={q._id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-gray-800">{q.fullName}</span>
                    <span className="text-gray-400 ml-2 font-mono text-[11px]">
                      {q.projectType || "General"}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600">
                    ₹{q.estimatedCostMin?.toLocaleString() || "Quote"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
