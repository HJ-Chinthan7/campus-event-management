
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

const MyAttendance = () => {
  const { user } = useAuth(); 
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAttendance = async () => {
      if (!user?.studentId) {
        setError("User not logged in or student ID missing");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/api/attendance/my-attendance/${user.studentId}`);
        setAttendanceData(response.data || null);
      } catch (err) {
        setError("Failed to fetch attendance data");
        console.error(" Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!attendanceData) return <p className="text-gray-500 text-center">No attendance data found</p>;

  const { statistics, attendance_list } = attendanceData;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">📊 My Attendance</h2>

     
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold">Registered</h3>
          <p className="text-2xl">{statistics.total_registered}</p>
        </div>
        <div className="bg-green-100 shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold">Present</h3>
          <p className="text-2xl">{statistics.total_present}</p>
        </div>
        <div className="bg-red-100 shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold">Absent</h3>
          <p className="text-2xl">{statistics.total_absent}</p>
        </div>
        <div className="bg-blue-100 shadow rounded p-4 text-center">
          <h3 className="text-lg font-semibold">Percentage</h3>
          <p className="text-2xl">{statistics.attendance_percentage || 0}%</p>
        </div>
      </div>

      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow rounded">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Event</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Check-in</th>
            </tr>
          </thead>
          <tbody>
            {attendance_list.map((item) => (
              <tr key={item.event_id} className="border-t">
                <td className="px-4 py-2">{item.event_title}</td>
                <td className="px-4 py-2">{item.event_date}</td>
                <td className="px-4 py-2">{item.event_time}</td>
                <td className="px-4 py-2">{item.location}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    item.final_status === "present"
                      ? "text-green-600"
                      : item.final_status === "absent"
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {item.final_status}
                </td>
                <td className="px-4 py-2">{item.check_in_time || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAttendance;
