const express = require('express');
const attendanceController=require('../Controllers/attendanceController');
const { authenticateAdmin, authenticateStudent } = require('../middleware/auth');
const router = express.Router();



router.put('/mark/:eventId',                  
  authenticateAdmin, 
  attendanceController.markAttendanceBulk
);



router.get('/report/:eventId',             
  authenticateAdmin, 
  attendanceController.getEventAttendanceReport
);

router.get('/my-attendance/:id', authenticateStudent, attendanceController.getMyAttendance);
module.exports = router;



