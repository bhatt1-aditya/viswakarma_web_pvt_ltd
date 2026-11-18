import React from "react";
import { ShieldCheck, HeartHandshake } from "lucide-react";

const FooterDashBoard = () => {
  const current_year = new Date().getFullYear();

  return (
    <footer className="mt-auto py-4 px-6 md:px-8 border-t border-gray-200/60 bg-white/60 backdrop-blur-xs text-xs text-gray-500">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
          <span className="font-bold text-[#082B59]">
            Vishwakarma Software Pvt. Ltd.
          </span>
          <span className="text-gray-300">|</span>
          <span>&copy; {current_year} Enterprise Workspace</span>
          <span className="hidden md:inline text-gray-300">|</span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
            <ShieldCheck size={12} />
            <span>ISO 9001:2015 Certified</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1 text-gray-600 font-medium">
            <HeartHandshake size={13} className="text-[#FF6900]" />
            <span>Dedicated SLA Support</span>
          </span>
          <span className="font-mono text-gray-400">v2.4 Enterprise</span>
        </div>
      </div>
    </footer>
  );
};

export default FooterDashBoard;
