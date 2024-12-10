const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/authMiddleware");
const {
    addCourse,
    getInstructorCourses,
    updateCourse,
    deleteCourse,
} = require("../controllers/instructorController");

// Route to add a new course
router.post("/add", auth, isInstructor, addCourse);

// Route to get all courses created by the instructor
router.get("/", auth, isInstructor, getInstructorCourses);

// Route to update a specific course
router.put("/:courseId", auth, isInstructor, updateCourse);

// Route to delete a specific course
router.delete("/:courseId", auth, isInstructor, deleteCourse);

module.exports = router;
