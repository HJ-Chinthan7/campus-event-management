import { useState, useEffect } from 'react';
import api from '../../utils/api';
import  { useAuth } from "../../contexts/AuthContext";
import TopEvents from './TopEvents';
const Reports = () => {
  const [eventStats, setEventStats] = useState({});
  const [studentStats, setStudentStats] = useState({});
  const [feedbackStats, setFeedbackStats] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [eventsResponse,eventsdata, studentsResponse, feedbackResponse] = await Promise.all([
          api.get('/api/reports/events/'),
          api.get(`/api/events/${user.collegeId}`),
          api.get('/api/reports/students'),
          api.get('/api/reports/feedback')
        ]);
        setEvents(eventsdata.data.events)
        setEventStats(eventsResponse.data.stats || {});
        setStudentStats(studentsResponse.data || {});
        setFeedbackStats(feedbackResponse.data.feedbackStats || []);
      } catch (error) {
        setError('Failed to fetch reports');
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
     
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Event Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {eventStats.active || 0}
            </div>
            <div className="text-sm text-blue-800">Active Events</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {eventStats.cancelled || 0}
            </div>
            <div className="text-sm text-red-800">Cancelled Events</div>
          </div>
          
        </div>
      </div>

     
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {studentStats.totalStudents || 0}
            </div>
            <div className="text-sm text-purple-800">Total Students</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {studentStats.participation?.length || 0}
            </div>
            <div className="text-sm text-orange-800">Active Participants</div>
          </div>
        </div>

   
        {studentStats.participation && studentStats.participation.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-medium text-gray-900 mb-4">Top Participants</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Events Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {studentStats.participation
                    .sort((a, b) => b.events_registered - a.events_registered)
                    .slice(0, 10)
                    .map(student => (
                    <tr key={student.student_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.student_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {student.events_registered}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

     
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Feedback Statistics</h3>
        {feedbackStats.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No feedback data available yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback Count
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackStats.map(feedback => (
                  <tr key={feedback.event_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {feedback.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <span className="mr-2">{feedback.avg_rating ? feedback.avg_rating.toFixed(1) : 'N/A'}</span>
                        {feedback.avg_rating && (
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(feedback.avg_rating) ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.feedback_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
 <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Events</h3>
    <TopEvents events={events} />
      </div>
     
    </div>
  );
};

export default Reports;