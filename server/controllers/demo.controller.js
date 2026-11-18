import Demo from "../models/demo.model.js";

// GET ALL DEMOS
export const getAllDemos = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { active: true };
    if (category && category !== "all") {
      filter.category = category;
    }
    const demos = await Demo.find(filter).sort({ demoNumber: 1 });
    res.status(200).json({ success: true, count: demos.length, demos });
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

// TRACK DEMO INTERACTION
export const trackDemoInteraction = async (req, res) => {
  try {
    const { demoId } = req.params;
    await Demo.updateOne({ demoId }, { $inc: { "metrics.interactions": 1 } });
    res.status(200).json({ success: true, message: "Interaction tracked" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
