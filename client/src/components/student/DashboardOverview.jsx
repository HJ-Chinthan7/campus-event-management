import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {useAuth} from '../../contexts/AuthContext';
const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    eventsAttended: 0,
    feedbackGiven: 0,
    upcomingEvents: 0,
  });
  const [recentEvents, setRecentEvents] = useState([]);
const {user}=useAuth();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const registrationsResponse = await api.get('/api/registrations/student/all');
        const registrations = registrationsResponse.data.events || [];

        const feedbackResponse = await api.get(`/api/feedback/student/all/${user.studentId}`);
        const feedback = feedbackResponse.data.feedbacks || [];

        const eventsResponse = await api.get(`/api/events/${user.collegeId}`);
        const allEvents = eventsResponse.data.events || [];
        const upcomingEvents = allEvents
          .filter((event) => event.status === 'active' && new Date(event.date) >= new Date())
          .slice(0, 5);

        setStats({
          totalRegistrations: registrations.length,
          eventsAttended: registrations.length,
          feedbackGiven: feedback.length,
          upcomingEvents: upcomingEvents.length,
        });

        setRecentEvents(upcomingEvents);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Registrations', value: stats.totalRegistrations, color: 'blue' },
          { label: 'Events Attended', value: stats.eventsAttended, color: 'green' },
          { label: 'Feedback Given', value: stats.feedbackGiven, color: 'purple' },
          { label: 'Upcoming Events', value: stats.upcomingEvents, color: 'orange' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className={`p-2 bg-${stat.color}-100 rounded-lg`}>
               
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {recentEvents.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming events</p>
          ) : (
            recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {event.event_type.replace('_', ' ')} •{' '}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{event.location}</p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      event.current_registrations >= (event.max_capacity || Infinity)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {event.current_registrations >= (event.max_capacity || Infinity)
                      ? 'Full'
                      : 'Available'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default DashboardOverview;