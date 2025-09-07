import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_type: '',
    date: '',
    time: '',
    location: '',
    max_capacity: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const eventTypes = [
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'fest', label: 'Festival' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'tech_talk', label: 'Tech Talk' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : null
      };

      await api.post('/api/events', eventData);
      navigate('/admin/dashboard/events');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create event');
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/admin/dashboard/events')}
          className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="label">
                Event Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="input-field resize-none"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="event_type" className="label">
                  Event Type *
                </label>
                <select
                  id="event_type"
                  name="event_type"
                  required
                  className="input-field"
                  value={formData.event_type}
                  onChange={handleChange}
                >
                  <option value="">Select event type</option>
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="max_capacity" className="label">
                  Maximum Capacity
                </label>
                <input
                  id="max_capacity"
                  name="max_capacity"
                  type="number"
                  min="1"
                  className="input-field"
                  value={formData.max_capacity}
                  onChange={handleChange}
                  placeholder="Leave empty for unlimited"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="date" className="label">
                  Event Date *
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  className="input-field"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label htmlFor="time" className="label">
                  Event Time *
                </label>
                <input
                  id="time"
                  name="time"
                  type="time"
                  required
                  className="input-field"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="location" className="label">
                Location *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                className="input-field"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter event location"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Event...' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/events')}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;