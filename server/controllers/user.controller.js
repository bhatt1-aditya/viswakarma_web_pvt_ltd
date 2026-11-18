import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import { generateToken } from "../utils/token.js";

//  CREATE USER
export const createUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, permissions, state } = req.body;

    const isAdmin = ["admin", "superadmin"].includes(req.user?.role?.name);
    const canAdd = req.user?.permissions?.buttons?.staff?.add;

    if (!isAdmin && !canAdd) {
      return res.status(403).json({ message: "Not authorized to add staff" });
    }

    const roleExists = await Role.findById(role);
    if (!roleExists) return res.status(400).json({ message: "Invalid role" });

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const user = await User.create({
      name,
      email,
      phone,
      state: state || "All",
      password,
      role,
      permissions: permissions || undefined,
    });

    const userResponse = await User.findById(user._id).populate("role");
    res.status(201).json({ message: "User created", data: userResponse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  LOGIN
export const loginUser = async (req, res) => {
  try {
    const { phone, email, identifier, password } = req.body;

    const input = (identifier || email || phone || "").trim();
    if (!input) {
      return res.status(400).json({ message: "Email or phone number is required" });
    }

    let query = {};
    if (input.includes("@")) {
      query = { email: input.toLowerCase() };
    } else {
      query = {
        $or: [
          { phone: input },
          { email: input.toLowerCase() },
        ],
      };
    }

    const user = await User.findOne(query)
      .select("+password")
      .populate("role");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let roleTitle = "staff";
    if (user.role && typeof user.role === "object" && user.role.name) {
      roleTitle = user.role.name;
    } else if (user.role) {
      const foundRole = await Role.findById(user.role);
      if (foundRole) roleTitle = foundRole.name;
    }

    const token = generateToken({
      id: user._id,
      role: roleTitle,
      permissions: user.permissions || {},
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    const userObj = user.toObject();
    delete userObj.password;
    if (typeof userObj.role === "string" || !userObj.role?.name) {
      userObj.role = { _id: user.role, name: roleTitle };
    }

    res.status(200).json({
      message: "Login successful",
      token,
      data: userObj,
      user: userObj,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, role } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query)
      .populate("role")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      count: users.length,
      data: users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  GET SINGLE USER
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userObj = user.toObject();
    if (!userObj.role || typeof userObj.role === "string" || !userObj.role.name) {
      if (user.role) {
        const found = await Role.findById(user.role);
        userObj.role = found ? found.toObject() : { name: "staff" };
      } else {
        userObj.role = { name: "staff" };
      }
    }

    res.json(userObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, permissions, state } = req.body;

    const isAdmin = ["admin", "superadmin"].includes(req.user?.role?.name);
    const canEdit = req.user?.permissions?.buttons?.staff?.edit;

    if (!isAdmin && !canEdit) {
      return res.status(403).json({ message: "Not authorized to edit staff" });
    }

    if (role) {
      const roleExists = await Role.findById(role);
      if (!roleExists) return res.status(400).json({ message: "Invalid role" });
    }

    const updateFields = { name, email, phone, role, permissions };
    if (state !== undefined) {
      updateFields.state = state;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true },
    ).populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", data: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const isAdmin = ["admin", "superadmin"].includes(req.user?.role?.name);
    const canDelete = req.user?.permissions?.buttons?.staff?.delete;

    if (!isAdmin && !canDelete) {
      return res.status(403).json({ message: "Not authorized to delete staff" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
