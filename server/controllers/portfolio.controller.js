import Portfolio from "../models/portfolio.model.js";

export const getAllPortfolio = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    const projects = await Portfolio.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, count: projects.length, projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPortfolioBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await Portfolio.findOne({ slug });
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    res.status(200).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPortfolio = async (req, res) => {
  try {
    const project = await Portfolio.create(req.body);
    res.status(201).json({ success: true, message: "Project created", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Portfolio.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Project updated", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    await Portfolio.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
