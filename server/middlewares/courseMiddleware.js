const Course = require("../models/Course");

exports.isEnrolledInCourse = async (req, res, next) => {
    try {
        const { courseId } = req.body; // Get courseId from the request body

        // Log the courseId for debugging purposes
        console.log("Received courseId:", courseId);

        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Log the course data for debugging purposes
        console.log("Course found:", course);

        // Ensure that the logged-in user exists and is attached to the request
        console.log("User ID:", req.user ? req.user._id : "User not logged in");

        // Check if the logged-in user is enrolled in the course
        const isEnrolled = await Course.findOne({
            _id: courseId,
            studentsEnrolled: req.user._id,
        });

        if (!isEnrolled) {
            return res.status(403).json({
                success: false,
                message: "You must be enrolled in the course to post a rating or review.",
            });
        }

        // If the user is enrolled, continue with the next middleware/route handler
        next();
    } catch (error) {
        console.error("Error checking if user is enrolled:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to verify enrollment status.",
            error: error.message,
        });
    }
};
