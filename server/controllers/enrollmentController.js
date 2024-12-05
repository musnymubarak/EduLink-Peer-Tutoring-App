const Course = require("../models/Course");
const User = require("../models/User");

// Enroll a Student in a Course
exports.enrollInCourse = async (req, res) => {
    try {
        const userId = req.user._id; // Extract user ID from the authenticated user
        const { courseId } = req.params; // Extract course ID from the request parameters

        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        // Check if the user is already enrolled
        if (course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You are already enrolled in this course.",
            });
        }

        // Add the user to the course's enrolled students
        course.studentsEnrolled.push(userId);
        await course.save();

        // Update the user's enrolled courses
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        user.enrolledCourses.push(courseId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Enrolled in the course successfully.",
            data: {
                courseId: course._id,
                userId: user._id,
                courseName: course.courseName,
                userName: user.name,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error enrolling in the course.",
            error: error.message,
        });
    }
};