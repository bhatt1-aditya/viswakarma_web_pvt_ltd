import Project from "../models/project.model.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { name, photos, videos, brochure, price, location, description, status } = req.body;
    
    const existing = await Project.findOne({ name: name.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "Project with this name already exists" });
    }

    const project = await Project.create({
      name,
      photos,
      videos,
      brochure,
      price,
      location,
      description,
      status: status || "active",
    });

    res.status(201).json({
      message: "Project created successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL PROJECTS
export const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search = "", status } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      name: { $regex: search, $options: "i" },
    };

    if (status) query.status = status;

    const totalProjects = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      page,
      totalPages: Math.ceil(totalProjects / limit),
      totalProjects,
      data: projects,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Project updated successfully",
      data: project,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
