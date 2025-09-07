const db = require('../database/database');


module.exports.createEvent = async (req, res) => {
    try {
        const collegeId = req.admin.college_id;
        const adminId = req.admin.id;
        const { title, description, event_type, date, time, location, max_capacity } = req.body;

        const result = await db.run(
            `INSERT INTO events 
             (college_id, title, description, event_type, date, time, location, max_capacity, created_by) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [collegeId, title, description, event_type, date, time, location, max_capacity, adminId]
        );

        res.json({ success: true, message: 'Event created', eventId: result.lastID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
module.exports.listEvents = async (req, res) => {
    try {
        const {collegeId} =req.params;
      const events = await db.query(
    `SELECT e.*, a.name as created_by_name
     FROM events e
     JOIN admins a ON e.created_by = a.id
     WHERE e.college_id = ?
     ORDER BY e.date ASC, e.time ASC`,
    [collegeId]
);


        res.json({ success: true, events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.getEventById = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await db.get(
            `SELECT e.*, a.name as created_by_name
             FROM events e
             JOIN admins a ON e.created_by = a.id
             WHERE e.id = ?`,
            [eventId]
        );

        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        res.json({ success: true, event });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.updateEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const collegeId = req.admin.college_id;
        const { title, description, event_type, date, time, location, max_capacity, status } = req.body;

        const result = await db.run(
            `UPDATE events SET title = ?, description = ?, event_type = ?, date = ?, time = ?, location = ?, max_capacity = ?, status = ?
             WHERE id = ? AND college_id = ?`,
            [title, description, event_type, date, time, location, max_capacity, status, eventId, collegeId]
        );

        if (result.changes === 0) return res.status(404).json({ success: false, message: 'Event not found or not authorized' });

        res.json({ success: true, message: 'Event updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
module.exports.cancelEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const collegeId = req.admin.college_id;

        const result = await db.run(
            `UPDATE events SET status = 'cancelled' WHERE id = ? AND college_id = ?`,
            [eventId, collegeId]
        );

        if (result.changes === 0) return res.status(404).json({ success: false, message: 'Event not found or not authorized' });

        res.json({ success: true, message: 'Event cancelled' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
