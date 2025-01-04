const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { getStudentProfile, updateStudentProfile,changePassword } = require("../controllers/profileController");

// Endpoint to change the password
router.put("/change-password", auth, changePassword);

// Get logged-in student's profile
router.get("/student", auth, getStudentProfile);

// Update logged-in student's profile
router.put("/student", auth, updateStudentProfile);

module.exports = router;
