const express = require("express");
const { createOrUpdateRatingAndReview, getRatingsAndReviewsByCourse, getUserRatingAndReview } = require("../controllers/ratingController");
const { auth, isStudent } = require("../middlewares/authMiddleware");
const { isEnrolledInCourse } = require("../middlewares/courseMiddleware");

const router = express.Router();

// Create or update a rating and review for a course
router.post(
    "/:courseId",
    auth, 
    isStudent, 
    createOrUpdateRatingAndReview
);

// Get all ratings and reviews for a specific course
router.get("/:courseId", getRatingsAndReviewsByCourse);

// Get a user's rating and review for a specific course
router.get("/:courseId/user/:userId", getUserRatingAndReview);

module.exports = router;
