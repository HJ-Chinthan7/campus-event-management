import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import StudentLogin from './components/student/StudentLogin';
import StudentRegister from './components/student/StudentRegister';
import StudentDashboard from './components/student/StudentDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
   
      
        <div className="min-h-screen bg-gray-50">
          <Routes>
          
            <Route path="/" element={<LandingPage />} />
            
        
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute userType="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
        
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route 
              path="/student/*" 
              element={
                <ProtectedRoute userType="student">
                  <StudentDashboard />
                </ProtectedRoute>
              } 
            />
          
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
  
  );
}

export default App;