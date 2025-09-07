import React from 'react';

const TopEvents = ({ events }) => {
  const eventList = Array.isArray(events) ? events : [];

  if (eventList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No event data available yet.</p>
      </div>
    );
  }

 
  const topEvents = [...eventList].sort((a, b) => b.current_registrations - a.current_registrations).slice(0, 10);

  return (
    <div className="mt-6">
      <h4 className="text-md font-medium text-gray-900 mb-4">Top Events by Registrations</h4>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registrations
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {topEvents.map(event => (
              <tr key={event.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {event.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {event.current_registrations}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopEvents;
