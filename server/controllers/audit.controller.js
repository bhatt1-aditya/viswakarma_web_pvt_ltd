import AuditLog from "../models/auditLog.model.js";

// GET PROJECT AUDIT TRAIL
export const getProjectAuditTrail = async (req, res) => {
  try {
    const { projectId } = req.params;
    const limit = parseInt(req.query.limit) || 100;

    const logs = await AuditLog.find({ project: projectId })
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      count: logs.length,
      data: logs,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
