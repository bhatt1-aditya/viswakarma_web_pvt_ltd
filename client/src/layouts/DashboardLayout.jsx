import React, { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import AuthNavbar from "../components/common/AuthNavbar";
import FooterDashBoard from "../components/AdminSideComponents/DashBoardFooter/FooterDashBoard";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <AuthNavbar setIsSidebarOpen={setIsSidebarOpen} />

      <div className="mt-[3.9rem]">
        {/* SIDEBAR */}
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* MAIN */}
        <main
          className={`h-[calc(100vh-3.9rem)] bg-gray-100 overflow-y-auto transition-all duration-300
            ${isSidebarOpen ? "lg:ml-[220px]" : "lg:ml-[70px]"}
          `}
        >
          {children}
          <FooterDashBoard />
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
