const Class = require("../models/Class");
const ClassRequest = require("../models/ClassRequest");
const Course = require("../models/Course");
const Notification = require("../models/Notification");

exports.sendClassRequest = async (req, res) => {
    try {
        const { type, time } = req.body;
        const courseId = req.params.courseId;
        const studentId = req.user.id;

        if (!type || !time) {
            return res.status(400).json({ error: "Class type and time are required." });
        }

        // Convert the time string to a Date object
        const classTime = new Date(time);
        if (isNaN(classTime.getTime())) {
            return res.status(400).json({ error: "Invalid time format." });
        }

        // Convert the time to UTC for uniformity
        const startTime = new Date(classTime);
        const endTime = new Date(classTime.getTime() + 60 * 60 * 1000); // 1 hour after the start time

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        const tutorId = course.tutor;

        const isEnrolled = course.studentsEnrolled.some((enrolledStudent) =>
            enrolledStudent.equals(studentId)
        );

        if (!isEnrolled) {
            return res.status(403).json({ error: "You are not enrolled in this course." });
        }

        // Check if the student already has a request for this time or within the same hour
        const existingRequest = await ClassRequest.findOne({
            student: studentId,
            time: { 
                $gte: startTime.toISOString(), 
                $lt: endTime.toISOString() 
            }, // Check for the same hour span
        });

        if (existingRequest) {
            return res.status(400).json({ error: "You have already made a request for this time or within the same hour." });
        }

        // Proceed with creating the class request
        const classRequest = new ClassRequest({
            student: studentId,
            tutor: tutorId,
            course: courseId,
            type,
            time: startTime, // Store the time in a standard format
            status: "Pending",
        });

        await classRequest.save();

        // Create a notification for the tutor
        const notification = new Notification({
            user: tutorId,
            type: "ClassRequestSent",
            message: `You have received a class request from a student for the course: ${course.title} at ${startTime.toISOString()}.`,
        });

        await notification.save();

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

        // Create a notification for the student based on the status of the request
        const studentId = classRequest.student;
        const course = await Course.findById(classRequest.course);

        if (status === "Accepted") {
            const { student, tutor, course, type, time } = classRequest;

            if (type === "Personal") {
                // Create a new personal class
                const newClass = new Class({ student, tutor, course, type, time });
                await newClass.save();

                // Notify student about the acceptance
                const notification = new Notification({
                    user: studentId,
                    type: "ClassRequestHandled",
                    message: `Your class request for the course "${course.title}" has been accepted. Personal class scheduled at ${time.toISOString()}.`,
                });

                await notification.save();

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

                    // Notify student about the acceptance
                    const notification = new Notification({
                        user: studentId,
                        type: "ClassRequestHandled",
                        message: `Your class request for the course "${course.title}" has been accepted. You are added to the group class at ${groupClass.time.toISOString()}.`,
                    });

                    await notification.save();

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

                    // Notify student about the creation of the group class
                    const notification = new Notification({
                        user: studentId,
                        type: "ClassRequestHandled",
                        message: `Your class request for the course "${course.title}" has been accepted. A new group class has been scheduled at ${groupClass.time.toISOString()}.`,
                    });

                    await notification.save();

                    return res.status(201).json({
                        message: "New group class created successfully.",
                        groupClass,
                    });
                }
            }
        } else if (status === "Rejected") {
            // Notify student about the rejection
            const notification = new Notification({
                user: studentId,
                type: "ClassRequestHandled",
                message: `Your class request for the course "${course.title}" has been rejected by the tutor.`,
            });

            await notification.save();
        }

        res.status(200).json({ message: `Class request ${status.toLowerCase()}.` });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while handling the class request." });
    }
};


exports.getClassRequestsForTutor = async (req, res) => {
    try {
        const tutorId = req.user.id;  // Get tutor's ID from the logged-in user
        
        // Check if tutorId is valid
        if (!tutorId) {
            return res.status(400).json({ error: "Tutor ID not found." });
        }

        // Fetch all class requests for this tutor
        const classRequests = await ClassRequest.find({ tutor: tutorId })
            .populate('student', 'name email')  // Optionally populate student details
            .populate('course', 'title description'); // Optionally populate course details

        // If no class requests are found
        if (classRequests.length === 0) {
            return res.status(404).json({ message: "No class requests found for this tutor." });
        }

        // Return the fetched class requests
        return res.status(200).json({
            message: "Class requests retrieved successfully.",
            classRequests,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching class requests." });
    }
};

// Function to fetch class requests made by the student
exports.getStudentClassRequests = async (req, res) => {
    try {
        const studentId = req.user.id;  // Get student's ID from the logged-in user
        
        // Check if studentId is valid
        if (!studentId) {
            return res.status(400).json({ error: "Student ID not found." });
        }

        // Fetch all class requests made by this student
        const classRequests = await ClassRequest.find({ student: studentId })
            .populate('tutor', 'name email')  // Optionally populate tutor details
            .populate('course', 'title description'); // Optionally populate course details

        // If no class requests are found
        if (classRequests.length === 0) {
            return res.status(404).json({ message: "No class requests found for this student." });
        }

        // Return the fetched class requests
        return res.status(200).json({
            message: "Class requests retrieved successfully.",
            classRequests,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching class requests." });
    }
};

// Function to fetch accepted classes for the student (personal or group)
exports.getAcceptedClasses = async (req, res) => {
    try {
        const studentId = req.user.id;  // Get student's ID from the logged-in user
        
        // Check if studentId is valid
        if (!studentId) {
            return res.status(400).json({ error: "Student ID not found." });
        }

        // Fetch accepted personal and group classes for this student
        const acceptedClasses = await Class.find({
            participants: studentId,  // Check if the student is in the participants array
        })
            .populate('tutor', 'name email')  // Optionally populate tutor details
            .populate('course', 'title description'); // Optionally populate course details

        // If no accepted classes are found
        if (acceptedClasses.length === 0) {
            return res.status(404).json({ message: "No accepted classes found for this student." });
        }

        // Return the fetched accepted classes
        return res.status(200).json({
            message: "Accepted classes retrieved successfully.",
            acceptedClasses,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while fetching accepted classes." });
    }
};

