import Service from "../models/service.model.js";
import ServiceCategory from "../models/serviceCategory.model.js";
import Demo from "../models/demo.model.js";
import Inquiry from "../models/inquiry.model.js";
import QuoteRequest from "../models/quoteRequest.model.js";
import Portfolio from "../models/portfolio.model.js";
import User from "../models/user.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalServices,
      totalCategories,
      totalDemos,
      totalInquiries,
      totalQuotes,
      totalPortfolio,
      totalStaff,
      recentInquiries,
      recentQuotes,
    ] = await Promise.all([
      Service.countDocuments({ active: true }),
      ServiceCategory.countDocuments({ active: true }),
      Demo.countDocuments({ active: true }),
      Inquiry.countDocuments(),
      QuoteRequest.countDocuments(),
      Portfolio.countDocuments(),
      User.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5),
      QuoteRequest.find().sort({ createdAt: -1 }).limit(5),
    ]);

    // Group inquiries by status
    const inquiriesByStatus = await Inquiry.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalServices,
        totalCategories,
        totalDemos,
        totalInquiries,
        totalQuotes,
        totalPortfolio,
        totalStaff,
      },
      inquiriesByStatus,
      recentInquiries,
      recentQuotes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
