const db = require('../database/database');


module.exports.submitFeedback = async (req, res) => {
    try {
        const studentId = req.student.id; 
        const eventId = req.params.eventId;
        const { rating, comments } = req.body;

   
        await db.run(
            `INSERT INTO feedback (event_id, student_id, rating, comments)
             VALUES (?, ?, ?, ?)
             ON CONFLICT(event_id, student_id) DO UPDATE SET
             rating = excluded.rating,
             comments = excluded.comments,
             submitted_at = CURRENT_TIMESTAMP`,
            [eventId, studentId, rating, comments]
        );

        res.json({ success: true, message: 'Feedback submitted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.getFeedbackForEvent = async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const collegeId = req.admin.college_id;

   
        const event = await db.get(
            'SELECT * FROM events WHERE id = ? AND college_id = ?',
            [eventId, collegeId]
        );
        if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

        const feedbacks = await db.query(
            `SELECT f.id, f.rating, f.comments, f.submitted_at, s.student_id, s.name
             FROM feedback f
             JOIN students s ON f.student_id = s.id
             WHERE f.event_id = ?`,
            [eventId]
        );

        res.json({ success: true, feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.getStudentFeedbacks = async (req, res) => {
    try {
        const studentId = req.student.id;

        const feedbacks = await db.query(
            `SELECT f.id, f.rating, f.comments, f.submitted_at, e.id as event_id, e.title
             FROM feedback f
             JOIN events e ON f.event_id = e.id
             WHERE f.student_id = ?`,
            [studentId]
        );

        res.json({ success: true, feedbacks });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
