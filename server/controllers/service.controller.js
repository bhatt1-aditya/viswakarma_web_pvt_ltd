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
    let categories = await ServiceCategory.find({ active: true }).sort({ order: 1 });
    if (!categories || categories.length === 0) {
      try {
        const { categoriesData } = await import("../seed/servicesData.js");
        if (Array.isArray(categoriesData) && categoriesData.length > 0) {
          await ServiceCategory.insertMany(categoriesData);
          categories = await ServiceCategory.find({ active: true }).sort({ order: 1 });
        }
      } catch (seedErr) {
        console.warn("Auto-seed categories fallback notice:", seedErr.message);
      }
    }
    res.status(200).json({ success: true, categories: categories || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: CREATE CATEGORY
export const createCategory = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.servicesControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to create categories",
      });
    }

    const { name, slug, description, icon, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const generatedSlug = (slug || name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await ServiceCategory.findOne({ slug: generatedSlug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category slug already exists" });
    }

    const category = await ServiceCategory.create({
      name,
      slug: generatedSlug,
      description: description || `${name} software & engineering services`,
      icon: icon || "Layers",
      order: order || 0,
      active: true,
    });

    res.status(201).json({ success: true, message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: UPDATE CATEGORY
export const updateCategory = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.servicesControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit categories",
      });
    }

    const { id } = req.params;
    const category = await ServiceCategory.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: DELETE CATEGORY
export const deleteCategory = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.servicesControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete categories",
      });
    }

    const { id } = req.params;
    await ServiceCategory.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const isUserAdmin = (user) => {
  if (!user) return false;
  const roleName = (
    user.role?.name ||
    (typeof user.role === "string" ? user.role : "")
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  return ["admin", "superadmin"].includes(roleName);
};

// ADMIN: CREATE SERVICE
export const createService = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.servicesControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to create services",
      });
    }

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
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.servicesControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit services",
      });
    }

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
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.servicesControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete services",
      });
    }

    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
