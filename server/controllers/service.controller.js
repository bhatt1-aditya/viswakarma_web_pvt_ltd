import Service from "../models/service.model.js";
import ServiceCategory from "../models/serviceCategory.model.js";

// GET ALL SERVICES with search, category filtering & pagination
export const getAllServices = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 108 } = req.query;
    const filter = { active: true };

    if (category && category !== "all") {
      filter.categorySlug = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { categoryName: { $regex: search, $options: "i" } },
        { techStack: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const total = await Service.countDocuments(filter);

    const services = await Service.find(filter)
      .sort({ idNumber: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      count: services.length,
      services,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SERVICE BY SLUG
export const getServiceBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const service = await Service.findOne({ slug });

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // Also fetch 3 related services in the same category
    const relatedServices = await Service.find({
      categorySlug: service.categorySlug,
      _id: { $ne: service._id },
      active: true,
    }).limit(3);

    res.status(200).json({
      success: true,
      service,
      relatedServices,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {
  try {
    const categories = await ServiceCategory.find({ active: true }).sort({ order: 1 });
    res.status(200).json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: CREATE SERVICE
export const createService = async (req, res) => {
  try {
    const totalCount = await Service.countDocuments();
    const serviceData = {
      ...req.body,
      idNumber: req.body.idNumber || totalCount + 1,
    };

    if (!serviceData.slug) {
      serviceData.slug = serviceData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, message: "Service created", service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: UPDATE SERVICE
export const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }
    res.status(200).json({ success: true, message: "Service updated", service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: DELETE SERVICE
export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
