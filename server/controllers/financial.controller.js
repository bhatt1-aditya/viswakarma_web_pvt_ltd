import Payment from "../models/payment.model.js";
import Project from "../models/project.model.js";
import AuditLog from "../models/auditLog.model.js";
import { generateInvoiceNumber } from "../utils/idGenerator.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// GET PROJECT INVOICES
export const getProjectInvoices = async (req, res) => {
  try {
    const { projectId } = req.params;

    const invoices = await Payment.find({ project: projectId })
      .populate("client", "name email phone clientId companyName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: invoices.length,
      data: invoices,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE INVOICE
export const createInvoice = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, amount, dueDate, milestoneId, notes } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const invoiceNumber = await generateInvoiceNumber();

    const invoice = await Payment.create({
      project: projectId,
      client: project.client,
      invoiceNumber,
      title,
      amount: Number(amount) || 0,
      dueDate,
      milestoneId,
      notes: notes || "",
      status: "PENDING",
    });

    // Audit Log
    await AuditLog.create({
      project: projectId,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "Admin",
      action: "INVOICE_GENERATED",
      description: `Invoice ${invoiceNumber} of ₹${amount} generated for '${title}'`,
    });

    emitToProject(projectId, "invoice_generated", invoice);

    res.status(201).json({
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// RECORD PAYMENT (MARK PAID)
export const recordPayment = async (req, res) => {
  try {
    const { invoiceId } = req.params;
    const { paymentMethod = "Bank Transfer", transactionId = "", notes = "" } = req.body;

    const invoice = await Payment.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.status = "PAID";
    invoice.paidAt = new Date();
    invoice.paymentMethod = paymentMethod;
    invoice.transactionId = transactionId;
    if (notes) invoice.notes = notes;

    await invoice.save();

    // Update advance/paid amount in Project
    await Project.findByIdAndUpdate(invoice.project, {
      $inc: { advancePaid: invoice.amount },
    });

    // Audit Log
    await AuditLog.create({
      project: invoice.project,
      actor: req.user._id,
      actorName: req.user.name,
      actorRole: req.user.roleName || "Admin",
      action: "PAYMENT_RECORDED",
      description: `Payment of ₹${invoice.amount} confirmed for ${invoice.invoiceNumber}. Ref: ${transactionId}`,
    });

    emitToProject(invoice.project.toString(), "payment_recorded", invoice);

    res.status(200).json({
      message: "Payment recorded successfully",
      data: invoice,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// FINANCIAL SUMMARY
export const getFinancialSummary = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const pendingRevenue = await Payment.aggregate([
      { $match: { status: "PENDING" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalInvoices = await Payment.countDocuments();

    res.status(200).json({
      totalPaid: totalRevenue[0]?.total || 0,
      totalPending: pendingRevenue[0]?.total || 0,
      totalInvoices,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
