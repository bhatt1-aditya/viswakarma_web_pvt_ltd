import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";

// AUTH PROTECT MIDDLEWARE
export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("role");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    let roleName = user.role?.name ? user.role.name.toLowerCase().trim() : "";
    if (user.isClient && (!roleName || roleName === "staff")) {
      roleName = "client";
    }

    req.user = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      state: user.state,
      role: user.role,
      roleName: roleName,
      permissions: user.permissions || {},
      isClient: user.isClient || false,
      clientId: user.clientId || null,
    };

    next();
  } catch (error) {
    res.status(401).json({ error: error.message, message: "Invalid or expired token" });
  }
};

// ROLE-BASED ACCESS CONTROL (RBAC)
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRole = (req.user.roleName || "").toLowerCase().trim();

    // Super Admin always has universal bypass
    if (userRole === "super admin" || userRole === "superadmin") {
      return next();
    }

    const normalizedAllowed = allowedRoles.flatMap((r) => {
      const lower = r.toLowerCase().trim();
      if (lower === "project manager") return ["project manager", "projectmanager", "pm"];
      if (lower === "developer") return ["developer", "dev"];
      if (lower === "qa tester") return ["qa tester", "qatester", "qa"];
      if (lower === "super admin") return ["super admin", "superadmin"];
      return [lower];
    });

    if (normalizedAllowed.includes(userRole)) {
      return next();
    }

    return res.status(403).json({
      message: `Access denied. Role '${req.user.roleName || "User"}' is not authorized to access this resource.`,
    });
  };
};

// VERIFY PROJECT MEMBERSHIP MIDDLEWARE
export const verifyProjectMember = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id || req.body.projectId || req.query.projectId;

    if (!projectId) {
      return res.status(400).json({ message: "Project ID is required" });
    }

    const userRole = (req.user.roleName || "").toLowerCase().trim();

    // Super Admin and Admin have enterprise visibility
    if (userRole === "super admin" || userRole === "superadmin" || userRole === "admin") {
      const project = await Project.findById(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });
      req.project = project;
      return next();
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userIdStr = req.user._id.toString();

    const isClient = project.client && project.client.toString() === userIdStr;
    const isPM = project.assignedProjectManager && project.assignedProjectManager.toString() === userIdStr;
    const isQA = project.assignedQATester && project.assignedQATester.toString() === userIdStr;
    const isTelecaller = project.assignedTelecaller && project.assignedTelecaller.toString() === userIdStr;
    const isDeveloper = Array.isArray(project.assignedDevelopers) &&
      project.assignedDevelopers.some((devId) => devId.toString() === userIdStr);

    if (isClient || isPM || isQA || isTelecaller || isDeveloper) {
      req.project = project;
      return next();
    }

    return res.status(403).json({
      message: "Access denied. You are not an assigned member of this project.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
