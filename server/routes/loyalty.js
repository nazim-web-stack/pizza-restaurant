const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all loyalty points data
router.get('/loyalty', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const loyaltyPoints = await db.collection('loyaltyPoints').find({}).sort({ balance: -1 }).toArray();
    res.json(loyaltyPoints);
  } catch (err) {
    console.error('Error fetching loyalty points:', err);
    res.status(500).json({ message: 'Failed to fetch loyalty points' });
  }
});

module.exports = router;
