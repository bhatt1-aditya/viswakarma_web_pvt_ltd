import QuoteRequest from "../models/quoteRequest.model.js";

// SUBMIT QUOTE REQUEST (Public Price Calculator / Consultation Request)
export const createQuoteRequest = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      companyName,
      serviceCategory,
      serviceName,
      projectBudget,
      timeline,
      projectDescription,
      estimatedPriceRange,
    } = req.body;

    if (!fullName || !email || !phone || !projectDescription) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone, and project description are required.",
      });
    }

    const quote = await QuoteRequest.create({
      fullName,
      email,
      phone,
      companyName: companyName || "",
      serviceCategory: serviceCategory || "Custom Solution",
      serviceName: serviceName || "Enterprise Development",
      projectBudget: projectBudget || "To Be Estimated",
      timeline: timeline || "Standard Timeline",
      projectDescription,
      estimatedPriceRange: estimatedPriceRange || "Custom Consultation",
      status: "New",
    });

    res.status(201).json({
      success: true,
      message: "Your project quote request has been received! Our solutions architects will prepare an architectural breakdown and proposal.",
      quoteId: quote._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL QUOTE REQUESTS (Admin)
export const getAllQuoteRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }

    const total = await QuoteRequest.countDocuments(filter);
    const quotes = await QuoteRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      quotes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE QUOTE STATUS
export const updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, noteText, author } = req.body;

    const updateData = {};
    if (status) updateData.status = status;

    let updateQuery = { $set: updateData };
    if (noteText) {
      updateQuery.$push = {
        notes: {
          text: noteText,
          author: author || "Admin",
          createdAt: new Date(),
        },
      };
    }

    const quote = await QuoteRequest.findByIdAndUpdate(id, updateQuery, { new: true });
    if (!quote) {
      return res.status(404).json({ success: false, message: "Quote request not found" });
    }

    res.status(200).json({ success: true, message: "Quote updated", quote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
