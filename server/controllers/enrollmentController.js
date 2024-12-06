const Course = require("../models/Course");
const User = require("../models/User");

// Enroll a Student in a Course
exports.enrollInCourse = async (req, res) => {
    try {
        const userId = req.user._id; // Extract user ID from the authenticated user
        const { courseId } = req.params; // Extract course ID from the request parameters

        console.log("User ID:", userId);
        console.log("Course ID:", courseId);

        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        console.log("Course before enrolling:", course);

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

        console.log("Course after enrolling:", course);

        // Update the user's enrolled courses (use courses field)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        console.log("User before adding course:", user);

        // Add the course ID to the user's courses array if not already added
        if (!user.courses.includes(courseId)) {
            user.courses.push(courseId);
            console.log("User after adding course:", user);
            await user.save(); // Save the updated user document
        } else {
            console.log("Course already exists in user's courses array.");
        }

        return res.status(200).json({
            success: true,
            message: "Enrolled in the course successfully.",
            data: {
                courseId: course._id,
                userId: user._id,
                courseName: course.courseName,
                userName: ${user.firstName} ${user.lastName},
            },
        });
    } catch (error) {
        console.error("Error enrolling in the course:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error enrolling in the course.",
            error: error.message,
        });
    }
};

// Unenroll a Student from a Course

exports.unenrollFromCourse = async (req, res) => {
    try {
        const userId = req.user._id; // Extract user ID from the authenticated user
        const { courseId } = req.params; // Extract course ID from the request parameters

        console.log("User ID:", userId);
        console.log("Course ID:", courseId);

        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found.",
            });
        }

        console.log("Course before unenrolling:", course);

        // Remove any null values from the studentsEnrolled array before processing
        course.studentsEnrolled = course.studentsEnrolled.filter(studentId => studentId !== null);

        // Check if the user is enrolled in the course
        if (!course.studentsEnrolled.includes(userId)) {
            return res.status(400).json({
                success: false,
                message: "You are not enrolled in this course.",
            });
        }

        // Remove the user from the course's enrolled students
        course.studentsEnrolled = course.studentsEnrolled.filter(
            (studentId) => studentId.toString() !== userId.toString()
        );
        await course.save();

        console.log("Course after unenrolling:", course);

        // Update the user's enrolled courses (use courses field)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        console.log("User before removing course:", user);

        // Remove the course ID from the user's courses array
        user.courses = user.courses.filter(
            (courseIdInUser) => courseIdInUser.toString() !== courseId.toString()
        );
        await user.save();

        console.log("User after removing course:", user);

        return res.status(200).json({
            success: true,
            message: "Successfully unenrolled from the course.",
            data: {
                courseId: course._id,
                userId: user._id,
                courseName: course.courseName,
                userName: ${user.firstName} ${user.lastName},
            },
        });
    } catch (error) {
        console.error("Error unenrolling from the course:", error.message);
        return res.status(500).json({
            success: false,
            message: "Error unenrolling from the course.",
            error: error.message,
        });
    }
};