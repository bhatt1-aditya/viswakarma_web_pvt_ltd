import Lead from "../models/lead.model.js";
import User from "../models/user.model.js";

//  CREATE LEAD
export const createLead = async (req, res) => {
  try {
    const { name, phone, email, source, status, notes } = req.body;
    const existing = await Lead.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: "Lead already exists" });
    }

    const leadData = {
      name,
      phone,
      email,
      source,
      status: status || "Pending",
      createdBy: req.user?.id,
    };

    const canAssign = ["admin", "superadmin"].includes(req.user?.role?.name) || req.user?.permissions?.buttons?.leads?.assign;
    if (req.body.assignedTo && canAssign) {
      leadData.assignedTo = req.body.assignedTo;
    }

    if (notes) {
      leadData.notes = [{ text: notes, createdBy: req.user?.id }];
    }

    const lead = await Lead.create(leadData);

    const populatedLead = await Lead.findById(lead._id)
      .populate("createdBy", "name")
      .populate("notes.createdBy", "name");

    res.status(201).json({
      message: "Lead created",
      data: populatedLead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL LEADS
export const getLeads = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { search = "", status, source, startDate, endDate, assigned } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    };

    if (status) query.status = status;
    if (source) query.source = { $regex: source, $options: "i" };

    if (assigned === "true") {
      query.assignedTo = { $exists: true, $ne: null };
    } else if (assigned === "false") {
      query.assignedTo = null;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (req.user && !["admin", "superadmin"].includes(req.user.role?.name)) {
      query.assignedTo = req.user.id;
    }

    const totalLeads = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate("assignedTo", "name")
      .populate("createdBy", "name")
      .populate("notes.createdBy", "name")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      page,
      totalPages: Math.ceil(totalLeads / limit),
      totalLeads,
      count: leads.length,
      data: leads,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE LEAD
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE LEAD
export const updateLead = async (req, res) => {
  try {
    const { assignedTo, status, note } = req.body;

    const canAssign = ["admin", "superadmin"].includes(req.user?.role?.name) || req.user?.permissions?.buttons?.leads?.assign;

    if (assignedTo && !canAssign) {
      return res.status(403).json({ message: "Not authorized to assign leads" });
    }

    if (assignedTo) {
      const userExists = await User.findById(assignedTo);
      if (!userExists) {
        return res.status(400).json({ message: "Invalid assigned user" });
      }
    }

    const updateData = { ...req.body };
    delete updateData.note; // Separate handling for notes

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Role-based check: Staff can strictly only update their assigned leads
    if (req.user && !["admin", "superadmin"].includes(req.user.role?.name)) {
      const canEdit = req.user.permissions?.buttons?.leads?.edit;
      if (!canEdit) {
        return res.status(403).json({ message: "Not authorized to edit leads" });
      }

      const isAssignee = lead.assignedTo?.toString() === req.user.id.toString();
      if (!isAssignee) {
        return res.status(403).json({ message: "Not authorized to update this lead" });
      }
    }

    // Handle adding a new note
    if (note) {
      lead.notes.push({ text: note, createdBy: req.user?.id });
    }

    // Update other fields
    Object.assign(lead, updateData);

    await lead.save();

    const updatedLead = await Lead.findById(lead._id)
      .populate("assignedTo", "name")
      .populate("createdBy", "name")
      .populate("notes.createdBy", "name");

    res.json({
      message: "Lead updated",
      data: updatedLead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE LEAD
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const isAdmin = ["admin", "superadmin"].includes(req.user.role?.name);
    if (!isAdmin) {
      const canDelete = req.user.permissions?.buttons?.leads?.delete;
      if (!canDelete) {
        return res.status(403).json({ message: "Not authorized to delete leads" });
      }

      if (lead.assignedTo?.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: "Not authorized to delete this lead" });
      }
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({ message: "Lead deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// TRANSFER LEAD
export const transferLead = async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const userExists = await User.findById(assignedTo);
    if (!userExists) {
      return res.status(400).json({ message: "Invalid assigned user" });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true },
    )
      .populate("assignedTo", "name")
      .populate("createdBy", "name");

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json({
      message: "Lead transferred",
      data: lead,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//BULK UPLOAD LEAD
export const bulkUploadLeads = async (req, res) => {
  try {
    const { leads } = req.body;

    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const formatted = leads.map((item) => ({
      name: item.name || item.Name,
      phone: item.phone || item.Phone,
      email: item.email || item.Email,
      source: item.source || item.Source || "Other",
      status: item.status || item.Status || "Pending",
      notes: (item.notes || item.Notes) ? [{ text: item.notes || item.Notes, createdBy: req.user?.id }] : [],
      createdBy: req.user?.id,
    }));

    // remove duplicates by phone
    const phones = formatted.map((l) => l.phone).filter(p => p);

    const existing = await Lead.find({ phone: { $in: phones } });
    const existingPhones = new Set(existing.map((e) => e.phone));

    const newLeads = formatted.filter((l) => l.phone && !existingPhones.has(l.phone));

    const inserted = await Lead.insertMany(newLeads);

    res.status(201).json({
      message: "Leads uploaded successfully",
      insertedCount: inserted.length,
      skipped: formatted.length - inserted.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    let query = {};

    // Role-based filtering: Staff ONLY see stats for leads assigned to them
    if (req.user && !["admin", "superadmin"].includes(req.user.role?.name)) {
      query.assignedTo = req.user.id;
    }

    const stats = await Lead.aggregate([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const total = await Lead.countDocuments(query);

    const formattedStats = {
      total,
      pending: 0,
      interested: 0,
      notInterested: 0,
      followUp: 0,
      closed: 0
    };

    stats.forEach(s => {
      if (s._id === 'Pending') formattedStats.pending = s.count;
      if (s._id === 'Interested') formattedStats.interested = s.count;
      if (s._id === 'Not Interested') formattedStats.notInterested = s.count;
      if (s._id === 'Follow-up') formattedStats.followUp = s.count;
      if (s._id === 'Closed') formattedStats.closed = s.count;
    });

    res.json(formattedStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkAssignLeads = async (req, res) => {
  try {
    const { ids, assignedTo } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No leads selected" });
    }

    // Permission check: Admin or explicit assign permission
    const isAdmin = ["admin", "superadmin"].includes(req.user.role?.name);
    const hasAssignPermission = req.user.permissions?.buttons?.leads?.assign;

    if (!isAdmin && !hasAssignPermission) {
      return res.status(403).json({ message: "Not authorized to assign leads" });
    }

    await Lead.updateMany(
      { _id: { $in: ids } },
      { $set: { assignedTo: assignedTo || null } }
    );

    res.json({ message: `Successfully assigned ${ids.length} leads` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const bulkDeleteLeads = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No leads selected" });
    }

    // Permission check: Admin or explicit delete permission
    const isAdmin = ["admin", "superadmin"].includes(req.user.role?.name);
    const hasDeletePermission = req.user.permissions?.buttons?.leads?.delete;

    if (!isAdmin && !hasDeletePermission) {
      return res.status(403).json({ message: "Not authorized to delete leads" });
    }

    await Lead.deleteMany({ _id: { $in: ids } });

    res.json({ message: `Successfully deleted ${ids.length} leads` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
