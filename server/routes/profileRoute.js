const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { getStudentProfile, updateStudentProfile } = require("../controllers/profileController");

// Get logged-in student's profile
router.get("/student", auth, getStudentProfile);

// Update logged-in student's profile
router.put("/student", auth, updateStudentProfile);

module.exports = router;
