const express = require('express');
const router = express.Router();
const eventController = require('../Controllers/eventController');
const {authenticateAdmin} = require('../middleware/auth');


router.post('/', authenticateAdmin, eventController.createEvent);

router.get('/:collegeId', eventController.listEvents);


router.get('/admin/:eventId', eventController.getEventById);


router.put('/:eventId', authenticateAdmin, eventController.updateEvent);

router.delete('/:eventId', authenticateAdmin, eventController.cancelEvent);

module.exports = router;
