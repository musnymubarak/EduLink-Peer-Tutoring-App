const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/authMiddleware");
const {
    addCourse,
    getAllCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
    getInstructorCourses,
} = require("../controllers/instructorController");

// Route to add a course (Instructor)
router.post("/add", auth, isInstructor, addCourse);

// Route to get all courses (Instructor-specific)
router.get("/instructor", auth, isInstructor, getInstructorCourses);

// Route to update a course (Instructor-specific)
router.put("/:courseId", auth, isInstructor, updateCourse);

// Route to delete a course (Instructor-specific)
router.delete("/:courseId", auth, isInstructor, deleteCourse);

// Route to get a single course by ID
router.get("/:courseId", auth, getCourseById);

module.exports = router;
