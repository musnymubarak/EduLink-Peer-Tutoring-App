const express = require('express');
const router = express.Router();
const { assignTutorToCourse, getTutorById, getTotalEnrolledStudents, getAllTutors } = require('../controllers/tutorController');
const { auth, isTutor, isAdmin } = require('../middlewares/authMiddleware');

// Route to assign tutor to a course
router.post('/assign/:courseId', auth, isTutor, assignTutorToCourse);

// Route to get tutor details by ID
router.get('/:tutorId', getTutorById);

// Route to get total enrolled students for a tutor
router.get('/:tutorId/enrolled-students', auth, isTutor, getTotalEnrolledStudents);

// Route to get all tutors (Admin only)
router.get('/alltutors/getall', auth, isAdmin, getAllTutors);

module.exports = router;
