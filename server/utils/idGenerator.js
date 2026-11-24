import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import BugReport from "../models/bugReport.model.js";
import Payment from "../models/payment.model.js";

const currentYear = new Date().getFullYear();

export const generateClientId = async () => {
  const count = await User.countDocuments({ isClient: true });
  const sequence = String(count + 1).padStart(4, "0");
  return `VK-CL-${currentYear}-${sequence}`;
};

export const generateProjectId = async () => {
  const count = await Project.countDocuments();
  const sequence = String(count + 1).padStart(4, "0");
  return `VK-PRJ-${currentYear}-${sequence}`;
};

export const generateBugId = async () => {
  const count = await BugReport.countDocuments();
  const sequence = String(count + 1).padStart(4, "0");
  return `BUG-${currentYear}-${sequence}`;
};

export const generateInvoiceNumber = async () => {
  const count = await Payment.countDocuments();
  const sequence = String(count + 1).padStart(4, "0");
  return `INV-${currentYear}-${sequence}`;
};
