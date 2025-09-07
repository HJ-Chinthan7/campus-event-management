import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const StudentLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, 'student');
      if (result.success) {
        navigate('/student', { replace: true }); 
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Unexpected error occurred. Please try again.'+err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-bold text-gray-900">Student Portal</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign in to browse and register for events
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card p-6 shadow-md rounded-lg bg-white">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-field"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600 text-center">
            <p>Demo Credentials:</p>
            <p>Email: john.doe@student.techuniv.edu</p>
            <p>Password: password123</p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/student/register"
              className="text-primary-600 hover:text-primary-500 text-sm"
            >
              Don't have an account? Register here
            </Link>
            <br />
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-500 text-sm mt-2 inline-block"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
