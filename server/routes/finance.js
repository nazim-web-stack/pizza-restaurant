const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get all transactions
router.get('/transactions', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const transactions = await db.collection('transactions').find({}).sort({ date: -1 }).toArray();
    res.json(transactions);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

module.exports = router;
