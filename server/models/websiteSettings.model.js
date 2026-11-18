import mongoose from "mongoose";

const websiteSettingsSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: "Vishwakarma Web Private Limited" },
    tagline: { type: String, default: "Transforming Ideas Into Powerful Digital Experiences" },
    email: { type: String, default: "contact@vishwakarmaweb.com" },
    phone: { type: String, default: "+91 70775 60648" },
    whatsapp: { type: String, default: "+91 70775 60648" },
    address: { type: String, default: "Tech Hub Tower, Sector 62, Noida, Uttar Pradesh, India" },
    workingHours: { type: String, default: "Mon - Sat: 9:00 AM - 7:00 PM IST" },
    socialLinks: {
      linkedin: { type: String, default: "https://linkedin.com/company/vishwakarmaweb" },
      twitter: { type: String, default: "https://twitter.com/vishwakarmaweb" },
      facebook: { type: String, default: "https://facebook.com/vishwakarmaweb" },
      instagram: { type: String, default: "https://instagram.com/vishwakarmaweb" },
      github: { type: String, default: "https://github.com/vishwakarmaweb" },
    },
    seo: {
      metaTitle: { type: String, default: "Vishwakarma Web Private Limited – Full-Service IT & Digital Solutions" },
      metaDescription: { type: String, default: "Vishwakarma Web Private Limited delivers innovative software, web, mobile, AI, and digital solutions that help businesses grow." },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("WebsiteSettings", websiteSettingsSchema);
