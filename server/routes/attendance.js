const express = require('express');
const attendanceController=require('../Controllers/attendanceController');
const { authenticateAdmin, authenticateStudent } = require('../middleware/auth');
const router = express.Router();



router.post('/mark/:eventId',                  
  authenticateAdmin, 
  attendanceController.markAttendanceBulk
);



router.get('/report/:eventId',             
  authenticateAdmin, 
  attendanceController.getEventAttendanceReport
);


module.exports = router;



