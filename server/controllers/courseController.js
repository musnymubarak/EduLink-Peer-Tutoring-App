const Course = require("../models/Course");
const Category = require("../models/Category");
const Section = require("../models/Section");
const RatingAndReview = require("../models/RatingAndReview");

// Add Course (Only Admin)
exports.addCourse = async (req, res) => {
    try {
        // Verify that the user is an Admin
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Only Admins can add courses.",
            });
        }

        // Extract course details from the request body
        const {
            courseName,
            courseDescription,
            instructor,
            whatYouWillLearn,
            courseContent,
            price,
            thumbnail,
            tag,
            category,
            instructions,
            status,
        } = req.body;

        // Validate mandatory fields
        if (!courseName || !courseDescription || !price || !tag || !category) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields.",
            });
        }

        // Create a new course
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor,
            whatYouWillLearn,
            courseContent,
            price,
            thumbnail,
            tag,
            category,
            instructions,
            status,
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            data: newCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while creating the course.",
            error: error.message,
        });
    }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate("instructor", "name email") // Populate instructor details
            .populate("category", "name")       // Populate category details
            .populate("courseContent")          // Populate sections if needed
            .populate("ratingAndReviews");      // Populate reviews if needed

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            data: courses,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching courses.",
            error: error.message,
        });
    }
};

// Get a Single Course by ID
exports.getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId)
            .populate("instructor", "name email")
            .populate("category", "name")
            .populate("courseContent")
            .populate("ratingAndReviews");

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course fetched successfully.",
            data: course,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching the course.",
            error: error.message,
        });
    }
};

// Update Course by ID (Only Admin)
exports.updateCourseById = async (req, res) => {
    try {
        // Verify that the user is an Admin
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Only Admins can update courses.",
            });
        }

        const { courseId } = req.params;
        const updatedData = req.body;

        // Find and update the course
        const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while updating the course.",
            error: error.message,
        });
    }
};

// Delete Course by ID (Only Admin)
exports.deleteCourseById = async (req, res) => {
    try {
        // Verify that the user is an Admin
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "Only Admins can delete courses.",
            });
        }

        const { courseId } = req.params;

        // Find and delete the course
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while deleting the course.",
            error: error.message,
        });
    }
};
