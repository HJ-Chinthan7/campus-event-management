const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const database = require('./database/database');
const startServer = require('./database/dbInitializer');
const dotenv = require('dotenv').config();
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const studentRoutes = require('./routes/students');
const registrationRoutes = require('./routes/registrations');
const attendanceRoutes = require('./routes/attendance');
const feedbackRoutes = require('./routes/feedback');
const reportRoutes = require('./routes/reports');
const collegeRoutes = require('./routes/collegeRoutes');


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/colleges', collegeRoutes);

startServer(app,PORT);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});


module.exports = app;