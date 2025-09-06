const express = require('express');
const router = express.Router();
const reportController = require('../Controllers/reportController');
const {authenticateAdmin} = require('../middleware/auth'); 

router.get('/events', authenticateAdmin, reportController.getEventStats);

router.get('/students', authenticateAdmin, reportController.getStudentStats);


router.get('/feedback', authenticateAdmin, reportController.getFeedbackStats);

module.exports = router;
