const express = require('express');
const router = express.Router();
const { assignInstructorToCourse } = require('../controllers/instructorController');
const { auth, isInstructor } = require('../middlewares/authMiddleware');

// Route to assign instructor to a course
router.post('/assign/:courseId', auth, isInstructor, assignInstructorToCourse);

module.exports = router;
