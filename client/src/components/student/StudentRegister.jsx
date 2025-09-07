import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../utils/api';
const StudentRegister = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    collegeId: '',
    password: ''
  });
  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await api.get('/api/colleges/collegess'); 
        setColleges(response.data.colleges || []);
       console.log('Fetched colleges:', response.data.colleges);
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/student');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Student Registration</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to access campus events
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="collegeId" className="label">
                College
              </label>
              <select
                id="collegeId"
                name="collegeId"
                required
                className="input-field"
                value={formData.collegeId}
                onChange={handleChange}
              >
                <option value="">Select your college</option>
                {colleges.map(college => (
                  <option key={college.id} value={college.id}>
                    {college.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="studentId" className="label">
                Student ID
              </label>
              <input
                id="studentId"
                name="studentId"
                type="text"
                required
                className="input-field"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="e.g., TU001003"
              />
            </div>

            <div>
              <label htmlFor="name" className="label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-field"
                value={formData.email}
                onChange={handleChange}
                placeholder="student@college.edu"
              />
            </div>

            <div>
              <label htmlFor="phone" className="label">
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            <div>
              <label htmlFor="department" className="label">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                className="input-field"
                value={formData.department}
                onChange={handleChange}
                placeholder="e.g., Computer Science"
              />
            </div>

            <div>
              <label htmlFor="year" className="label">
                Academic Year
              </label>
              <select
                id="year"
                name="year"
                required
                className="input-field"
                value={formData.year}
                onChange={handleChange}
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link to="/student/login" className="text-primary-600 hover:text-primary-500 text-sm">
              Already have an account? Sign in
            </Link>
            <br />
            <Link to="/" className="text-gray-600 hover:text-gray-500 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;

