const AttendanceReport = ({ attendanceData }) => {
  return (
    <div className="card">
      <h3>Attendance Report</h3>
      {attendanceData.length === 0 ? (
        <p>No attendance marked yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Student</th><th>Status</th><th>Check-in Time</th></tr>
          </thead>
          <tbody>
            {attendanceData.map(a => (
              <tr key={a.student_id}>
                <td>{a.name}</td>
                <td>{a.attendance_status}</td>
                <td>{new Date(a.check_in_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceReport;
