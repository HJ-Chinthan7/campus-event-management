const express = require('express');

const router = express.Router();
router.get('/events/:eventId/registrations', 
    authenticateToken, 
    authorizeAdmin, 
    attendanceController.getRegisteredStudents
);

module.exports = router;
