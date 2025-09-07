

import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardOverview from './DashboardOverview';
import EventBrowser from './EventBrowser';
import MyRegistrations from './MyRegistrations';
import MyAttendance from './MyAttendance';
import MyFeedback from './MyFeedback';

const StudentDashboard = () => {
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
              <h1 className="text-2xl font-bold text-gray-900">Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
            <div className="bg-white shadow rounded-lg p-4">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/student"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/events"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     Browse Events
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/registrations"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     My Registrations
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/attendance"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     My Attendance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/student/feedback"
                    className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                  >
                     My Feedback
                  </Link>
                </li>
              </ul>
            </div>
          </nav>

         
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/events" element={<EventBrowser />} />
              <Route path="/registrations" element={<MyRegistrations />} />
              <Route path="/attendance" element={<MyAttendance />} />
              <Route path="/feedback" element={<MyFeedback />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
