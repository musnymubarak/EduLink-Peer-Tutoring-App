const mongoose = require('mongoose');
const Report = require('../models/Report');
const Course = require('../models/Course'); 
const User = require('../models/User'); 

// Create a new course report
const createReport = async (req, res) => {
  try {
    const { courseId } = req.params;  // Course ID comes from the URL
    const { reason } = req.body;
    const reportedBy = req.user.id;  // Assuming you have user authentication and the ID is available in `req.user`

    // Ensure the courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Get the course creator (instructor) based on the courseId
    const courseCreatorId = course.tutor;
    if (!courseCreatorId) {
      return res.status(404).json({ message: 'Course creator not found' });
    }

    // Create a new report
    const report = new Report({
      reportedBy,
      courseId,
      courseCreatorId,
      reason
    });

    await report.save();

    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reports for a specific course
const getReportsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Ensure the courseId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    const reports = await Report.find({ courseId })
      .populate('reportedBy', 'name email')  // Populate user info for reportedBy
      .populate('courseCreatorId', 'name email')  // Populate user info for course creator
      .populate('courseId', 'title description');  // Populate course details

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found for this course' });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reports by a specific user (the reporter)
const getReportsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const reports = await Report.find({ reportedBy: userId })
      .populate('courseId', 'title description')  // Populate course details
      .populate('courseCreatorId', 'name email');  // Populate course creator details

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found for this user' });
    }

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reportedBy', 'name email')  // Populate user info for reportedBy
      .populate('courseCreatorId', 'name email')  // Populate user info for course creator
      .populate('courseId', 'courseName description');  // Populate course details

    if (!reports.length) {
      return res.status(404).json({ message: 'No reports found' });
    }

    // Sending the populated reports as a response
    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createReport,
  getReportsByCourse,
  getReportsByUser,
  getAllReports  // Export the new function
};
