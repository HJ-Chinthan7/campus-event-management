import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalRegistrations: 0
  });
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const collegeId = user.collegeId;
      
        const eventsResponse = await api.get(`/api/events/${collegeId}`);
        const events = eventsResponse.data.events || [];

        
     

        setStats({
          totalEvents: events.length,
          activeEvents: events.filter(e => e.status === 'active').length,
          totalRegistrations: events.reduce((sum, e) => sum + (e.current_registrations || 0), 0),
        });

        setRecentEvents(events.slice(0, 5));
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
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEvents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeEvents}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Registrations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRegistrations}</p>
            </div>
          </div>
        </div>

      </div>

     
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        <div className="space-y-3">
          {recentEvents.map(event => (
            <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600">{event.event_type} • {event.date}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{event.current_registrations} registrations</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'active' ? 'bg-green-100 text-green-800' : 
                  event.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DashboardOverview;