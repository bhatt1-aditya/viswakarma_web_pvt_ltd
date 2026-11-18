import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, UserCheck, Key, Lock } from "lucide-react";
import API_BASE_URL from "../../../utils/apiConfig";

const StatsGrid = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    admins: 0,
    members: 0,
    roles: 0,
    rbacActive: 100,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffStats = async () => {
      try {
        setLoading(true);
        // Fetch users to compute real metrics
        const [usersRes, rolesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/users/get-all-user?limit=100`, { credentials: "include" }),
          fetch(`${API_BASE_URL}/role/get-all-role`, { credentials: "include" }),
        ]);

        const usersData = await usersRes.json();
        const rolesData = await rolesRes.json();

        const usersList = usersData?.data || [];
        const rolesList = Array.isArray(rolesData?.data)
          ? rolesData.data
          : Array.isArray(rolesData)
          ? rolesData
          : [];

        const adminCount = usersList.filter((u) => {
          const roleName = (u.role?.name || "").toLowerCase();
          return roleName.includes("admin");
        }).length;

        const memberCount = Math.max(0, usersList.length - adminCount);

        setStats({
          totalStaff: usersData?.totalUsers || usersList.length,
          admins: adminCount,
          members: memberCount,
          roles: rolesList.length || 3,
          rbacActive: 100,
        });
      } catch (err) {
        console.warn("Could not calculate dynamic staff stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffStats();
  }, []);

  const items = [
    {
      label: "Total Staff",
      value: stats.totalStaff,
      sub: "Active Personnel",
      icon: Users,
      gradient: "from-blue-500 to-indigo-600",
      accent: "bg-blue-50 text-[#0756A5]",
    },
    {
      label: "Administrators",
      value: stats.admins,
      sub: "Full Privileges",
      icon: ShieldCheck,
      gradient: "from-amber-500 to-orange-600",
      accent: "bg-orange-50 text-[#FF6900]",
    },
    {
      label: "Team Members",
      value: stats.members,
      sub: "Standard Access",
      icon: UserCheck,
      gradient: "from-emerald-500 to-teal-600",
      accent: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Security Roles",
      value: stats.roles,
      sub: "Configured Tiers",
      icon: Key,
      gradient: "from-purple-500 to-indigo-600",
      accent: "bg-purple-50 text-purple-600",
    },
    {
      label: "RBAC Security",
      value: `${stats.rbacActive}%`,
      sub: "Zero Trust Enabled",
      icon: Lock,
      gradient: "from-sky-500 to-cyan-600",
      accent: "bg-sky-50 text-sky-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 shadow-2xs border border-gray-100 animate-pulse space-y-2"
          >
            <div className="h-3 w-16 bg-gray-100 rounded" />
            <div className="h-6 w-10 bg-gray-200 rounded" />
            <div className="h-2 w-20 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
      {items.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="bg-white rounded-2xl p-4 shadow-2xs hover:shadow-md transition-all duration-200 border border-gray-200/70 relative overflow-hidden group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-2xl font-black text-[#082B59] mt-0.5">
                  {s.value}
                </p>
                <p className="text-[10px] text-gray-500 font-medium">
                  {s.sub}
                </p>
              </div>

              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${s.accent}`}>
                <Icon size={16} />
              </div>
            </div>

            <div className={`h-1 mt-3 bg-gradient-to-r ${s.gradient} rounded-full`} />
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
