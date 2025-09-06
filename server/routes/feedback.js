const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedbackController');
const adminAuth = require('../middlewares/adminAuth');
const studentAuth = require('../middlewares/studentAuth');

router.post('/:eventId', studentAuth, feedbackController.submitFeedback);


router.get('/:eventId', adminAuth, feedbackController.getFeedbackForEvent);

router.get('/student/all', studentAuth, feedbackController.getStudentFeedbacks);

module.exports = router;
