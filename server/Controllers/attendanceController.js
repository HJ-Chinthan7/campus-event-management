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
      for (const { student_id, status } of attendanceData) {
      
        const student = await database.get(
          'SELECT id FROM students WHERE student_id = ?',
          [student_id]
        );

        if (!student) {
          console.warn(` Student not found: ${student_id}`);
          continue;
        }

        await database.run(
          `INSERT OR REPLACE INTO attendance 
            (event_id, student_id, status, check_in_time) 
           VALUES (?, ?, ?, CURRENT_TIMESTAMP)`,
          [eventId, student.id, status]
        );

      }

      await database.run('COMMIT');
      res.json({ message: 'Attendance marked successfully' });

    } catch (innerErr) {
      await database.run('ROLLBACK');
      console.error(' Inner error while marking attendance:', innerErr);
      res.status(500).json({ error: innerErr.message });
    }

  } catch (error) {
    console.error(' Mark attendance error:', error);
    res.status(500).json({ error: error.message });
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
      JOIN students s ON r.student_id = s.id
      LEFT JOIN attendance a 
        ON r.event_id = a.event_id AND r.student_id = a.student_id
      WHERE r.event_id = ?
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
          WHEN r.status = 'cancelled' THEN 'cancelled'
          WHEN a.status IS NULL THEN 'not_marked'
          ELSE a.status
        END AS final_status
      FROM event_registrations r
      JOIN students s ON r.student_id = s.id
      LEFT JOIN attendance a 
        ON r.event_id = a.event_id AND r.student_id = a.student_id
      WHERE r.event_id = ?
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
    console.error(' Get attendance report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports.getMyAttendance = async (req, res) => {
  try {
    const studentId = req.student.id; 
 
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
      WHERE r.student_id = ?
      `,
      [studentId]
    );

   
    const attendanceList = await database.query(
      `
      SELECT 
        e.id AS event_id,
        e.title AS event_title,
        e.date AS event_date,
        e.time AS event_time,
        e.location,
        r.registration_date,
        a.status AS attendance_status,
        a.check_in_time,
        CASE 
          WHEN r.status = 'cancelled' THEN 'cancelled'
          WHEN a.status IS NULL THEN 'not_marked'
          ELSE a.status
        END AS final_status
      FROM event_registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN attendance a 
        ON r.event_id = a.event_id AND r.student_id = a.student_id
      WHERE r.student_id = ?
      ORDER BY e.date DESC
      `,
      [studentId]
    );
    res.json({
      statistics: stats,
      attendance_list: attendanceList,
    });
  } catch (error) {
    console.error(' Get my attendance error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
