const db = require('../database/database');


module.exports.registerForEvent = async (req, res) => {
    try {
        const studentId = req.student.id;
        const eventId = parseInt(req.params.eventId, 10);
const status="active";
  
        const event = await db.get(`SELECT * FROM events WHERE id = ? AND status = ?`, [eventId,status]);
        console.log(event);
        
        if (!event) return res.status(404).json({ success: false, message: 'Event not found or inactive' });

     
        if (event.max_capacity && event.current_registrations >= event.max_capacity) {
            return res.status(400).json({ success: false, message: 'Event is full' });
        }

        await db.run(
            `INSERT INTO event_registrations (event_id, student_id) VALUES (?, ?)`,
            [eventId, studentId]
        );

        await db.run(
            `UPDATE events SET current_registrations = current_registrations + 1 WHERE id = ?`,
            [eventId]
        );

        res.json({ success: true, message: 'Registered for event' });
    } catch (err) {
        console.error(err);
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ success: false, message: 'Already registered' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.getRegistrationsForEvent = async (req, res) => {
    try {
        const collegeId = req.admin.college_id;
        const eventId = req.params.eventId;


        const event = await db.get(`SELECT * FROM events WHERE id = ? AND college_id = ?`, [eventId, collegeId]);
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const registrations = await db.query(
            `SELECT s.student_id, s.name, s.email, s.department, er.registration_date, er.status
             FROM event_registrations er
             JOIN students s ON er.student_id = s.id
             WHERE er.event_id = ?`,
            [eventId]
        );

        res.json({ success: true, registrations });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports.getStudentRegistrations = async (req, res) => {
    try {
        const studentId = req.student.id;

        const events = await db.query(
            `SELECT e.id as event_id, e.title, e.date, e.time, e.location, er.status
             FROM event_registrations er
             JOIN events e ON er.event_id = e.id
             WHERE er.student_id = ?`,
            [studentId]
        );

        res.json({ success: true, events });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
