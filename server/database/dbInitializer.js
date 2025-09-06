const express = require('express');
const database = require('../database/database');

startServer = async (app,PORT) => {
    console.log(PORT);
    try {
        await database.initialize();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

module.exports = startServer;