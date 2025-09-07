import { useState } from 'react';
import api from '../../utils/api';

const Registrations = ({ registrations, eventId, setAttendanceData }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [activeStudent, setActiveStudent] = useState(null);

  const handleCheckbox = (studentId) => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id=>id!==studentId) : [...prev, studentId]);
  };

  const markAttendance = async () => {
    if(selectedStudents.length===0) return alert("Select at least one student");

    const payload = registrations.filter(r=>selectedStudents.includes(r.student_id))
                                 .map(r=>({student_id:r.student_id, status:'present'}));
    await api.put(`/api/attendance/mark/${eventId}`, { attendanceData: payload });
    const response = await api.get(`/api/attendance/report/${eventId}`);
    console.log(response.data);
    setAttendanceData(response.data.attendance_list || []);
    setSelectedStudents([]);
    alert('Attendance marked');
  };

  return (
    <div className="card space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Registrations ({registrations.length})</h3>
        <button onClick={markAttendance} className="btn-primary">Mark Attendance</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {registrations.map(reg => (
              <tr key={reg.student_id} onClick={()=>setActiveStudent(reg)} className="cursor-pointer hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input type="checkbox" className="mr-2" checked={selectedStudents.includes(reg.student_id)} onChange={(e)=>{e.stopPropagation(); handleCheckbox(reg.student_id)}} />
                  <div className="inline-block">
                    <div className="text-sm font-medium text-gray-900">{reg.name}</div>
                    <div className="text-sm text-gray-500">{reg.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{reg.department}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(reg.registration_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${reg.status==='registered'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{reg.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      {activeStudent && (
        <div className="card mt-4">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Student Details</h4>
          <p><strong>Name:</strong> {activeStudent.name}</p>
          <p><strong>Email:</strong> {activeStudent.email}</p>
          <p><strong>Department:</strong> {activeStudent.department}</p>
          <p><strong>Status:</strong> {activeStudent.status}</p>
        </div>
      )}
    </div>
  );
};

export default Registrations;
