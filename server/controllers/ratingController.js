const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const User = require("../models/User");
const { isEnrolledInCourse } = require("../middlewares/courseMiddleware"); // Import the new middleware

// Create or update a rating and review for a course
exports.createOrUpdateRatingAndReview = async (req, res) => {
    try {
        const { courseId } = req.params; // Extract courseId from URL parameters
        const { rating, review } = req.body;

        const userId = req.user.id; // Extract userId from the token (which is in req.user)

        // Validate required fields
        if (!rating || !review) {
            return res.status(400).json({
                success: false,
                message: "Rating and review are required.",
            });
        }

        // Validate rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be an integer between 1 and 5.",
            });
        }

        // Verify that the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Verify that the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Check if the user is enrolled in the course
        // This is done via the `isEnrolledInCourse` middleware before this step

        // Check if the user has already rated the course
        let existingRating = await RatingAndReview.findOne({ course: courseId, user: userId });

        if (existingRating) {
            // Update the existing rating and review
            existingRating.rating = rating;
            existingRating.review = review;
            await existingRating.save();

            return res.status(200).json({
                success: true,
                message: "Rating and review updated successfully.",
                data: existingRating,
            });
        } else {
            // Create a new rating and review
            const newRatingAndReview = new RatingAndReview({
                course: courseId,
                user: userId,
                rating,
                review,
            });

            await newRatingAndReview.save();

            return res.status(201).json({
                success: true,
                message: "Rating and review created successfully.",
                data: newRatingAndReview,
            });
        }
    } catch (error) {
        console.error("Error creating/updating rating and review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create or update rating and review.",
            error: error.message,
        });
    }
};

// Get all ratings and reviews for a specific course
exports.getRatingsAndReviewsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Verify that the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Fetch all ratings and reviews for the course
        const ratingsAndReviews = await RatingAndReview.find({ course: courseId })
            .populate("user", "firstName lastName email") // Populate user information
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Ratings and reviews retrieved successfully.",
            data: ratingsAndReviews,
        });
    } catch (error) {
        console.error("Error fetching ratings and reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve ratings and reviews.",
            error: error.message,
        });
    }
};

// Get a user's rating and review for a specific course
exports.getUserRatingAndReview = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        // Verify that the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Verify that the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Fetch the user's rating and review for the course
        const ratingAndReview = await RatingAndReview.findOne({
            course: courseId,
            user: userId,
        });

        if (!ratingAndReview) {
            return res.status(404).json({
                success: false,
                message: "Rating and review not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Rating and review retrieved successfully.",
            data: ratingAndReview,
        });
    } catch (error) {
        console.error("Error fetching user rating and review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve user rating and review.",
            error: error.message,
        });
    }
};
