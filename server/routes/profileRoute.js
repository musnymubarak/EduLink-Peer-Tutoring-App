const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/authMiddleware");
const { getStudentProfile, updateStudentProfile,changePassword, getTutorProfile, updateTutorProfile,changeTutorPassword,updateProfileImage} = require("../controllers/profileController");

// Endpoint to change the password
router.put("/change-password", auth, changePassword);

// Get logged-in student's profile
router.get("/student", auth, getStudentProfile);

// Update logged-in student's profile
router.put("/student", auth, updateStudentProfile);

// Get logged-in tutor's profile
router.get("/tutor", auth, getTutorProfile);

// Update logged-in tutor's profile
router.put("/tutor", auth, updateTutorProfile);

// Endpoint to change the tutor password
router.put("/change-tutor-password", auth, changeTutorPassword);

//Update profile picture
router.put("/update-image", auth, updateProfileImage);

module.exports = router;
