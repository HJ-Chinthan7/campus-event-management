const EventInfo = ({ event }) => {
  const formatDate = (date) => new Date(date).toLocaleDateString();
  const formatTime = (time) => new Date(`2000-01-01T${time}`).toLocaleTimeString();

  return (
    <div className="card">
      <h3>Event Information</h3>
      <p>Date: {formatDate(event.date)} at {formatTime(event.time)}</p>
      <p>Location: {event.location}</p>
      <p>Type: {event.event_type.replace('_',' ')}</p>
      <p>Capacity: {event.max_capacity ? `${event.current_registrations}/${event.max_capacity}` : 'Unlimited'}</p>
      <p>Description: {event.description}</p>
    </div>
  );
};

export default EventInfo;
