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
