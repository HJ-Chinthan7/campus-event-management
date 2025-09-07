
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

const MyFeedback = () => {
  const { user } = useAuth();
  const student_id = user?.studentId;

  const [events, setEvents] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!student_id) return setError('Student not logged in');
      try {
        const eventsRes = await api.get(`/api/attendance/my-attendance/${student_id}`);
        setEvents(eventsRes.data.attendance_list || []);

        const feedbackRes = await api.get(`/api/feedback/student/all/${student_id}`);
        setFeedbacks(feedbackRes.data.feedbacks || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [student_id]);

  const hasFeedback = (eventId) => feedbacks.some(fb => fb.event_id === eventId);

  const handleFormSubmit = async () => {
    
    const response = await api.get(`/api/feedback/student/all/${student_id}`);
    setFeedbacks(response.data.feedbacks || []);
    setShowForm(false);
    setSelectedEvent(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!events.length) return <p className="text-gray-500">No registered events found</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Feedback</h2>

      <div className="space-y-3">
        {events.map(event => (
          <div key={event.event_id} className="card p-4 border rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{event.event_title}</h3>
              <p className="text-sm text-gray-500">{new Date(event.event_date).toLocaleDateString()}</p>
            </div>
            <div>
              {hasFeedback(event.event_id) ? (
                <span className="text-green-600">Feedback Submitted</span>
              ) : (
                <button
                  className="btn-primary"
                  onClick={() => { setSelectedEvent(event); setShowForm(true); }}
                >
                  Give Feedback
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      
      {showForm && selectedEvent && (
        <FeedbackForm
          event={selectedEvent}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

  
      <div className="mt-6">
        <h3 className="font-semibold text-lg">Your Feedbacks</h3>
        <FeedbackList feedbacks={feedbacks} />
      </div>
    </div>
  );
};

export default MyFeedback;
