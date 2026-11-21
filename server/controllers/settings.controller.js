import WebsiteSettings from "../models/websiteSettings.model.js";
import Testimonial from "../models/testimonial.model.js";

export const getWebsiteSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    res.status(200).json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWebsiteSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (settings) {
      settings = await WebsiteSettings.findByIdAndUpdate(settings._id, req.body, { new: true });
    } else {
      settings = await WebsiteSettings.create(req.body);
    }
    res.status(200).json({ success: true, message: "Settings updated", settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET DYNAMIC HOME SCREEN CMS SETTINGS (Public)
export const getHomeSettings = async (req, res) => {
  try {
    let settings = await WebsiteSettings.findOne();
    if (!settings) {
      settings = await WebsiteSettings.create({});
    }
    res.status(200).json({
      success: true,
      homeContent: settings.homeContent,
      settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE DYNAMIC HOME SCREEN CMS SETTINGS (Protected Admin/Staff)
export const updateHomeSettings = async (req, res) => {
  try {
    const roleName = (
      req.user?.role?.name ||
      (typeof req.user?.role === "string" ? req.user.role : "")
    )
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
    const isAdmin = ["admin", "superadmin"].includes(roleName);
    const canEdit = req.user?.permissions?.buttons?.homeControl?.edit === true;
    const canDeploy =
      req.user?.permissions?.buttons?.homeControl?.deploy === true ||
      req.user?.permissions?.buttons?.homeControl?.publish === true;

    if (!isAdmin && (!canEdit || !canDeploy)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have 'edit' and 'deploy' permissions to modify home screen content.",
      });
    }

    const { homeContent } = req.body;
    let settings = await WebsiteSettings.findOne();

    if (!settings) {
      settings = await WebsiteSettings.create({ homeContent });
    } else {
      settings = await WebsiteSettings.findByIdAndUpdate(
        settings._id,
        { $set: { homeContent: { ...settings.homeContent?.toObject(), ...homeContent } } },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      message: "Home screen configuration updated successfully!",
      homeContent: settings.homeContent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ active: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
