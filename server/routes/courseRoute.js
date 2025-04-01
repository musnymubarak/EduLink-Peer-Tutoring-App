const express = require("express");
const router = express.Router();
const { auth, isTutor } = require("../middlewares/authMiddleware");
const {
  getAllCourses,
  getCourseById,
  addCourse,
  updateCourseById,
  deleteCourseById,
  countAllCourses, // Added the function to count all courses
} = require("../controllers/courseController");

// Public: Get All Courses
router.get("/", getAllCourses);

// Public: Get Course by ID
router.get("/:courseId", getCourseById);

// Public: Get Total Course Count
router.get("/count/all", countAllCourses); // New route to get the course count

// Admin-only: Add Course
router.post("/add", auth, isTutor, addCourse);

// Admin-only: Update Course by ID
router.put("/:courseId", auth, isTutor, updateCourseById);

// Admin-only: Delete Course by ID
router.delete("/:courseId", auth, isTutor, deleteCourseById);

module.exports = router;
