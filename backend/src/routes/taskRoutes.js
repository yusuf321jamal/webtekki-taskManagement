const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  getTasks,
  createTask,
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

router
  .route("/:id")
  .put(
    [
      body("status")
        .isIn(["Todo", "In Progress", "Done"])
        .withMessage("Invalid status"),
    ],
    updateTaskStatus,
  )
  .delete(deleteTask);

module.exports = router;
