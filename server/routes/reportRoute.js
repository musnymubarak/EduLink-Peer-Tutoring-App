const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authenticate'); 

router.post('/report', authenticate, reportController.createReport);

router.get('/course/:courseId/reports', reportController.getReportsByCourse);

router.get('/user/:userId/reports', reportController.getReportsByUser);

module.exports = router;
