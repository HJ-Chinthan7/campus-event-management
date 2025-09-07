import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../contexts/AuthContext';
const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const {user} =useAuth();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const collegeId = user.collegeId;
        const response = await api.get(`/api/events/${collegeId} `);
        setEvents(response.data.events || []);
      } catch (error) {
        setError('Failed to fetch events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleCancelEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        await api.delete(`/api/events/${eventId}`);
        setEvents(events.filter(event => event.id !== eventId));
      } catch (error) {
        setError('Failed to cancel event');
        console.error('Error cancelling event:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
        <Link
          to="/admin/events/create"
          className="btn-primary mt-4 sm:mt-0"
        >
          Create New Event
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">Get started by creating your first event.</p>
          <Link to="/admin/events/create" className="btn-primary">
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event.id} className="card hover:shadow-lg transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(event.date)} at {formatTime(event.time)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {event.location}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {event.event_type.replace('_', ' ')}
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'active' ? 'bg-green-100 text-green-800' : 
                  event.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {event.status}
                </span>
              </div>

              {event.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <span>
                  {event.current_registrations} / {event.max_capacity || '∞'} registered
                </span>
                <span>Created by {event.created_by_name}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Link
                  to={`/admin/events/${event.id}`}
                  className="flex-1 btn-secondary text-center"
                >
                  View Details
                </Link>
                {event.status === 'active' && (
                  <button
                    onClick={() => handleCancelEvent(event.id)}
                    className="flex-1 btn-danger"
                  >
                    Cancel Event
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;