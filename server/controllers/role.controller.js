import Role from "../models/role.model.js";

//  CREATE ROLE
export const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    const roleExists = await Role.findOne({ name });
    if (roleExists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({ name });

    res.status(201).json({
      message: "Role created successfully",
      data: role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL ROLES
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: -1 });
    res.json({
      count: roles.length,
      data: roles,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET SINGLE ROLE
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  UPDATE ROLE
export const updateRole = async (req, res) => {
  try {
    const { name } = req.body;

    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true },
    );

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      message: "Role updated",
      data: role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  DELETE ROLE
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
