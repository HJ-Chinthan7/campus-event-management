


CREATE TABLE IF NOT EXISTS colleges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);


CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    student_id VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(15),
    department VARCHAR(100),
    year INTEGER,
    password VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id)
);


CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    college_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('workshop', 'seminar', 'fest', 'hackathon', 'tech_talk')),
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255),
    max_capacity INTEGER,
    current_registrations INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'completed')),
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (created_by) REFERENCES admins(id)
);


CREATE TABLE IF NOT EXISTS event_registrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled')),
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(event_id, student_id)
);



DROP TABLE IF EXISTS attendance;

CREATE TABLE attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  status TEXT CHECK(status IN ('present','absent')),
  check_in_time TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(event_id, student_id), 
  FOREIGN KEY(event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    UNIQUE(event_id, student_id)
);


CREATE INDEX IF NOT EXISTS idx_events_college_id ON events(college_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_student_id ON event_registrations(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_event_id ON attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_id ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_feedback_event_id ON feedback(event_id);
CREATE INDEX IF NOT EXISTS idx_feedback_student_id ON feedback(student_id);


INSERT OR IGNORE INTO colleges (id, name, code) VALUES 
(1, 'DemoCollege1', 'CS000AS01'),
(2, 'DemoCollege2', 'CS000AS02'),
(3, 'DemoCollege3', 'CS000AS03'),
(4, 'DemoCollege4', 'CS000AS04'),
(5, 'DemoCollege5', 'CS000AS05'),
(6, 'DemoCollege6', 'CS000AS06'),
(7, 'DemoCollege7', 'CS000AS07'),
(8, 'DemoCollege8', 'CS000AS08'),
(9, 'DemoCollege9', 'CS000AS09'),
(10, 'DemoCollege10', 'CS000AS10');

INSERT OR IGNORE INTO admins (id, college_id, name, email, password_hash, role) VALUES  
(1, 1, 'DemoCollege1 Admin', 'admin@democollege1.edu', '$2b$10$NRZcS1tUdFtSRzEMJeLWYO89t0WK7PPaNtINHtqrqapSHu7TJrryq', 'admin'), 
(2, 2, 'DemoCollege2 Admin', 'admin@democollege2.edu', '$2b$10$bEmgvHb9Lxq.M8dxHUrMveFmE9S0GEydm8tRxYeDPSinHgd4Jtmtm', 'admin'), 
(3, 3, 'DemoCollege3 Admin', 'admin@democollege3.edu', '$2b$10$K9lsJh1XUop8sBAlsUqJt..bM2WQsLd6.KE8v8pL0YGFER2ZqKbcW', 'admin'), 
(4, 4, 'DemoCollege4 Admin', 'admin@democollege4.edu', '$2b$10$veZLsdnIMkLyi4ZYgBWxSuQCIUabLYGtutw8jYFf2W6GA2WuJhYHS', 'admin'), 
(5, 5, 'DemoCollege5 Admin', 'admin@democollege5.edu', '$2b$10$1KZ6JE9VrV316T.BkxsdVe1twY/yZbIr2Y4FSi3Ppt0ujr/jQCKQy', 'admin'), 
(6, 6, 'DemoCollege6 Admin', 'admin@democollege6.edu', '$2b$10$mYV.2ZTiwOZmCndWgL9w0.lW80MX0YVu9b1ytuVjo.K1t0mi0xaaW', 'admin'), 
(7, 7, 'DemoCollege7 Admin', 'admin@democollege7.edu', '$2b$10$oQRq7Grp0o8MsLenCSsuvOJhyuXOOr6d9zr.Dmsx91mfkeAUI04xe', 'admin'), 
(8, 8, 'DemoCollege8 Admin', 'admin@democollege8.edu', '$2b$10$GxtjnVxSxR14I5M846UydOeYmO8/WfOrYhF.IchYsPwJiW9Q6YG6.', 'admin'), 
(9, 9, 'DemoCollege9 Admin', 'admin@democollege9.edu', '$2b$10$AYwJWzfXnnSUoLc.KM/kueuzCGy5GExb9SZ3Za4FwoY44SMlDTj6K', 'admin'), 
(10, 10, 'DemoCollege10 Admin', 'admin@democollege10.edu', '$2b$10$61Aew1G7/YR0vTa1CO6a9eRZJkPhhkF6809DA.TuTrPYM0XiMUWk6', 'admin');
