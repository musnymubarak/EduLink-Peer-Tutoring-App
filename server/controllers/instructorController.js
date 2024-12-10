const Course = require("../models/Course");
const mongoose = require("mongoose");

// Add a new course
exports.addCourse = async (req, res) => {
    try {
        const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            courseContent,
            price,
            thumbnail,
            tag,
            category,
            instructions,
        } = req.body;

        // Validate required fields
        if (!courseName || !courseDescription || !price || !tag || !category) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing.",
            });
        }

        // Validate category is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category ID.",
            });
        }

        // Create a new course with the logged-in instructor as the creator
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: req.user.id, // Use the instructor's ID from the authenticated user
            whatYouWillLearn,
            courseContent,
            price,
            thumbnail,
            tag,
            category,
            instructions,
            status: "Draft", // Default to draft
        });

        return res.status(201).json({
            success: true,
            message: "Course created successfully.",
            data: newCourse,
        });
    } catch (error) {
        console.error("Error adding course:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error adding course.",
            error: error.message,
        });
    }
};

// Get all courses created by the instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });

        if (!courses.length) {
            return res.status(404).json({
                success: false,
                message: "No courses found for this instructor.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching instructor courses:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error fetching instructor courses.",
            error: error.message,
        });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updatedData = req.body;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID.",
            });
        }

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId, instructor: req.user.id }, // Ensure the course belongs to the instructor
            updatedData,
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found or unauthorized to update.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully.",
            data: updatedCourse,
        });
    } catch (error) {
        console.error("Error updating course:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error updating course.",
            error: error.message,
        });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validate courseId
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid course ID.",
            });
        }

        const deletedCourse = await Course.findOneAndDelete({
            _id: courseId,
            instructor: req.user.id, // Ensure the course belongs to the instructor
        });

        if (!deletedCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found or unauthorized to delete.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting course:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error deleting course.",
            error: error.message,
        });
    }
};
