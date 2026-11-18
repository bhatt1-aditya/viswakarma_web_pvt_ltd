import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RiDashboardLine } from "react-icons/ri";
import { FiSidebar } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { FaUsers, FaBullseye } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { PiProjectorScreen } from "react-icons/pi";
import { VscProject } from "react-icons/vsc";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const path = useLocation();

  const { permissions, loading } = useAuth();

  if (loading) return null;
  if (!permissions) return null;

  const menuItems = [
    {
      label: "Dashboard",
      icon: <RiDashboardLine size={18} />,
      path: "/dashboard",
      visible: true,
    },
    {
      label: "Services (108)",
      icon: <PiProjectorScreen size={18} />,
      path: "/services-admin",
      visible: true,
    },
    {
      label: "Staff",
      icon: <FaUsers size={18} />,
      path: "/staff",
      visible: permissions?.sidebar?.staff !== false,
    },
    {
      label: "Leads",
      icon: <FaBullseye size={18} />,
      path: "/lead",
      visible: permissions?.sidebar?.leads !== false,
    },
    {
      label: "Projects",
      icon: <VscProject size={18} />,
      path: "/projects",
      visible: permissions?.sidebar?.projects !== false,
    },
  ].filter((item) => item.visible);

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <motion.div
        animate={{ width: isSidebarOpen ? 220 : 70 }}
        transition={{ duration: 0.3 }}
        className="hidden lg:flex flex-col bg-white shadow-xl h-[calc(100vh-3.9rem)] fixed top-[3.9rem] left-0 z-40 overflow-y-auto"
      >
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <span className="font-bold text-lg">
            {isSidebarOpen ? "Admin" : "A"}
          </span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FiSidebar size={16} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 mt-4 px-2">
          {menuItems.map((item) => {
            const active = path.pathname === item.path;

            return (
              <li key={item.path}>
                <div
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${active ? "bg-[#069ab7] text-white" : "hover:bg-[#4dd0eb] text-gray-700"}`}
                >
                  <div className="text-lg">{item.icon}</div>
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isSidebarOpen ? 1 : 0,
                      width: isSidebarOpen ? "auto" : 0,
                    }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                </div>
              </li>
            );
          })}
        </ul>
      </motion.div>

      {/* MOBILE SIDEBAR */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute ml-6 mt-[-50px] text-white z-50"
        >
          {isSidebarOpen ? <IoClose size={30} /> : <FiSidebar size={30} />}
        </button>

        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="h-full w-[70%] absolute z-40 shadow-2xl bg-white"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4">
                <ul className="space-y-3">
                  {menuItems.map((item) => (
                    <li key={item.path}>
                      <div
                        onClick={() => {
                          navigate(item.path);
                          setIsSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sidebar;
