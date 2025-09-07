import { useState } from 'react';
import api from '../../utils/api';

const EditEvent = ({ event, setEvent }) => {
  const [formData, setFormData] = useState({ ...event });
  const [loading, setLoading] = useState(false);

  const handleChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const { id } = event;

    try {
      const res = await api.put(`/api/events/${id}`, formData);
      setEvent(res.data.event);
      alert('Event updated successfully!');
    } catch (err) {
      alert('Failed to update event');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-6 p-6">
      <h3 className="text-lg font-semibold text-gray-900">Edit Event</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="input-field"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <input
            className="input-field"
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
            placeholder="Event Type"
            required
          />
          <input
            className="input-field"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
          />
          <input
            className="input-field"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
          />
          <input
            className="input-field"
            type="number"
            name="max_capacity"
            value={formData.max_capacity}
            onChange={handleChange}
            placeholder="Max Capacity"
            min={1}
          />
        </div>

        <textarea
          className="input-field w-full"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <select
          className="input-field w-full"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
};

export default EditEvent;
