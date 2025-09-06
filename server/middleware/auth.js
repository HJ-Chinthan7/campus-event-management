const jwt = require('jsonwebtoken');
const database = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';


const authenticateStudent = async (req, res, next) => {
    try {
        const token=req.headers['authorization'].split(' ')[1];
        
        if(!token) return res.status(401).json({ error: 'student access required' });
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.type !== 'student') {
            return res.status(403).json({ error: 'Student access required' });
        }
        
        const student = await database.get(
            'SELECT * FROM students WHERE id = ?',
            [decoded.id]
        );
        
        if (!student) {
            return res.status(401).json({ error: 'Student not found' });
        }
        
        req.user = { ...decoded, ...student };
        next();
        
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

 
const authenticateAdmin = async (req, res, next) => {
    try {
        
        const token=req.headers['authorization'].split(' ')[1];
        if(!token) return res.status(401).json({ error: 'Admin access required' });
        const decoded = jwt.verify(token, JWT_SECRET);
        
        if (decoded.type !== 'admin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        
        const admin = await database.get(
            'SELECT * FROM admins WHERE id = ?',
            [decoded.id]
        );
        
        if (!admin) {
            return res.status(401).json({ error: 'Admin not found' });
        }
        
        req.user = { ...decoded, ...admin };
        next();
        
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.type !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

const requireStudent = (req, res, next) => {
    if (req.user.type !== 'student') {
        return res.status(403).json({ error: 'Student access required' });
    }
    next();
};


module.exports = {
    authenticateToken,
    requireAdmin,
    requireStudent
};
