const express = require('express');
const router = express.Router();
const registrationController = require('../Controllers/registrationController');
const {authenticateAdmin,authenticateStudent} = require('../middleware/auth');
router.post('/:eventId', authenticateStudent, registrationController.registerForEvent); //done

router.get('/:eventId', authenticateAdmin, registrationController.getRegisteredStudents);


router.get('/student/all', authenticateStudent, registrationController.getStudentRegistrations);//done

module.exports = router;
