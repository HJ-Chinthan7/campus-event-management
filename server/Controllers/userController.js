const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const tokenMangager = require('../utils/tokenManager');
const database = require('../database/database');
module.exports.registerStudent=async (req, res) => {
    
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const { studentId, name, email, phone, department, year, collegeId ,password} = req.body;

        
        const existingStudent = await database.get(
            'SELECT * FROM students WHERE email = ? OR student_id = ?',
            [email, studentId]
        );


        if (existingStudent) {
            return res.status(400).json({ error: 'Student already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await database.run(
            'INSERT INTO students (college_id, student_id, name, email, phone, department, year,password) VALUES (?, ?, ?, ?, ?, ?, ?,?)',
            [collegeId, studentId, name, email, phone, department, year,hashedPassword]
        );

        const token = tokenMangager.generateToken(result.id);
        res.cookie('token', token, { expiresIn: '1h' });
        res.status(201).json({
            token,
            user: {
                id: result.id,
                studentId,
                name,
                email,
                department,
                year,
                collegeId
            }
        });
    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports.loginStudent= async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        
        const student = await database.get(
            'SELECT * FROM students WHERE email = ?',
            [email]
        );

        if (!student) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
       
        const token = tokenMangager.generateToken(student.id);
        res.cookie('token', token, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: student.id,
                studentId: student.student_id,
                name: student.name,
                email: student.email,
                department: student.department,
                year: student.year,
                collegeId: student.college_id
            }
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports.adminLogin=async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const admin = await database.get(
            'SELECT * FROM admins WHERE email = ?',
            [email]
        );

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
console.log(admin)
        const isValidPassword = await bcrypt.compare(password, admin.password_hash);
        console.log(isValidPassword);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = tokenMangager.generateToken(admin.id);
        res.cookie('token', token, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: admin.id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                collegeId: admin.college_id
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports.adminLogout = async (req, res) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(400).json({ success: false, message: 'No token found' });

        //await database.run(`INSERT INTO token_blacklist (token) VALUES (?)`, [token]);

        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports.studentLogout = async (req, res) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(400).json({ success: false, message: 'No token found' });

        //await database.run(`INSERT INTO token_blacklist (token) VALUES (?)`, [token]);
        res.clearCookie('token');
        res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
