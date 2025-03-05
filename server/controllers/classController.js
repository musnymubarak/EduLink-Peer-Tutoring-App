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

        const classTime = new Date(time);
        if (isNaN(classTime.getTime())) {
            return res.status(400).json({ error: "Invalid time format." });
        }

        const startTime = new Date(classTime);
        const endTime = new Date(classTime.getTime() + 60 * 60 * 1000);

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

        const existingRequest = await ClassRequest.findOne({
            student: studentId,
            time: { 
                $gte: startTime.toISOString(), 
                $lt: endTime.toISOString() 
            },
        });

        if (existingRequest) {
            return res.status(400).json({ error: "You have already made a request for this time or within the same hour." });
        }

        const classRequest = new ClassRequest({
            student: studentId,
            tutor: tutorId,
            course: courseId,
            type,
            time: startTime,
            status: "Pending",
        });

        await classRequest.save();

        const notification = new Notification({
            user: tutorId,
            type: "ClassRequestSent",
            message: `You have received a class request from a student for the course: ${course.courseName} at ${startTime.toISOString()}.`,
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

exports.handleClassRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, classLink } = req.body;

        const classRequest = await ClassRequest.findById(requestId);
        if (!classRequest) {
            return res.status(404).json({ error: "Class request not found." });
        }

        classRequest.status = status;
        await classRequest.save();

        const studentId = classRequest.student;
        const course = await Course.findById(classRequest.course);

        if (status === "Accepted") {
            const { student, tutor, course, type, time } = classRequest;

            if (type === "Personal") {
                const newClass = new Class({ student, tutor, course, type, time, classLink });
                await newClass.save();
            } else {
                let groupClass = await Class.findOne({ course, type: "Group" });
                if (!groupClass) {
                    groupClass = new Class({ participants: [student], tutor, course, type: "Group", time, classLink });
                    await groupClass.save();
                } else {
                    if (!groupClass.participants.includes(student.toString())) {
                        groupClass.participants.push(student);
                        await groupClass.save();
                    }
                }
            }
        }

        return res.status(200).json({ message: `Class request ${status.toLowerCase()}.` });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while handling the class request." });
    }
};

exports.getClassRequestsForTutor = async (req, res) => {
    try {
        const tutorId = req.user.id;
        const classRequests = await ClassRequest.find({ tutor: tutorId })
            .populate('student', 'name email')
            .populate('course', 'title description');

        return res.status(200).json({
            message: "Class requests retrieved successfully.",
            classRequests,
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching class requests." });
    }
};

exports.getStudentClassRequests = async (req, res) => {
    try {
        const studentId = req.user.id;
        const classRequests = await ClassRequest.find({ student: studentId })
            .populate('tutor', 'name email')
            .populate('course', 'title description');

        return res.status(200).json({
            message: "Class requests retrieved successfully.",
            classRequests,
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching class requests." });
    }
};

exports.getAcceptedClasses = async (req, res) => {
    try {
        const studentId = req.user.id;
        const acceptedClasses = await Class.find({ participants: studentId })
            .populate('tutor', 'name email')
            .populate('course', 'title description');

        return res.status(200).json({
            message: "Accepted classes retrieved successfully.",
            acceptedClasses,
        });
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while fetching accepted classes." });
    }
};
