import { useState, useEffect } from 'react';
import api from '../../utils/api';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await api.get('/api/registrations/student/all');
        setRegistrations(response.data.events || []);
      } catch (error) {
        setError('Failed to fetch registrations');
        console.error('Error fetching registrations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'registered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isEventUpcoming = (dateString) => {
    return new Date(dateString) >= new Date();
  };

  const isEventPast = (dateString) => {
    return new Date(dateString) < new Date();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">My Registrations</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No registrations yet</h3>
          <p className="text-gray-600 mb-4">You haven't registered for any events yet.</p>
          <a href="/student/dashboard/events" className="btn-primary">
            Browse Events
          </a>
        </div>
      ) : (
        <div className="space-y-4">
         
          {registrations.filter(reg => isEventUpcoming(reg.date) && reg.status === 'registered').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {registrations
                  .filter(reg => isEventUpcoming(reg.date) && reg.status === 'registered')
                  .map(registration => (
                  <div key={registration.event_id} className="card hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{registration.title}</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(registration.date)} at {formatTime(registration.time)}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {registration.location}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Registered on {formatDate(registration.date)}
                      </span>
                      <button className="btn-secondary text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          {registrations.filter(reg => isEventPast(reg.date) || reg.status === 'cancelled').length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Past Events</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {registrations
                  .filter(reg => isEventPast(reg.date) || reg.status === 'cancelled')
                  .map(registration => (
                  <div key={registration.event_id} className="card hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{registration.title}</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(registration.date)} at {formatTime(registration.time)}
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {registration.location}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Registered on {formatDate(registration.date)}
                      </span>
                      <div className="flex gap-2">
                        <button className="btn-secondary text-sm">
                          View Details
                        </button>
                        {isEventPast(registration.date) && registration.status === 'registered' && (
                          <button className="btn-primary text-sm">
                            Give Feedback
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;