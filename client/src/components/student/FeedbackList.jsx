
import React from 'react';

const FeedbackList = ({ feedbacks }) => {
  if (!feedbacks.length) return <p className="text-gray-500">No feedback given yet</p>;

  return (
    <ul className="space-y-2 mt-2">
      {feedbacks.map(fb => (
        <li key={fb.id} className="border p-3 rounded">
          <p className="font-semibold">{fb.title}</p>
          <p>Rating: {fb.rating}/5</p>
          {fb.comments && <p>Comments: {fb.comments}</p>}
        </li>
      ))}
    </ul>
  );
};

export default FeedbackList;
