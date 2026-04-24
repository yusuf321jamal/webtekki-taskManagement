const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

const getTasks = async (req, res) => {
  try {
    const { projectId } = req.query;
    let query = { user: req.user._id };

    if (projectId) {
      query.project = projectId;
    }

    const tasks = await Task.find(query)
      .populate("project", "name")
      .sort("-createdAt");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, status, projectId } = req.body;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "Todo",
      project: projectId,
      user: req.user._id,
    });

    const populatedTask = await Task.findById(task._id).populate(
      "project",
      "name",
    );
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// FULL TASK UPDATE - Updates title, description, and status
const updateTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Update all fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status && ["Todo", "In Progress", "Done"].includes(status)) {
      task.status = status;
    }

    task.updatedAt = Date.now();
    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id).populate(
      "project",
      "name",
    );
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// STATUS ONLY UPDATE
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Todo", "In Progress", "Done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    task.status = status;
    task.updatedAt = Date.now();
    const updatedTask = await task.save();

    const populatedTask = await Task.findById(updatedTask._id).populate(
      "project",
      "name",
    );
    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    res.json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
