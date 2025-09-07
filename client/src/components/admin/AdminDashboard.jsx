
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EventList from './EventList';
import CreateEvent from './CreateEvent';
import EventDetails from './EventDetails';
import Reports from './Reports';
import DashboardOverview from './DashboardOverview';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="btn-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
        
          <nav className="lg:w-64">
            <div className="card">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/admin/"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/events"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/events/create"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     Create Event
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/reports"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     Reports
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

   
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

