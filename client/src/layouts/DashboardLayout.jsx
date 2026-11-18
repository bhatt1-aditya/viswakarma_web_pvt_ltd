import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import AuthNavbar from "../components/common/AuthNavbar";
import FooterDashBoard from "../components/AdminSideComponents/DashBoardFooter/FooterDashBoard";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900 antialiased selection:bg-[#0756A5] selection:text-white">
      {/* TOPBAR */}
      <AuthNavbar setIsSidebarOpen={setIsSidebarOpen} />

      {/* BODY WITH FIXED SIDEBAR */}
      <div className="pt-16 flex-1 flex flex-col">
        {/* SIDEBAR */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* MAIN CONTENT AREA */}
        <main
          className={`flex-1 flex flex-col transition-all duration-300 min-h-[calc(100vh-4rem)] ${
            isSidebarOpen ? "lg:ml-[250px]" : "lg:ml-[76px]"
          }`}
        >
          <div className="flex-1">
            {children}
          </div>
          <FooterDashBoard />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
