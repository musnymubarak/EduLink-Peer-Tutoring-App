const Course = require('../models/Course');
const User = require('../models/User');  // Import the User model

exports.assignInstructorToCourse = async (req, res) => {
    const { courseId } = req.params;  // Extract courseId from the URL
    const instructorId = req.user._id;  // Get the instructor ID from the authenticated user (from the middleware)

    if (!courseId || !instructorId) {
        return res.status(400).json({ success: false, message: "Missing courseId or instructorId." });
    }

    try {
        // Check if the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        // Check if the instructor is already assigned (optional check)
        if (course.availableInstructors.includes(instructorId)) {
            return res.status(400).json({ success: false, message: "Instructor is already assigned to this course." });
        }

        // Add instructor to the course's availableInstructors array
        course.availableInstructors.push(instructorId);
        await course.save();

        // Find the instructor (User) and update their courses array
        const instructor = await User.findById(instructorId);
        if (!instructor) {
            return res.status(404).json({ success: false, message: "Instructor not found." });
        }

        // Check if the course is already in the instructor's courses array
        if (!instructor.courses.includes(courseId)) {
            instructor.courses.push(courseId);
            await instructor.save();
        }

        return res.status(200).json({
            success: true,
            message: "Instructor assigned to course successfully.",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while assigning instructor.",
            error: error.message,
        });
    }
};
