import Task from "../models/task.model.js";
import AuditLog from "../models/auditLog.model.js";
import { emitToProject, emitToUser } from "../socket/socketHandler.js";

// GET PROJECT TASKS
export const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, assignedTo } = req.query;

    let query = { project: projectId };
    if (status && status !== "ALL") query.status = status;
    if (assignedTo && assignedTo !== "ALL") query.assignedTo = assignedTo;

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email phone")
      .populate("createdBy", "name email")
      .populate("comments.user", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: tasks.length,
      data: tasks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, priority = "MEDIUM", deadline, tags, milestoneId } = req.body;

    const task = await Task.create({
      project: projectId,
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      priority,
      deadline,
      tags: tags || [],
      milestoneId,
      status: "TODO",
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    emitToProject(projectId, "task_created", populatedTask);

    if (assignedTo) {
      emitToUser(assignedTo.toString(), "task_assigned", populatedTask);
    }

    res.status(201).json({
      message: "Task created successfully",
      data: populatedTask,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK STATUS (COLUMN DRAG-AND-DROP)
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const validStatuses = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED", "BLOCKED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const oldStatus = task.status;
    task.status = status;
    if (status === "COMPLETED") {
      task.completedAt = new Date();
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    emitToProject(task.project.toString(), "task_status_changed", {
      taskId: task._id,
      oldStatus,
      newStatus: status,
      task: populatedTask,
      updatedBy: req.user.name,
    });

    res.status(200).json({
      message: `Task moved to ${status}`,
      data: populatedTask,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TASK DETAILS
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndUpdate(taskId, { $set: req.body }, { new: true })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    emitToProject(task.project.toString(), "task_updated", task);

    res.status(200).json({
      message: "Task updated successfully",
      data: task,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD TASK COMMENT
export const addTaskComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.comments.push({
      user: req.user._id,
      text,
      createdAt: new Date(),
    });

    await task.save();

    const updatedTask = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("comments.user", "name role");

    emitToProject(task.project.toString(), "task_comment_added", {
      taskId: task._id,
      task: updatedTask,
    });

    res.status(200).json({
      message: "Comment added",
      data: updatedTask,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    emitToProject(task.project.toString(), "task_deleted", { taskId });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
