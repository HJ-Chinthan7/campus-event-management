const database = require('../database/database');

module.exports.markAttendanceBulk = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { attendanceData } = req.body; 

    if (!attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({ error: 'attendanceData must be an array' });
    }

    const event = await database.get(
      'SELECT * FROM events WHERE id = ? AND college_id = ?',
      [eventId, req.admin.college_id]
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    await database.run('BEGIN TRANSACTION');
    try {
      
      const promises = attendanceData.map(async ({ student_id, status }) => {
      
        const registration = await database.get(
          'SELECT id FROM event_registrations WHERE event_id = ? AND student_id = ? AND status = "registered"',
          [eventId, student_id]
        );

        if (registration) {
          return database.run(
            `
            INSERT OR REPLACE INTO attendance (event_id, student_id, status, check_in_time)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            `,
            [eventId, student_id, status]
          );
        }
      });

   
      await Promise.all(promises);

      await database.run('COMMIT');

      res.json({
        message: 'Attendance marked successfully',
        marked_count: attendanceData.length,
      });
    } catch (err) {
      await database.run('ROLLBACK');
      throw err;
    }
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports.getEventAttendanceReport = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await database.get(
      'SELECT * FROM events WHERE id = ? AND college_id = ?',
      [eventId, req.admin.college_id]
    );
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }


    const stats = await database.get(
      `
      SELECT 
        COUNT(r.id) AS total_registered,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS total_present,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS total_absent,
        ROUND(
          (COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(r.id)), 
          2
        ) AS attendance_percentage
      FROM event_registrations r
      LEFT JOIN attendance a 
        ON r.event_id = a.event_id AND r.student_id = a.student_id
      WHERE r.event_id = ? AND r.status = 'registered'
      `,
      [eventId]
    );

    const attendanceList = await database.query(
      `
      SELECT 
        s.id,
        s.student_id,
        s.name,
        s.email,
        s.department,
        s.year,
        r.registration_date,
        a.status AS attendance_status,
        a.check_in_time,
        CASE 
          WHEN a.id IS NULL THEN 'not_marked' 
          ELSE a.status 
        END AS final_status
      FROM event_registrations r
      JOIN students s ON r.student_id = s.id
      LEFT JOIN attendance a 
        ON r.event_id = a.event_id AND r.student_id = a.student_id
      WHERE r.event_id = ? AND r.status = 'registered'
      ORDER BY s.name ASC
      `,
      [eventId]
    );

    
    res.json({
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
      },
      statistics: stats,
      attendance_list: attendanceList,
    });
  } catch (error) {
    console.error('Get attendance report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};