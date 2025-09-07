const express = require('express');
const router = express.Router();

const db = require('../database/database'); 
router.get('/collegess', async (req, res) => {
  try {
    const colleges = await db.query('SELECT * FROM colleges ORDER BY id ASC');
    res.json({ colleges });
  } catch (err) {
    console.error('Error fetching colleges:', err);
    res.status(500).json({ message: 'Failed to fetch colleges' });
  }
});

module.exports = router