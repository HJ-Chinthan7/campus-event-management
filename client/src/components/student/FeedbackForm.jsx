
import React, { useState } from 'react';
import api from '../../utils/api';

const FeedbackForm = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({ rating: '', comments: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating) return;

    try {
      await api.post(`/api/feedback/${event.event_id}`, {
        rating: parseInt(formData.rating),
        comments: formData.comments,
      });

      onSubmit(); 
      setFormData({ rating: '', comments: '' });
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Feedback for {event.event_title}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label>Rating *</label>
            <div className="flex space-x-2 mt-1">
              {[1,2,3,4,5].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: r.toString() }))}
                  className={`w-10 h-10 border rounded flex items-center justify-center ${
                    formData.rating === r.toString() ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label>Comments</label>
            <textarea
              rows={3}
              className="input-field w-full border rounded p-2"
              value={formData.comments}
              onChange={e => setFormData(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Your comments..."
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1" disabled={!formData.rating}>
              Submit
            </button>
            <button
              type="button"
              className="btn-secondary flex-1"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
