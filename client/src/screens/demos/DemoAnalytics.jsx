import React, { useState } from "react";
import DemoLayout from "./DemoLayout";
import {
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import toast from "react-hot-toast";

const data7d = [
  { day: "Mon", revenue: 42000, visitors: 1200 },
  { day: "Tue", revenue: 58000, visitors: 1650 },
  { day: "Wed", revenue: 51000, visitors: 1400 },
  { day: "Thu", revenue: 74000, visitors: 2100 },
  { day: "Fri", revenue: 89000, visitors: 2800 },
  { day: "Sat", revenue: 95000, visitors: 3200 },
  { day: "Sun", revenue: 82000, visitors: 2600 },
];

const data30d = [
  { day: "Week 1", revenue: 280000, visitors: 8500 },
  { day: "Week 2", revenue: 340000, visitors: 11200 },
  { day: "Week 3", revenue: 410000, visitors: 14800 },
  { day: "Week 4", revenue: 490000, visitors: 18200 },
];

const DemoAnalytics = () => {
  const [timeRange, setTimeRange] = useState("7d"); // "7d" | "30d"

  const handleReset = () => {
    setTimeRange("7d");
    toast.success("Analytics dashboard reset!");
  };

  const chartData = timeRange === "7d" ? data7d : data30d;

  return (
    <DemoLayout
      demoNumber={13}
      title="Executive Analytics Dashboard Demo"
      category="Custom Software & Enterprise Solutions"
      description="Business intelligence dashboard with interactive sales charts, revenue metrics, date range filters, and traffic attribution."
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* TIME RANGE FILTER BAR */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#0756A5]" />
            <span className="text-xs font-bold text-gray-700">Interval:</span>
            <div className="flex gap-1">
              <button
                onClick={() => setTimeRange("7d")}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  timeRange === "7d" ? "bg-[#0756A5] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setTimeRange("30d")}
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  timeRange === "30d" ? "bg-[#0756A5] text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                Last 30 Days
              </button>
            </div>
          </div>

          <span className="text-xs font-mono text-emerald-600 font-bold">● Realtime Hydration</span>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-medium">Gross Revenue</span>
            <p className="text-2xl font-black text-[#0756A5] mt-1">₹15.2 Lakhs</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +18.4% vs last cycle
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-medium">Unique Sessions</span>
            <p className="text-2xl font-black text-[#FF6900] mt-1">52,700</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <ArrowUpRight size={13} /> +12.1% growth
            </span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-medium">Checkout Conversion</span>
            <p className="text-2xl font-black text-purple-600 mt-1">3.48%</p>
            <span className="text-[11px] text-gray-400">Industry avg: 2.1%</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400 font-medium">Average Order Value</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">₹4,280</p>
            <span className="text-[11px] text-emerald-600 font-semibold">+₹320 higher</span>
          </div>
        </div>

        {/* INTERACTIVE RECHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
              Revenue Growth Trajectory (₹)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0756A5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0756A5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0756A5"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#082B59] uppercase tracking-wider">
              Visitor Traffic Volume
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#FF6900" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
};

export default DemoAnalytics;
