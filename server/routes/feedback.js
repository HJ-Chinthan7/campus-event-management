const express = require('express');
const router = express.Router();
const feedbackController = require('../Controllers/feedbackController');
const {authenticateAdmin,authenticateStudent} = require('../middleware/auth');

router.post('/:eventId', authenticateStudent, feedbackController.submitFeedback);


router.get('/:admin/all', authenticateAdmin, feedbackController.getFeedbackForEvent);

router.get('/student/all/:studentid', authenticateStudent, feedbackController.getStudentFeedbacks);

module.exports = router;
