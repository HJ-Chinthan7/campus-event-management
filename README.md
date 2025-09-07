# Campus Event Management Platform

## overview

### Admin Portal
- **Event Management**:- we can manage event such as Create, update, and cancel campus events
it gives several option for creating events like hackton ,workshop and fest etc.
- **Registration Tracking**: 
-it allows us to monitor students regarding whether they are registered for certain events or not. events are created by admin of each college    
- **Attendance Management**: -allows us to track student attendence
allows us to mark the attendence of student registered for events
- **Analytics & Reports**: 
-displays students based on number of registered events 
-displays the comments made by students on events
-displays event and student statistics
  
-displays number of people registered for events 

### Student App
create as mobile based web application using react ,tailwind css 
it has nice dashboard for easy interface 
it displays the recent events and their status 
- **Event Discovery**: we can browse events and register for it 
-it has attendence monitoring system where we check where we are present for particular event or not  
-we can track registered events 
- it gives attendence percentage 
-displays the feedback that wwe provided for events 
- **Feedback System**: Rate and provide feedback for attended events


##  Technology Stack

- **Frontend**: React.js with Vite, Tailwind CSS
- **Backend**: Node.js , Express.js and Express-validator
- **Database**: SQLite
- **Authentication**: JWT tokens and bcryptjs for password hashing 
- **Styling**: Tailwind CSS


## 🚀 Quick Start

#### clone the repository 
- git clone https://github.com/HJ-Chinthan7/campus-event-management.git
- cd campus-event-management

#### installing all the dependencies 
- npm i 

#### start server:
- npm run dev for development 
- npm run start for production



### start client:
- npm run dev
 
### For build :
- npm run build


### This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:5173`


- **Landing Page**: `http://localhost:5173`
- **Admin Portal**: `http://localhost:5173/admin/login`
- **Student App**: `http://localhost:5173/student/login`



## HOSTED URL LINK
- https://aquamarine-pothos-f5748b.netlify.app/    hosted in netlify frontend
- backend hosted on render link  https://campus-event-management-0hsd.onrender.com

##  Demo Credentials

### Admin Login
- **Email**: 
- **Password**: 
    - admin@democollege1.edu
    - Admin1Pass!

    - admin@democollege2.edu
    - Admin2Pass!

    - admin@democollege3.edu
    - Admin3Pass!

    - admin@democollege4.edu
    - Admin4Pass!
    
    - admin@democollege5.edu
    - Admin5Pass!
### Student Login
- **Email**: 
- **Password**:
    - demo01@gmail.com
    - 123456789
   
## Note:
 in the usercontroller as of now i had  not implemented the blacklisttoken table and its token checking mechanism  .i am using blacklisted token to prevent  discarded token from being used as login .blacklistedtoken table is based on ttl .


##  Database Schema

- The application uses SQLite with the following main tables:

- colleges:	Stores college information: id, name, code, created_at
- admins	:Stores admin info for each college: name, email, password_hash, role
- students:	Stores student info: college_id, student_id, name, email, phone, department, year, password
- events	:Stores event info: title, description, type, date, time, location, capacity, status, created_by
- event_registrations:	Tracks which students registered for which events; unique per (event_id, student_id)
- attendance:	Tracks attendance for each event: student_id, status (present/absent), check_in_time
- feedback	Stores student feedback for events: rating (1-5), comments, submitted_at

##  API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/student/register` - Student registration

### Events
- `GET /api/events` - Get all events (with filters)
- `POST /api/events` - Create new event (Admin only)
- `PUT /api/events/:id` - Update event (Admin only)
- `DELETE /api/events/:id` - Cancel event (Admin only)

### Registrations
- `POST /api/registrations/events/:id/register` - Register for event
- `DELETE /api/registrations/events/:id/register` - Cancel registration
- `GET /api/registrations/students/:id` - Get student's registrations

## Some features
- Each college operates independently
- Students can only access events from their college
- Admins can only manage events for their college
- Prevents duplicate registrations
- Capacity linit on events
- 5-star rating system
- comments
- Student participation tracking

## Set environment variables in server :


- export JWT_SECRET=your-secure-jwt-secret
- export PORT=5000

## Set environment variables in client :
- VITE_APP_BASE_URL=https://campus-event-management-0hsd.onrender.com

### security features
- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
