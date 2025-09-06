const jwt = require('jsonwebtoken');
const database = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'onetwothreefourfive_updated_2024_campus_events';

const authenticateStudent = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access token required' });
        
        // const blacklistedToken = await database.get(
        //     'SELECT 1 FROM jwt_blacklist WHERE token = ?',
        //     [token]
        // );

        // if (blacklistedToken) {
        //     return res.status(401).json({ error: 'Token has been revoked' });
        // }
        
        const decoded = jwt.verify(token, JWT_SECRET);
const student = await database.get(
    'SELECT * FROM students WHERE id = ?',
    [decoded._id]
);
        if (!student) {
            return res.status(401).json({ error: 'Student not found' });
        }
        
        req.student = { ...decoded, ...student };
        next();
        
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const authenticateAdmin = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) return res.status(401).json({ error: 'Access token required' });
       
        // const blacklistedToken = await database.get(
        //     'SELECT 1 FROM jwt_blacklist WHERE token = ?',
        //     [token]
        // );

        // if (blacklistedToken) {
        //     return res.status(401).json({ error: 'Token has been revoked' });
        // }
        
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await database.get(
            'SELECT * FROM admins WHERE id = ? AND role = "admin"',
            [decoded._id]
        );
        if (!admin) {
            return res.status(401).json({ error: 'Admin not found' });
        }
        
        req.admin = { ...decoded, ...admin };
        next();
        
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = {
    authenticateAdmin,
    authenticateStudent
};