const express = require("express");
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getProjects)
  .post(
    [
      body("name")
        .notEmpty()
        .withMessage("Project name is required")
        .isLength({ min: 3 })
        .withMessage("Project name must be at least 3 characters"),
      body("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    ],
    createProject,
  );

router
  .route("/:id")
  .put(
    [
      body("name")
        .optional()
        .isLength({ min: 3 })
        .withMessage("Project name must be at least 3 characters"),
      body("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    ],
    updateProject,
  )
  .delete(deleteProject);

module.exports = router;
