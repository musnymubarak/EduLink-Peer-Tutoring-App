const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { addCourse, getAllCourses, getCourseById } = require("../controllers/courseController");

// Add Course (Admin only)
router.post("/add", auth, isAdmin, addCourse);

// Get All Courses
router.get("/", auth, getAllCourses);

// Get Course by ID
router.get("/:courseId", auth, getCourseById);

module.exports = router;
