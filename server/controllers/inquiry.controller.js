import Inquiry from "../models/inquiry.model.js";

// SUBMIT INQUIRY (Public Contact Form)
export const createInquiry = async (req, res) => {
  try {
    const { fullName, email, phone, state, companyName, serviceRequired, projectBudget, projectTimeline, projectDescription, message } = req.body;
    const finalDescription = projectDescription || message || "";

    if (!fullName || !phone || !email || !finalDescription) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone, and project description are required.",
      });
    }

    const inquiry = await Inquiry.create({
      fullName,
      email,
      phone,
      state: state || "All",
      companyName: companyName || "",
      serviceRequired: serviceRequired || "General Consultation",
      projectBudget: projectBudget || "",
      projectTimeline: projectTimeline || "",
      projectDescription: finalDescription,
      status: "New",
    });

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! A senior technology consultant from Vishwakarma Web Private Limited will contact you within 24 business hours.",
      inquiryId: inquiry._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL INQUIRIES (Admin)
export const getAllInquiries = async (req, res) => {
  try {
    const { status, state, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== "all" && status !== "All") {
      filter.status = status;
    }
    if (state && state !== "all" && state !== "All") {
      filter.state = state;
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { companyName: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Inquiry.countDocuments(filter);
    const inquiries = await Inquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE INQUIRY STATUS
export const updateInquiryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, noteText, author } = req.body;

    const roleName = (
      req.user?.role?.name ||
      (typeof req.user?.role === "string" ? req.user.role : "")
    )
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    const isAdmin = ["admin", "superadmin"].includes(roleName);
    const canUpdateStatus =
      req.user?.permissions?.buttons?.telecaller?.updateStatus === true;
    const canAddNote =
      req.user?.permissions?.buttons?.telecaller?.addNote === true;

    if (!isAdmin) {
      if (status && !canUpdateStatus) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to update lead status.",
        });
      }
      if (noteText && !canAddNote) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission to add call notes.",
        });
      }
    }

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

    const inquiry = await Inquiry.findByIdAndUpdate(id, updateQuery, { new: true });
    if (!inquiry) {
      return res.status(404).json({ success: false, message: "Inquiry not found" });
    }

    res.status(200).json({ success: true, message: "Inquiry updated", inquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE INQUIRY
export const deleteInquiry = async (req, res) => {
  try {
    const roleName = (
      req.user?.role?.name ||
      (typeof req.user?.role === "string" ? req.user.role : "")
    )
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    const isAdmin = ["admin", "superadmin"].includes(roleName);
    const canDelete =
      req.user?.permissions?.buttons?.telecaller?.delete === true ||
      req.user?.permissions?.buttons?.leads?.delete === true;

    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete inquiries.",
      });
    }

    const { id } = req.params;
    await Inquiry.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Inquiry deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
