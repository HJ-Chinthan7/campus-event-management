const jwt = require('jsonwebtoken');
const database = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


const generateToken = (id) => {
    return jwt.sign(id, JWT_SECRET, { 
        expiresIn: '24h' 
    });
};

const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};


const isTokenBlacklisted = async (token) => {
    const result = await database.get(
        'SELECT * FROM blacklisted_tokens WHERE token = ?',
        [token]
    );
    return !!result;
};


const blacklistToken = async (token) => {
    await database.run(
        'INSERT INTO blacklisted_tokens (token) VALUES (?)',
        [token]
    );
};

module.exports = {
    generateToken,
    verifyToken,
    isTokenBlacklisted,
    blacklistToken
};
