const Class = require("../models/Class");
const ClassRequest = require("../models/ClassRequest");
const Course = require("../models/Course");

exports.sendClassRequest = async (req, res) => {
    try {
        const { type, time } = req.body;
        const courseId = req.params.courseId;

        // Extract student ID from the logged-in user (e.g., from JWT token)
        const studentId = req.user.id; // Assuming `req.user` contains the authenticated user info

        // Validate the request
        if (!type || !time) {
            return res.status(400).json({ error: "Class type and time are required." });
        }

        // Fetch the course to verify its existence and retrieve the tutor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        const tutorId = course.tutor;

        // Check if the student is enrolled in the course
        const isEnrolled = course.studentsEnrolled.some((enrolledStudent) =>
            enrolledStudent.equals(studentId)
        );

        if (!isEnrolled) {
            return res.status(403).json({ error: "You are not enrolled in this course." });
        }

        // If the student requests a group class, check for existing group classes
        if (type === "Group") {
            const existingGroupClasses = await ClassRequest.find({
                course: courseId,
                type: "Group",
                tutor: tutorId,
            });

            if (existingGroupClasses.length > 0) {
                return res.status(200).json({
                    message: "Group classes are available for the selected course.",
                    groupClasses: existingGroupClasses,
                });
            }
        }

        // Create a new class request
        const classRequest = new ClassRequest({
            student: studentId,
            tutor: tutorId,
            course: courseId,
            type,
            time,
            status: "Pending",
        });

        await classRequest.save();

        return res.status(201).json({
            message: "Class request sent successfully.",
            classRequest,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};


// Function to handle tutor's decision on a class request
exports.handleClassRequest = async (req, res) => {
    try {
        const { requestId, status } = req.body;

        // Find the class request
        const classRequest = await ClassRequest.findById(requestId);
        if (!classRequest) {
            return res.status(404).json({ error: "Class request not found." });
        }

        // Update the request status
        classRequest.status = status;
        await classRequest.save();

        if (status === "Accepted") {
            const { student, tutor, course, type, time } = classRequest;

            if (type === "Personal") {
                // Create a new personal class
                const newClass = new Class({ student, tutor, course, type, time });
                await newClass.save();

                return res.status(201).json({
                    message: "Personal class created successfully.",
                    newClass,
                });
            } else if (type === "Group") {
                // Check if there's an existing group class for the course
                let groupClass = await Class.findOne({ course, type: "Group" });

                if (groupClass) {
                    // Add the student to the participants array
                    if (!groupClass.participants.includes(student.toString())) {
                        groupClass.participants.push(student);
                        await groupClass.save();
                    }

                    return res.status(200).json({
                        message: "Student added to the group class.",
                        groupClass,
                    });
                } else {
                    // Create a new group class if none exists
                    groupClass = new Class({
                        participants: [student],
                        tutor,
                        course,
                        type: "Group",
                        time,
                    });
                    await groupClass.save();

                    return res.status(201).json({
                        message: "New group class created successfully.",
                        groupClass,
                    });
                }
            }
        }

        res.status(200).json({ message: `Class request ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while handling the class request." });
    }
};
