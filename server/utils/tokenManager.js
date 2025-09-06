const jwt = require('jsonwebtoken');
const database = require('../database/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


const generateToken = (id) => {
    const token=jwt.sign({_id:id},JWT_SECRET,{expiresIn:"24h"});
    return token;
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
    isTokenBlacklisted,
    blacklistToken
};
