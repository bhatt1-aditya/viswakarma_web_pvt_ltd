import Demo from "../models/demo.model.js";

// GET ALL DEMOS
export const getAllDemos = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { active: true };
    if (category && category !== "all") {
      filter.category = category;
    }
    let demos = await Demo.find(filter).sort({ demoNumber: 1 });
    if ((!demos || demos.length === 0) && (!category || category === "all")) {
      try {
        const { demosData } = await import("../seed/servicesData.js");
        if (Array.isArray(demosData) && demosData.length > 0) {
          await Demo.insertMany(demosData);
          demos = await Demo.find(filter).sort({ demoNumber: 1 });
        }
      } catch (seedErr) {
        console.warn("Auto-seed demos fallback notice:", seedErr.message);
      }
    }
    res.status(200).json({ success: true, count: demos?.length || 0, demos: demos || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET DEMO BY ID / SLUG
export const getDemoById = async (req, res) => {
  try {
    const { demoId } = req.params;
    const demo = await Demo.findOneAndUpdate(
      { demoId },
      { $inc: { "metrics.views": 1 } },
      { new: true }
    );
    if (!demo) {
      return res.status(404).json({ success: false, message: "Demo not found" });
    }
    res.status(200).json({ success: true, demo });
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

// ADMIN: CREATE DEMO ROUTE
export const createDemo = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canAdd = req.user?.permissions?.buttons?.servicesControl?.add === true;
    if (!isAdmin && !canAdd) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to create demo routes",
      });
    }

    const { title, demoId, category, description, route, icon, features, relatedServices } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: "Demo title is required" });
    }

    const generatedId = (demoId || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await Demo.findOne({ demoId: generatedId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Demo ID already exists" });
    }

    const totalCount = await Demo.countDocuments();
    const demo = await Demo.create({
      demoNumber: totalCount + 1,
      demoId: generatedId,
      title,
      category: category || "Enterprise Applications",
      description: description || `Interactive live demo for ${title}`,
      route: route || `/live-demos/${generatedId}`,
      icon: icon || "LayoutDashboard",
      features: Array.isArray(features) ? features : [],
      relatedServices: Array.isArray(relatedServices) ? relatedServices : [],
      active: true,
    });

    res.status(201).json({ success: true, message: "Demo route created successfully", demo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: UPDATE DEMO ROUTE
export const updateDemo = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canEdit = req.user?.permissions?.buttons?.servicesControl?.edit === true;
    if (!isAdmin && !canEdit) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to edit demo routes",
      });
    }

    const { id } = req.params;
    const demo = await Demo.findByIdAndUpdate(id, req.body, { new: true });
    if (!demo) {
      return res.status(404).json({ success: false, message: "Demo not found" });
    }

    res.status(200).json({ success: true, message: "Demo route updated successfully", demo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ADMIN: DELETE DEMO ROUTE
export const deleteDemo = async (req, res) => {
  try {
    const isAdmin = isUserAdmin(req.user);
    const canDelete = req.user?.permissions?.buttons?.servicesControl?.delete === true;
    if (!isAdmin && !canDelete) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to delete demo routes",
      });
    }

    const { id } = req.params;
    await Demo.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Demo route deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
