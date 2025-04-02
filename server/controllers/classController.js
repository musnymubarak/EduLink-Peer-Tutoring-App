const Class = require("../models/Class");
const ClassRequest = require("../models/ClassRequest");
const Course = require("../models/Course");
const Notification = require("../models/Notification");
const cron = require("node-cron");

exports.sendClassRequest = async (req, res) => {
    try {
        const { type, time, duration } = req.body;
        const courseId = req.params.courseId;
        const studentId = req.user.id;

        if (!type || !time || !duration) {
            return res.status(400).json({ error: "Class type, duration and time are required." });
        }

        const classTime = new Date(time);
        if (isNaN(classTime.getTime())) {
            return res.status(400).json({ error: "Invalid time format." });
        }

        const startTime = new Date(classTime);
        const endTime = new Date(classTime.getTime() + duration * 60 * 1000);

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
            duration,
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

        console.log("Received Request Details:", { requestId, status, classLink });

        const classRequest = await ClassRequest.findById(requestId)
            .populate("student")
            .populate("tutor")
            .populate("course");

        if (!classRequest) {
            console.error("Class request not found for ID:", requestId);
            return res.status(404).json({ error: "Class request not found." });
        }

        console.log("Full Class Request Object:", JSON.stringify(classRequest, null, 2));

        // Validate essential fields
        if (!classRequest.student) {
            console.error("No student found in class request");
            return res.status(400).json({ error: "Student information is missing" });
        }

        if (!classRequest.tutor) {
            console.error("No tutor found in class request");
            return res.status(400).json({ error: "Tutor information is missing" });
        }

        if (!classRequest.course) {
            console.error("No course found in class request");
            return res.status(400).json({ error: "Course information is missing" });
        }

        classRequest.status = status;
        await classRequest.save();

        if (status === "Accepted") {
            try {
                if (classRequest.type === "Personal") {
                    console.log("Creating Personal Class");
                    const newClass = new Class({
                        student: classRequest.student._id,
                        tutor: classRequest.tutor._id,
                        course: classRequest.course._id,
                        type: "Personal",
                        time: classRequest.time,
                        duration: classRequest.duration,
                        classLink: classLink || "",
                        status: "Accepted"
                    });

                    console.log("New Class Object:", JSON.stringify(newClass, null, 2));
                    await newClass.save();
                    console.log("Personal Class Created Successfully");
                } else if (classRequest.type === "Group") {
                    console.log("Creating/Updating Group Class");
                    let groupClass = await Class.findOne({ 
                        course: classRequest.course._id, 
                        type: "Group" 
                    });

                    if (!groupClass) {
                        groupClass = new Class({
                            participants: [classRequest.student._id],
                            tutor: classRequest.tutor._id,
                            course: classRequest.course._id,
                            type: "Group",
                            time: classRequest.time,
                            duration: classRequest.duration,
                            classLink: classLink || "",
                            status: "Accepted"
                        });
                    } else {
                        if (!groupClass.participants.includes(classRequest.student._id.toString())) {
                            groupClass.participants.push(classRequest.student._id);
                        }
                        groupClass.classLink = classLink || groupClass.classLink;
                    }

                    await groupClass.save();
                    console.log("Group Class Created/Updated Successfully");
                }
            } catch (classCreationError) {
                console.error("Error in class creation:", classCreationError);
                return res.status(500).json({ 
                    error: "Failed to create class", 
                    details: classCreationError.message 
                });
            }
        }

        const notificationMessage =
            status === "Accepted"
                ? `Your class request for ${classRequest.course.courseName} has been accepted.`
                : `Your class request for ${classRequest.course.courseName} has been rejected.`;

        const notification = new Notification({
            user: classRequest.student._id, 
            message: notificationMessage,
            type: "ClassRequestHandled", 
            status: "unread"
        });

        await notification.save();
        console.log("Notification Sent Successfully");

        return res.status(200).json({ 
            message: `Class request ${status.toLowerCase()} successfully.`,
            type: classRequest.type
        });

    } catch (error) {
        console.error("Comprehensive Error in handleClassRequest:", error);
        return res.status(500).json({ 
            error: "An error occurred while handling the class request.", 
            details: error.message 
        });
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
      const userId = req.user.id;
      const userRole = req.user.accountType;
      
      let query = { status: "Accepted" };
      
      if (userRole === "Tutor") {
        query.tutor = userId;
      } else {
        query.$or = [
          { type: "Personal", student: userId },
          { type: "Group", participants: userId }
        ];
      }
      
      console.log(query.tutor);
      const acceptedClasses = await Class.find(query)
        .populate('tutor', 'firstName email')
        .populate('course', 'courseName courseDescription')
        .populate('student', 'firstName email') 
        .populate('participants', 'firstName email'); 
      
      return res.status(200).json({
        message: "Accepted classes retrieved successfully.",
        acceptedClasses,
      });
    } catch (error) {
      console.error("Error fetching accepted classes:", error);
      return res.status(500).json({
        error: "An error occurred while fetching accepted classes.",
        details: error.message
      });
    }
  };

// Function to delete a class after its duration
const scheduleClassDeletion = (classId, duration) => {
    const deletionTime = duration * 60 * 1000; // Convert duration to milliseconds
    setTimeout(async () => {
        try {
            await Class.findByIdAndDelete(classId);
            console.log(`Class ${classId} deleted after ${duration} minutes.`);
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    }, deletionTime);
};

// Example usage in createGroupClass
exports.createGroupClass = async (req, res) => {
    try {
        const { time, classLink, duration } = req.body; // Add duration to the request body
        const courseId = req.params.courseId;
        const tutorId = req.user.id;

        // Validate input
        if (!time || !duration) {
            return res.status(400).json({ error: "Class time and duration are required." });
        }

        const classTime = new Date(time);
        if (isNaN(classTime.getTime())) {
            return res.status(400).json({ error: "Invalid time format." });
        }

        // Disallow past times
        const currentTime = new Date();
        if (classTime < currentTime) {
            return res.status(400).json({ error: "Cannot create a class in the past." });
        }

        // Check if the course exists and the user is the tutor
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found." });
        }

        if (!course.tutor.equals(tutorId)) {
            return res.status(403).json({ error: "You are not authorized to create a group class for this course." });
        }

        // Define the time range for the new class
        const startTime = new Date(classTime);
        const endTime = new Date(classTime.getTime() + duration * 60 * 1000); // Calculate end time

        console.log("New Class Time Range:", startTime, "to", endTime);

        // Check for overlapping classes
        const overlappingClass = await Class.findOne({
            course: courseId,
            type: "Group",
            $or: [
                // Case 1: New class starts within an existing class
                {
                    time: { $gte: startTime, $lt: endTime },
                },
                // Case 2: Existing class starts within the new class
                {
                    time: { $lt: endTime },
                    $expr: { $gt: [{ $add: ["$time", duration * 60 * 1000] }, startTime] },
                },
            ],
        });

        console.log("Overlapping Class Query Result:", overlappingClass);

        if (overlappingClass) {
            return res.status(400).json({ error: "A group class already exists within this time range." });
        }

        // Create the group class
        const groupClass = new Class({
            tutor: tutorId,
            course: courseId,
            type: "Group",
            time: classTime,
            duration: duration, // Add duration
            classLink: classLink || "", 
            participants: [], // Initially empty, students will join later
        });

        await groupClass.save();

        // Schedule deletion of the class after its duration
        scheduleClassDeletion(groupClass._id, duration);

        return res.status(201).json({
            message: "Group class created successfully.",
            groupClass,
        });
    } catch (error) {
        console.error("Error in createGroupClass:", error);
        return res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};

exports.getGroupClasses = async (req, res) => {
    try {
      const courseId = req.params.courseId;
      const userId = req.user.id;
      
      // Check if the course exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ error: "Course not found." });
      }
      
      const groupClasses = await Class.find({
        course: courseId,
        type: "Group",
        time: { $gte: new Date() }
      })
      .populate('tutor', 'firstName email')
      .populate('course', 'courseName courseDescription')
      .populate('participants', 'firstName email')
      .populate('student', 'firstName email');
      
      return res.status(200).json({
        message: "Group classes retrieved successfully.",
        groupClasses,
      });
    } catch (error) {
      console.error("Error fetching group classes:", error);
      return res.status(500).json({ error: "An error occurred. Please try again later." });
    }
  };
  exports.getMyGroupClasses = async (req, res) => {
    try {
      const userId = req.user.id;
      
      // Find all group classes where the logged-in user is the tutor
      const groupClasses = await Class.find({
        tutor: userId,
        type: "Group",
        time: { $gte: new Date() }
      })
      .populate('course', 'courseName courseDescription')
      .populate('participants', 'firstName email')
      .sort({ time: 1 });
      
      return res.status(200).json({
        message: "Group classes retrieved successfully.",
        groupClasses,
      });
    } catch (error) {
      console.error("Error fetching my group classes:", error);
      return res.status(500).json({ error: "An error occurred. Please try again later." });
    }
};

exports.getStudentGroupClasses = async (req, res) => {
    try {
      const studentId = req.user.id;
      
      // Find all group classes where the logged-in user is a participant
      const groupClasses = await Class.find({
        participants: studentId,
        type: "Group",
        time: { $gte: new Date() }
      })
      .populate('course', 'courseName courseDescription')
      .populate('tutor', 'firstName email')
      .sort({ time: 1 });
      
      return res.status(200).json({
        message: "Student's group classes retrieved successfully.",
        groupClasses,
      });
    } catch (error) {
      console.error("Error fetching student's group classes:", error);
      return res.status(500).json({ error: "An error occurred. Please try again later." });
    }
  };
  