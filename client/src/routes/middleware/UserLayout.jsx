import React from "react";
import CompanyNavbar from "../../components/common/CompanyNavbar";
import CompanyFooter from "../../components/common/CompanyFooter";
import { MessageCircle, Mail } from "lucide-react";

const UserLayout = ({ children }) => {
  const handleWhatsAppClick = () => {
    window.open("https://wa.me/917008156600", "_blank");
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:contact@vishwakarmaweb.com";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC]">
      <CompanyNavbar />
      <main className="flex-1">{children}</main>
      <CompanyFooter />

      {/* Floating Action Buttons */}
      <div className="fixed right-5 bottom-6 flex flex-col items-center gap-3 z-40">
        {/* WhatsApp Floating Button */}
        <button
          onClick={handleWhatsAppClick}
          className="p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
          title="Chat with Vishwakarma Web on WhatsApp"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle size={24} />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 group-hover:ml-2 text-xs font-bold">
            Chat With Us
          </span>
        </button>

        {/* Email Floating Button */}
        <button
          onClick={handleEmailClick}
          className="p-3 bg-[#0756A5] hover:bg-[#082B59] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
          title="Email Vishwakarma Web"
          aria-label="Send Email"
        >
          <Mail size={20} />
        </button>
      </div>
    </div>
  );
};

export default UserLayout;
