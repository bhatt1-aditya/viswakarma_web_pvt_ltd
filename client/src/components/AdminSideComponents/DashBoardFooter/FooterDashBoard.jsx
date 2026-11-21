import React from "react";
import { ShieldCheck, HeartHandshake } from "lucide-react";

const FooterDashBoard = () => {
  const current_year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 px-6 md:px-8 border-t border-gray-200/60 bg-white/60 backdrop-blur-xs text-xs text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">

          <span>&copy; {current_year} Enterprise Workspace</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="font-bold text-[#082B59]">
            Vishwakarma Software Pvt. Ltd.
          </span>

        </div>
      </div>
    </footer>
  );
};

export default FooterDashBoard;
