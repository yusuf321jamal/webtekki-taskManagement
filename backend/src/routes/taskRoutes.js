const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
  updateTask, // ← ADD THIS - Full task update
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getTasks)
  .post(
    [
      body("title")
        .notEmpty()
        .withMessage("Task title is required")
        .isLength({ min: 3 })
        .withMessage("Task title must be at least 3 characters"),
      body("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),
      body("projectId").notEmpty().withMessage("Project ID is required"),
      body("status")
        .optional()
        .isIn(["Todo", "In Progress", "Done"])
        .withMessage("Invalid status"),
    ],
    createTask,
  );

// FULL TASK UPDATE ROUTE (title, description, status)
router
  .route("/:id")
  .put(updateTask) // ← CHANGE THIS - Use updateTask instead of updateTaskStatus
  .delete(deleteTask);

// Optional: Keep status-only update as a separate route
router.route("/:id/status").patch(updateTaskStatus);

module.exports = router;
