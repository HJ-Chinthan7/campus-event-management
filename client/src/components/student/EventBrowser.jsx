import { useState, useEffect } from 'react';
import api from '../../utils/api';
import EventFeedbackForm from './FeedbackForm';
import { useAuth } from '../../contexts/AuthContext';

const EventBrowser = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
const {user}=useAuth();
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get(`/api/events/${user.collegeId}`);
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
  
  const handleRegister = async (eventId) => {
    try {
      await api.post(`/api/registrations/${eventId}`);
      
      setEvents(events.map(event => 
        event.id === eventId 
          ? { ...event, current_registrations: event.current_registrations + 1 }
          : event
      ));
      
      alert('Successfully registered for the event!');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to register for event';
      alert(errorMessage);
      console.error('Error registering for event:', error);
    }
  };
  const filteredEvents = events.filter(event => {
    const matchesFilter = filter === 'all' || event.event_type === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const isEventPast = (dateString) => {
    return new Date(dateString) < new Date();
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

  const eventTypes = [
    { value: 'all', label: 'All Events' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'fest', label: 'Festival' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'tech_talk', label: 'Tech Talk' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Browse Events</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="sm:w-48">
            <select
              className="input-field"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'No active events available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map(event => (
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
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
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
                <span>By {event.created_by_name}</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {isEventPast(event.date) ? (
                  <button
                    onClick={() => {
                      setSelectedEvent(event);
                      setShowFeedbackForm(true);
                    }}
                    className="flex-1 btn-primary"
                  >
                    Give Feedback
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={event.max_capacity && event.current_registrations >= event.max_capacity}
                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {event.max_capacity && event.current_registrations >= event.max_capacity 
                      ? 'Event Full' 
                      : 'Register'
                    }
                  </button>
                )}
                <button className="flex-1 btn-secondary">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

     
      {showFeedbackForm && selectedEvent && (
        <EventFeedbackForm
          event={selectedEvent}
          onClose={() => {
            setShowFeedbackForm(false);
            setSelectedEvent(null);
          }}
          onSuccess={() => {
            alert('Feedback submitted successfully!');
          }}
        />
      )}
    </div>
  );
};

export default EventBrowser;