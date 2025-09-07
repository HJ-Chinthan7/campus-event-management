# Campus Event Management System - Design Documentation

This document provides a comprehensive overview of the Campus Event Management System, mapping server routes to their corresponding frontend components and describing the interaction flows between the client and server.

## Table of Contents
1. [Auth](#auth)
2. [Events](#events)
3. [Attendance](#attendance)
4. [Feedback](#feedback)
5. [Reports](#reports)
6. [Colleges](#colleges)
7. [Event Registrations](#event-registrations)

## Registration

### Server Routes
-**Register route student register

- **POST /api/auth/student/register** - Student registration with validation for email, password, name, phone, studentId, year, department, and collegeId

server accepts 
req body:
which  contains studentId: VARCHAR(20) (unique identifier for student)
name: VARCHAR(255)
email: VARCHAR(255) (unique)
phone: VARCHAR(15)
department: VARCHAR(100)
year: INTEGER
collegeId: INTEGER (foreign key referencing colleges table)
password: VARCHAR(255) (for database hashed_password is used) 

validation using express -validator

res.object:
  token : using jwt token (generated using tokenManager.generateToken(student.id))
  user :  id: INTEGER PRIMARY KEY AUTOINCREMENT (auto-generated unique identifier)
studentId: VARCHAR(20) UNIQUE (student's unique identifier, max 20 characters)
name: VARCHAR(255) (student's full name, max 255 characters)
email: VARCHAR(255) UNIQUE (student's email address, max 255 characters)
department: VARCHAR(100) (student's department, max 100 characters)
year: INTEGER (student's academic year, numeric value)
collegeId: INTEGER (foreign key referencing the colleges table)
These types a


### Frontend Components
- `client/src/components/student/StudentRegister.jsx` - Student registration form
- `client/src/contexts/AuthContext.jsx` - Handles registration API calls and user state management

### Flow
1. Student fills registration form in StudentRegister component
2. Form data is sent to AuthContext.register() function
3. API call made to /api/auth/student/register
4. On success, user is logged in and redirected to student dashboard
5. On failure, error message is displayed


## Login

### Server Routes
- **POST /api/auth/student/login** 
Student Login
Server Route
POST /api/auth/student/login - Student login with email and password validation
Request Body
email: VARCHAR(255) (student's email address)
password: VARCHAR(255) (plaintext password, compared with hashed password in database)

Validation using express-validator
email: isEmail().notEmpty().withMessage("Invalid Email")
password: isLength({min: 8}).notEmpty().withMessage("Password must be at least 8 characters long")

Response Object:
token: JWT token string (generated using tokenManager.generateToken(student.id))
user:
id: INTEGER (student's database ID)
studentId: VARCHAR(20) UNIQUE (student's unique identifier)
name: VARCHAR(255) (student's full name)
email: VARCHAR(255) UNIQUE (student's email address)
department: VARCHAR(100) (student's department)
year: INTEGER (student's academic year)
collegeId: INTEGER (foreign key referencing colleges table)

### Frontend Components
- `client/src/components/student/StudentLogin.jsx` - Student login form
- Student authentication with email and password
on successful navigate to studentDashboard.jsx
on unsusuccessfull navigate to StudentLogin.jsx 





- **POST /api/auth/admin/login** -
Admin Login
Server Route
POST /api/auth/admin/login - Admin login with email and password
Request Body
email: VARCHAR(255) (admin's email address)
password: VARCHAR(255) (plaintext password, compared with hashed password_hash in database)
admin are directly registered in database and password are distrubuted to admin 

Validation using express-validator
email: isEmail().notEmpty().withMessage("Invalid Email")
password: isLength({min: 8}).notEmpty().withMessage("Password must be at least 8 characters long")

Response Object
token: JWT token string (generated using tokenManager.generateToken(admin.id))
user:
id: INTEGER (admin's database ID)
name: VARCHAR(255) (admin's full name)
email: VARCHAR(255) UNIQUE (admin's email address)
role: VARCHAR(20) (admin role, default 'admin')
collegeId: INTEGER (foreign key referencing colleges table)

### Frontend Components
- `client/src/components/admin/AdminLogin.jsx` - Admin login form
 Admin authentication with email and password
on successful navigate to AdminDashboard.jsx
on unsusuccessfull navigate to AdminLogin.jsx 



### Flow
1. User enters credentials in respective login component (StudentLogin or AdminLogin)
2. Form data is sent to AuthContext.login() function with user type
3. API call made to appropriate login endpoint (/api/auth/student/login or /api/auth/admin/login)
4. On success, JWT token is stored and user is redirected to respective dashboard
5. On failure, error message is displayed
6. Logout removes token and redirects to login page


- **POST /api/auth/student/logout** 
Student Logout
Server Route
POST /api/auth/student/logout - Student logout (requires student authentication)
Request Body
No request body required (token extracted from cookies or Authorization header)
Response Object
success: boolean (true for successful logout)
message: string ("Logged out successfully")


- **POST /api/auth/admin/logout** 
Admin Logout
Server Route
POST /api/auth/admin/logout - Admin logout (requires admin authentication)
Request Body
No request body required (token extracted from cookies or Authorization header)
Response Object
success: boolean (true for successful logout)
message: string ("Logged out successfully")




- `client/src/contexts/AuthContext.jsx` - Handles login/logout API calls and authentication state






## Events

### Server Routes
- 
### Server Routes and API Specifications

#### 1. Create New Event (Admin only)
- **Endpoint:** POST /api/events
- **Request Body:**
  ```json
  {
    "title": "string",              // Title of the event (max 255 characters)
    "description": "string",        // Description of the event (text)
    "event_type": "string",         // Type of event, one of: "workshop", "seminar", "fest", "hackathon", "tech_talk"
    "date": "string (YYYY-MM-DD)",  // Date of the event
    "time": "string (HH:MM:SS)",    // Time of the event
    "location": "string",           // Location of the event (max 255 characters)
    "max_capacity": "number"        // Maximum number of participants allowed
  }
  ```
- **What it does:** Creates a new event associated with the admin's college.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Event created",
    "eventId": "number"             // ID of the newly created event
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "Server error"
  }
  ```

#### 2. Get Events for a Specific College
- **Endpoint:** GET /api/events/:collegeId
- **Request Parameters:**
  - `collegeId` (string/number): ID of the college to fetch events for.
- **What it does:** Retrieves all events for the specified college, ordered by date and time.
- **Response:**
  ```json
  {
    "success": true,
    "events": [
      {
        "id": "number",
        "college_id": "number",
        "title": "string",
        "description": "string",
        "event_type": "string",
        "date": "string (YYYY-MM-DD)",
        "time": "string (HH:MM:SS)",
        "location": "string",
        "max_capacity": "number",
        "current_registrations": "number",
        "status": "string",           // "active", "cancelled", or "completed"
        "created_by": "number",
        "created_at": "string (datetime)",
        "created_by_name": "string"  // Name of the admin who created the event
      },
      ...
    ]
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "Server error"
  }
  ```

#### 3. Get Specific Event Details (Admin only)
- **Endpoint:** GET /api/events/admin/:eventId
- **Request Parameters:**
  - `eventId` (string/number): ID of the event to fetch.
- **What it does:** Retrieves detailed information about a specific event.
- **Response:**
  ```json
  {
    "success": true,
    "event": {
      "id": "number",
      "college_id": "number",
      "title": "string",
      "description": "string",
      "event_type": "string",
      "date": "string (YYYY-MM-DD)",
      "time": "string (HH:MM:SS)",
      "location": "string",
      "max_capacity": "number",
      "current_registrations": "number",
      "status": "string",
      "created_by": "number",
      "created_at": "string (datetime)",
      "created_by_name": "string"
    }
  }
  ```
- **Error Responses:**
  - 404 Not Found:
    ```json
    {
      "success": false,
      "message": "Event not found"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

#### 4. Update Event (Admin only)
- **Endpoint:** PUT /api/events/:eventId
- **Request Parameters:**
  - `eventId` (string/number): ID of the event to update.
- **Request Body:**
  ```json
  {
    "title": "string",
    "description": "string",
    "event_type": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:MM:SS)",
    "location": "string",
    "max_capacity": "number",
    "status": "string"              // "active", "cancelled", or "completed"
  }
  ```
- **What it does:** Updates the specified event's details.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Event updated"
  }
  ```
- **Error Responses:**
  - 404 Not Found or Unauthorized:
    ```json
    {
      "success": false,
      "message": "Event not found or not authorized"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

#### 5. Delete/Cancel Event (Admin only)
- **Endpoint:** DELETE /api/events/:eventId
- **Request Parameters:**
  - `eventId` (string/number): ID of the event to cancel.
- **What it does:** Marks the event status as "cancelled".
- **Response:**
  ```json
  {
    "success": true,
    "message": "Event cancelled"
  }
  ```
- **Error Responses:**
  - 404 Not Found or Unauthorized:
    ```json
    {
      "success": false,
      "message": "Event not found or not authorized"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

### Frontend Components
- `client/src/components/admin/CreateEvent.jsx` - Event creation form
- `client/src/components/admin/EditEvent.jsx` - Event editing form
- `client/src/components/admin/EventList.jsx` - Display list of events for admin
- `client/src/components/admin/EventDetails.jsx` - Detailed event view for admin
- `client/src/components/admin/EventInfo.jsx` - Event information display
- `client/src/components/student/EventBrowser.jsx` - Browse available events for students
- `client/src/components/student/StudentDashboard.jsx` - Student dashboard showing events

### Flow
1. **Admin Event Management:**
   - Admin uses CreateEvent component to create new events via POST /api/events
   - Admin views events in EventList component using GET /api/events/:collegeId
   - Admin can edit events using EditEvent component via PUT /api/events/:eventId
   - Admin can delete events via DELETE /api/events/:eventId

2. **Student Event Browsing:**
   - Students browse events in EventBrowser component using GET /api/events/:collegeId
   - Events are displayed in StudentDashboard for easy access



## Registrations

### Server Routes and API Specifications

#### 1. Register Student for Event
- **Endpoint:** POST /api/registrations/:eventId
- **Authentication:** Student (JWT token required)
- **Request Parameters:**
  - `eventId` (integer): ID of the event to register for (from URL)
- **Request Body:** None (student ID extracted from JWT token)
- **What it does:** Registers the authenticated student for the specified event. Validates that the event exists and is active, checks if the event has reached maximum capacity, prevents duplicate registrations, inserts a new record into the event_registrations table, and increments the event's current_registrations count.
- **Response (Success):**
  ```json
  {
    "success": true,
    "message": "Registered for event"
  }
  ```
- **Error Responses:**
  - 400 Bad Request (Event full):
    ```json
    {
      "success": false,
      "message": "Event is full"
    }
    ```
  - 400 Bad Request (Already registered):
    ```json
    {
      "success": false,
      "message": "Already registered"
    }
    ```
  - 404 Not Found:
    ```json
    {
      "success": false,
      "message": "Event not found or inactive"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

#### 2. Get Registered Students for Event (Admin only)
- **Endpoint:** GET /api/registrations/:eventId
- **Authentication:** Admin (JWT token required)
- **Request Parameters:**
  - `eventId` (integer): ID of the event to get registrations for (from URL)
- **Request Body:** None
- **What it does:** Retrieves a list of all students registered for the specified event. Validates that the event exists and belongs to the admin's college. Returns student details including student ID, name, email, department, registration date, and status.
- **Response (Success):**
  ```json
  {
    "success": true,
    "registrations": [
      {
        "student_id": "string (e.g., 'STU001')",
        "name": "string (student's full name)",
        "email": "string (student's email address)",
        "department": "string (student's department)",
        "registration_date": "string (datetime)",
        "status": "string ('registered' or 'cancelled')"
      },
      ...
    ]
  }
  ```
- **Error Responses:**
  - 404 Not Found:
    ```json
    {
      "success": false,
      "message": "Event not found"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

#### 3. Get Student's Registrations
- **Endpoint:** GET /api/registrations/student/all
- **Authentication:** Student (JWT token required)
- **Request Parameters:** None
- **Request Body:** None (student ID extracted from JWT token)
- **What it does:** Retrieves all events that the authenticated student is registered for. Returns event details including event ID, title, date, time, location, and registration status.
- **Response (Success):**
  ```json
  {
    "success": true,
    "events": [
      {
        "event_id": "integer",
        "title": "string (event title)",
        "date": "string (YYYY-MM-DD)",
        "time": "string (HH:MM:SS)",
        "location": "string (event location)",
        "status": "string ('registered' or 'cancelled')"
      },
      ...
    ]
  }
  ```
- **Error Response:**
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

### Frontend Components
- `client/src/components/student/MyRegistrations.jsx` - Display student's event registrations
- `client/src/components/admin/Registrations.jsx` - Admin view of event registrations
- `client/src/components/student/EventBrowser.jsx` - Contains registration buttons for events
- `client/src/components/student/StudentDashboard.jsx` - Shows registration status

### Flow
1. **Student Registration:**
   - Student clicks register button in EventBrowser or StudentDashboard
   - API call made to POST /api/registrations/:eventId
   - Registration status updated in MyRegistrations component

2. **Admin View:**
   - Admin views registered students for events in Registrations component
   - Uses GET /api/registrations/:eventId to fetch registration data

3. **Student View:**
   - Student views their registrations in MyRegistrations component
   - Uses GET /api/registrations/student/all to fetch their registration data

## Attendance

### Server Routes and API Specifications

#### 1. Mark Attendance for Multiple Students (Admin only)
- **Endpoint:** PUT /api/attendance/mark/:eventId
- **Authentication:** Admin (JWT token required)
- **Request Parameters:**
  - `eventId` (integer): ID of the event to mark attendance for (from URL)
- **Request Body:**
  ```json
  {
    "attendanceData": [
      {
        "student_id": "string (student unique ID)",
        "status": "string ('present' or 'absent')"
      },
      ...
    ]
  }
  ```
- **What it does:** Marks attendance for multiple students for the specified event. Validates event existence and admin's college, inserts or updates attendance records in the database within a transaction.
- **Response (Success):**
  ```json
  {
    "message": "Attendance marked successfully"
  }
  ```
- **Error Responses:**
  - 400 Bad Request:
    ```json
    {
      "error": "attendanceData must be an array"
    }
    ```
  - 404 Not Found:
    ```json
    {
      "error": "Event not found"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "error": "Error message"
    }
    ```

#### 2. Get Attendance Report for an Event (Admin only)
- **Endpoint:** GET /api/attendance/report/:eventId
- **Authentication:** Admin (JWT token required)
- **Request Parameters:**
  - `eventId` (integer): ID of the event to get attendance report for (from URL)
- **Request Body:** None
- **What it does:** Retrieves attendance statistics and detailed attendance list for the specified event. Validates event existence and admin's college.
- **Response (Success):**
  ```json
  {
    "event": {
      "id": "integer",
      "title": "string",
      "date": "string (YYYY-MM-DD)",
      "time": "string (HH:MM:SS)",
      "location": "string"
    },
    "statistics": {
      "total_registered": "integer",
      "total_present": "integer",
      "total_absent": "integer",
      "attendance_percentage": "float"
    },
    "attendance_list": [
      {
        "id": "integer (student id)",
        "student_id": "string",
        "name": "string",
        "email": "string",
        "department": "string",
        "year": "integer",
        "registration_date": "string (datetime)",
        "attendance_status": "string ('present', 'absent', or null)",
        "check_in_time": "string (datetime)",
        "final_status": "string ('registered', 'cancelled', 'not_marked', 'present', or 'absent')"
      },
      ...
    ]
  }
  ```
- **Error Responses:**
  - 404 Not Found:
    ```json
    {
      "error": "Event not found"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "error": "Internal server error"
    }
    ```

#### 3. Get Student's Attendance Records
- **Endpoint:** GET /api/attendance/my-attendance/:id
- **Authentication:** Student (JWT token required)
- **Request Parameters:**
  - `id` (integer): Student ID (from URL)
- **Request Body:** None
- **What it does:** Retrieves attendance statistics and detailed attendance list for the authenticated student across all registered events.
- **Response (Success):**
  ```json
  {
    "statistics": {
      "total_registered": "integer",
      "total_present": "integer",
      "total_absent": "integer",
      "attendance_percentage": "float"
    },
    "attendance_list": [
      {
        "event_id": "integer",
        "event_title": "string",
        "event_date": "string (YYYY-MM-DD)",
        "event_time": "string (HH:MM:SS)",
        "location": "string",
        "registration_date": "string (datetime)",
        "attendance_status": "string ('present', 'absent', or null)",
        "check_in_time": "string (datetime)",
        "final_status": "string ('registered', 'cancelled', 'not_marked', 'present', or 'absent')"
      },
      ...
    ]
  }
  ```
- **Error Response:**
  - 500 Server Error:
    ```json
    {
      "error": "Internal server error"
    }
    ```

### Frontend Components
- `client/src/components/admin/AttendanceReport.jsx` - Admin attendance management and reporting
- `client/src/components/student/MyAttendance.jsx` - Student attendance view
- `client/src/components/admin/DashboardOverview.jsx` - Admin dashboard attendance summary

### Flow

## Feedback

### Server Routes and API Specifications

#### 1. Submit Feedback for an Event (Student only)
- **Endpoint:** POST /api/feedback/:eventId
- **Authentication:** Student (JWT token required)
- **Request Parameters:**
  - `eventId` (integer): ID of the event to submit feedback for (from URL)
- **Request Body:**
  ```json
  {
    "rating": "integer (1 to 5)",
    "comments": "string (optional)"
  }
  ```
- **What it does:** Inserts or updates the student's feedback for the specified event. 
- **Response (Success):**
  ```json
  {
    "success": true,
    "message": "Feedback submitted successfully"
  }
  ```
- **Error Response:**
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

#### 2. Get All Feedback for Events (Admin only)
- **Endpoint:** GET /api/feedback/:admin/all
- **Authentication:** Admin (JWT token required)
- **Request Parameters:** None (admin ID extracted from JWT token)
- **Request Body:** None
- **What it does:** Retrieves all feedback for events belonging to the admin's college. Returns feedback details including rating, comments, submission date, student ID, student name, and event title.
- **Response (Success):**
  ```json
  {
    "success": true,
    "feedbacks": [
      {
        "id": "integer",
        "rating": "integer",
        "comments": "string",
        "submitted_at": "string (datetime)",
        "student_id": "string",
        "name": "string",
        "event_title": "string"
      },
      ...
    ]
  }
  ```
- **Error Responses:**
  - 404 Not Found:
    ```json
    {
      "success": false,
      "message": "Event not found"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

#### 3. Get Student's Submitted Feedback (Student only)
- **Endpoint:** GET /api/feedback/student/all/:studentid
- **Authentication:** Student (JWT token required)
- **Request Parameters:** None (student ID extracted from JWT token)
- **Request Body:** None
- **What it does:** Retrieves all feedback submitted by the authenticated student. Returns feedback details including rating, comments, submission date, event ID, and event title.
- **Response (Success):**
  ```json
  {
    "success": true,
    "feedbacks": [
      {
        "id": "integer",
        "rating": "integer",
        "comments": "string",
        "submitted_at": "string (datetime)",
        "event_id": "integer",
        "title": "string"
      },
      ...
    ]
  }
  ```
- **Error Response:**
  - 500 Server Error:
    ```json
    {
      "success": false,
      "message": "Server error"
    }
    ```

### Frontend Components
- `client/src/components/student/FeedbackForm.jsx` - Student feedback submission form
- `client/src/components/student/FeedbackList.jsx` - Display student's feedback history
- `client/src/components/student/MyFeedback.jsx` - Student feedback management
- `client/src/components/admin/Reports.jsx` - Admin feedback reports

### Flow
1. **Student Feedback Submission:**
   - Student submits feedback using FeedbackForm component
   - API call made to POST /api/feedback/:eventId
   - Feedback history displayed in FeedbackList and MyFeedback components

2. **Admin Feedback View:**
   - Admin views all feedback in Reports component
   - Uses GET /api/feedback/:admin/all to fetch feedback data

3. **Student Feedback History:**
   - Student views their feedback in MyFeedback and FeedbackList components
   - Uses GET /api/feedback/student/all/:studentid

## Reports

### Server Routes and API Specifications

#### 1. Get Event Statistics (Admin only)
- **Endpoint:** GET /api/reports/events
- **Authentication:** Admin (JWT token required)
- **Request Parameters:** None
- **Request Body:** None
- **What it does:** Retrieves event statistics for the admin's college, including counts of active, cancelled, and completed events.
- **Response (Success):**
  ```json
  {
    "success": true,
    "stats": {
      "active": "integer (count of active events)",
      "cancelled": "integer (count of cancelled events)",
      "completed": "integer (count of completed events)"
    }
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "Server error"
  }
  ```

#### 2. Get Student Statistics (Admin only)
- **Endpoint:** GET /api/reports/students
- **Authentication:** Admin (JWT token required)
- **Request Parameters:** None
- **Request Body:** None
- **What it does:** Retrieves student statistics for the admin's college, including total students and participation data (students with their registration counts).
- **Response (Success):**
  ```json
  {
    "success": true,
    "totalStudents": "integer (total number of students in the college)",
    "participation": [
      {
        "student_id": "string (student's unique ID)",
        "name": "string (student's full name)",
        "events_registered": "integer (number of events the student is registered for)"
      },
      ...
    ]
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "Server error"
  }
  ```

#### 3. Get Feedback Statistics (Admin only)
- **Endpoint:** GET /api/reports/feedback
- **Authentication:** Admin (JWT token required)
- **Request Parameters:** None
- **Request Body:** None
- **What it does:** Retrieves feedback statistics for events in the admin's college, including average ratings and feedback counts per event.
- **Response (Success):**
  ```json
  {
    "success": true,
    "feedbackStats": [
      {
        "event_id": "integer",
        "title": "string (event title)",
        "avg_rating": "float (average rating, or null if no feedback)",
        "feedback_count": "integer (number of feedback submissions)"
      },
      ...
    ]
  }
  ```
- **Error Response:**
  ```json
  {
    "success": false,
    "message": "Server error"
  }
  ```

### Frontend Components
- `client/src/components/admin/Reports.jsx` - Main reports dashboard displaying event stats, student stats, feedback stats, and top events
- `client/src/components/admin/TopEvents.jsx` - Displays top events based on registrations
- `client/src/components/admin/DashboardOverview.jsx` - Dashboard overview with key metrics

### Flow
1. Admin accesses reports through Reports component
2. Component fetches data from multiple endpoints simultaneously:
   - GET /api/reports/events for event statistics
   - GET /api/reports/students for student statistics
   - GET /api/reports/feedback for feedback statistics
   - GET /api/events/:collegeId for event list (used by TopEvents)
3. **Event Statistics Display:**
   - Active events count displayed in blue card
   - Cancelled events count displayed in red card
4. **Student Statistics Display:**
   - Total students count displayed in purple card
   - Active participants count (students with registrations) displayed in orange card
   - Top participants table showing student ID, name, and events registered (sorted by registration count)
5. **Feedback Statistics Display:**
   - Table showing event title, average rating (with star visualization), and feedback count
   - Handles cases where no feedback exists (shows 'N/A' for rating)
6. TopEvents component displays most popular events based on registration data
7. DashboardOverview component shows summarized metrics across the admin dashboard

## Colleges

### Server Routes and API Specifications

#### 1. Get All Colleges
- **Endpoint:** GET /api/colleges/collegess
- **Authentication:** None required
- **Request Parameters:** None
- **Request Body:** None
- **What it does:** Retrieves a list of all colleges in the system, ordered by ID.
- **Response (Success):**
  ```json
  {
    "colleges": [
      {
        "id": "integer",
        "name": "string (e.g., 'Tech University')",
        "location": "string (optional)",
        "created_at": "string (datetime)"
      },
      ...
    ]
  }
  ```
- **Error Response:**
  ```json
  {
    "message": "Failed to fetch colleges"
  }
  ```

### Frontend Components
- `client/src/components/student/StudentRegister.jsx` - College selection during registration via dropdown
- Various components may use college data for filtering events by college

### Flow
1. Colleges list is fetched during student registration in StudentRegister component
2. API call made to GET /api/colleges/collegess
3. Colleges are displayed in a dropdown for student selection
4. Selected college ID is included in registration data
5. Events can be filtered by college ID in various components (e.g., EventBrowser)

## Students

### Server Routes and API Specifications

#### 1. Get All Students (Admin only)
- **Endpoint:** GET /api/students
- **Authentication:** Admin (JWT token required)
- **Request Parameters:** None
- **Request Body:** None
- **What it does:** Retrieves a list of all students belonging to the admin's college, including basic student information.
- **Response (Success):**
  ```json
  [
    {
      "id": "integer (student's database ID)",
      "student_id": "string (student's unique identifier, e.g., 'STU001')",
      "name": "string (student's full name)",
      "email": "string (student's email address)",
      "phone": "string (student's phone number)",
      "department": "string (student's department)",
      "year": "integer (student's academic year)"
    },
    ...
  ]
  ```
- **Error Response:**
  ```json
  {
    "error": "Internal server error"
  }
  ```

#### 2. Get Student by ID (Admin only)
- **Endpoint:** GET /api/students/:studentId
- **Authentication:** Admin (JWT token required)
- **Request Parameters:**
  - `studentId` (integer): ID of the student to retrieve (from URL)
- **Request Body:** None
- **What it does:** Retrieves detailed information about a specific student belonging to the admin's college.
- **Response (Success):**
  ```json
  {
    "id": "integer",
    "student_id": "string",
    "name": "string",
    "email": "string",
    "phone": "string",
    "department": "string",
    "year": "integer"
  }
  ```
- **Error Responses:**
  - 404 Not Found:
    ```json
    {
      "error": "Student not found"
    }
    ```
  - 500 Server Error:
    ```json
    {
      "error": "Internal server error"
    }
    ```



## Authentication & Authorization

### Middleware
- `authenticateStudent` - Protects student-only routes
- `authenticateAdmin` - Protects admin-only routes

### Context
- `AuthContext` manages authentication state across the application
- Handles token storage, API interceptors, and user session management

### Protected Routes
- `ProtectedRoute.jsx` component ensures users are authenticated before accessing protected pages
- Redirects unauthenticated users to appropriate login pages

## API Integration

### Base Configuration
- `client/src/utils/api.js` - Axios instance with base URL and interceptors
- Automatic token attachment to requests
- Centralized error handling for authentication failures

### Error Handling
- 401 responses trigger automatic logout and redirect
- User-friendly error messages displayed in components
- Loading states managed during API calls

