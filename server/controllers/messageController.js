const CommunityMessage = require("../models/CommunityMessage");
const Course = require("../models/Course");
const User = require("../models/User");

// Create a new community message
exports.createCommunityMessage = async (req, res) => {
    try {
        const { courseId, userId, message } = req.body;

        // Validate required fields
        if (!courseId || !userId || !message) {
            return res.status(400).json({
                success: false,
                message: "Course ID, User ID, and message are required.",
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

        // Check if the user is enrolled in the course by checking the studentsEnrolled array
        if (!course.studentsEnrolled.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "User is not enrolled in this course.",
            });
        }

        // Create the community message
        const newCommunityMessage = await CommunityMessage.create({
            courseId,
            userId,
            message,
        });

        return res.status(201).json({
            success: true,
            message: "Community message created successfully.",
            data: newCommunityMessage,
        });
    } catch (error) {
        console.error("Error creating community message:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create community message.",
            error: error.message,
        });
    }
};

// Get all community messages for a specific course
exports.getCommunityMessagesByCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        // Validate that the course exists
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

        // Check if the user is enrolled in the course by checking the studentsEnrolled array
        if (!course.studentsEnrolled.includes(userId)) {
            return res.status(403).json({
                success: false,
                message: "User is not enrolled in this course.",
            });
        }

        // Fetch all messages for the given course
        const messages = await CommunityMessage.find({ courseId })
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Community messages retrieved successfully.",
            data: messages,
        });
    } catch (error) {
        console.error("Error fetching community messages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve community messages.",
            error: error.message,
        });
    }
};
