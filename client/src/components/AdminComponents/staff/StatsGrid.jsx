import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import API_BASE_URL from "../../../utils/apiConfig";

const StatsGrid = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    interested: 0,
    followUp: 0,
    closed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/lead/lead-stats`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const items = [
    { label: "Total Leads", value: stats.total, color: "from-blue-400 to-blue-600" },
    { label: "Pending", value: stats.pending, color: "from-gray-400 to-gray-600" },
    { label: "Interested", value: stats.interested, color: "from-indigo-400 to-indigo-600" },
    { label: "Follow-up", value: stats.followUp, color: "from-yellow-400 to-yellow-600" },
    { label: "Closed", value: stats.closed, color: "from-green-400 to-green-600" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow border border-gray-100 animate-pulse">
            <div className="h-4 w-20 bg-gray-100 rounded mb-3"></div>
            <div className="h-8 w-12 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {items.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
        >
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{s.label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
          <div className={`h-1 mt-3 bg-gradient-to-r ${s.color} rounded-full`} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsGrid;
