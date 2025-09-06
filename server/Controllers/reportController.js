const db = require('../database/database'); 
module.exports.getEventStats = async (req, res) => {
    try {
        const collegeId = req.admin.college_id;

        const stats = await db.query(
            `SELECT status, COUNT(*) as count
             FROM events
             WHERE college_id = ?
             GROUP BY status`,
            [collegeId]
        );

       
        const result = { active: 0, cancelled: 0, completed: 0 };
        stats.forEach(s => { result[s.status] = s.count; });

        res.json({ success: true, stats: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.getStudentStats = async (req, res) => {
    try {
        const collegeId = req.admin.college_id;

       
        const totalStudents = await db.get(
            `SELECT COUNT(*) as count FROM students WHERE college_id = ?`,
            [collegeId]
        );

      
        const participation = await db.query(
            `SELECT s.student_id, s.name, COUNT(er.id) as events_registered
             FROM students s
             LEFT JOIN event_registrations er ON s.id = er.student_id
             WHERE s.college_id = ?
             GROUP BY s.id`,
            [collegeId]
        );

        res.json({
            success: true,
            totalStudents: totalStudents.count,
            participation
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


module.exports.getFeedbackStats = async (req, res) => {
    try {
        const collegeId = req.admin.college_id;

        const feedbackStats = await db.query(
            `SELECT e.id as event_id, e.title, AVG(f.rating) as avg_rating, COUNT(f.id) as feedback_count
             FROM events e
             LEFT JOIN feedback f ON e.id = f.event_id
             WHERE e.college_id = ?
             GROUP BY e.id`,
            [collegeId]
        );

        res.json({ success: true, feedbackStats });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
