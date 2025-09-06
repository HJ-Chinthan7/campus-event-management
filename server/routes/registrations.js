const express = require('express');
const router = express.Router();
const registrationController = require('../Controllers/registrationController');
const {authenticateAdmin,authenticateStudent} = require('../middleware/auth');
router.post('/:eventId', authenticateStudent, registrationController.registerForEvent);

router.get('/:eventId', authenticateAdmin, registrationController.getRegistrationsForEvent);


router.get('/student/all', authenticateStudent, registrationController.getStudentRegistrations);

module.exports = router;
