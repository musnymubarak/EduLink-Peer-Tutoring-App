const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/authMiddleware");
const { 
    addCourse, 
    getAllCourses, 
    getCourseById, 
    updateCourseById, 
    deleteCourseById 
} = require("../controllers/courseController");

// Public: Get All Courses
router.get("/", getAllCourses);

// Public: Get Course by ID
router.get("/:courseId", getCourseById);

// Admin-only: Add Course
router.post("/add", auth, isAdmin, addCourse);

// Admin-only: Update Course by ID
router.put("/:courseId", auth, isAdmin, updateCourseById);

// Admin-only: Delete Course by ID
router.delete("/:courseId", auth, isAdmin, deleteCourseById);

module.exports = router;
