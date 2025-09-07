import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import EventInfo from './EventInfo';
import Registrations from './Registrations';
import AttendanceReport from './AttendanceReport';
import EditEvent from './EditEvent';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const [eventResponse, registrationsResponse] = await Promise.all([
          api.get(`/api/events/admin/${id}`),
          api.get(`/api/registrations/${id}`)
        ]);
        setEvent(eventResponse.data.event);
        setRegistrations(registrationsResponse.data.registrations || []);
      } catch (error) {
        setError('Failed to fetch event details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  useEffect(() => {
    if(activeTab === 'attendance') {
      const fetchAttendance = async () => {
        try {
          const response = await api.get(`/api/attendance/report/${id}`);
          setAttendanceData(response.data.attendance_list || []);
          console.log(attendanceData);
        } catch (err) {
          console.error(err);
        }
      };
      fetchAttendance();
    }
  }, [activeTab, id]);

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!event) return <div className="card text-center py-12"><h3>Event not found</h3><Link to="/admin/events" className="btn-primary">Back</Link></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <button onClick={() => navigate('/admin/dashboard/events')} className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}

     
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${event.status==='active'?'bg-green-100 text-green-800':'bg-gray-100 text-gray-800'}`}>{event.status}</span>
            <span className="ml-4 text-sm text-gray-600">Created by {event.created_by_name}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {event.status==='active' && <button onClick={()=>navigate('/admin/events')} className="btn-danger">Cancel Event</button>}
          </div>
        </div>
      </div>

     
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['details','registrations','attendance','edit'].map(tab => (
            <button key={tab} onClick={()=>setActiveTab(tab)} className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${activeTab===tab?'border-blue-500 text-blue-600':'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>{tab}</button>
          ))}
        </nav>
      </div>

      
      <div>
        {activeTab==='details' && <EventInfo event={event} />}
        {activeTab==='registrations' && <Registrations registrations={registrations} eventId={id} setAttendanceData={setAttendanceData} />}
        {activeTab==='attendance' && <AttendanceReport attendanceData={attendanceData} />}
        {activeTab==='edit' && <EditEvent event={event} setEvent={setEvent} />}
      </div>
    </div>
  );
};

export default EventDetails;
