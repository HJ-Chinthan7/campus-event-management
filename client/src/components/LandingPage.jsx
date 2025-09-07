import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Campus Event Management
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Streamline your campus events with our comprehensive platform. 
            Create, manage, and track events effortlessly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
       
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Admin Portal</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Create and manage campus events, track registrations, 
                monitor attendance, and generate comprehensive reports.
              </p>
              <Link 
                to="/admin/login" 
                className="btn-primary inline-block w-full sm:w-auto"
              >
                Admin Login
              </Link>
            </div>
          </div>

       
          <div className="card hover:shadow-lg transition-shadow duration-300">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">Student App</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Browse events, register for activities, check-in at events, 
                and provide feedback to help improve campus life.
              </p>
              <div className="space-y-3">
                <Link 
                  to="/student/login" 
                  className="btn-primary inline-block w-full"
                >
                  Student Login
                </Link>
                <Link 
                  to="/student/register" 
                  className="btn-secondary inline-block w-full"
                >
                  New Student Registration
                </Link>
              </div>
            </div>
          </div>
        </div>

     
        <div className="mt-12 sm:mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8 sm:mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Management</h3>
              <p className="text-gray-600 text-sm sm:text-base">Create, schedule, and manage campus events with ease</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Registration Tracking</h3>
              <p className="text-gray-600 text-sm sm:text-base">Monitor student registrations and attendance in real-time</p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics & Reports</h3>
              <p className="text-gray-600 text-sm sm:text-base">Generate comprehensive reports and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

