const Course = require("../models/Course");

// Get all courses by the instructor
exports.getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        return res.status(200).json({
            success: true,
            message: "Courses fetched successfully.",
            data: courses,
        });
    } catch (error) {
        console.error("Error fetching instructor courses:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching instructor courses.",
        });
    }
};

// Update a course
exports.updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const updatedData = req.body;

        const updatedCourse = await Course.findOneAndUpdate(
            { _id: courseId, instructor: req.user.id },
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
        console.error("Error updating course:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating course.",
        });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const deletedCourse = await Course.findOneAndDelete({
            _id: courseId,
            instructor: req.user.id,
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
        console.error("Error deleting course:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting course.",
        });
    }
};
