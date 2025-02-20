const express = require('express');
const router = express.Router();
const { assignTutorToCourse, getTutorById, getTotalEnrolledStudents } = require('../controllers/tutorController');
const { auth, isTutor } = require('../middlewares/authMiddleware');

// Route to assign tutor to a course
router.post('/assign/:courseId', auth, isTutor, assignTutorToCourse);

// Route to get tutor details by ID
router.get('/:tutorId', getTutorById);

router.get('/:tutorId/enrolled-students', auth, isTutor, getTotalEnrolledStudents);

module.exports = router;
