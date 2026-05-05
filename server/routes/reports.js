const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/reports/daily-sales → 'dailySales' collection
router.get('/daily-sales', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const dailySales = await db.collection('dailySales').find({}).sort({ date: -1 }).toArray();
    res.json(dailySales);
  } catch (err) {
    console.error('Error fetching daily sales:', err);
    res.status(500).json({ message: 'Failed to fetch daily sales' });
  }
});

// GET /api/reports/revenues → 'revenues' collection
router.get('/revenues', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const revenues = await db.collection('revenues').find({}).sort({ date: -1 }).toArray();
    res.json(revenues);
  } catch (err) {
    console.error('Error fetching revenues:', err);
    res.status(500).json({ message: 'Failed to fetch revenues' });
  }
});

// POST /api/reports/daily-sales → add daily sales record
router.post('/daily-sales', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const dailySalesRecord = {
      ...req.body,
      date: req.body.date || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('dailySales').insertOne(dailySalesRecord);
    res.status(201).json({ 
      success: true, 
      salesId: result.insertedId,
      message: 'Daily sales record created successfully' 
    });
  } catch (err) {
    console.error('Error creating daily sales record:', err);
    res.status(500).json({ message: 'Failed to create daily sales record' });
  }
});

// POST /api/reports/revenues → add revenue record
router.post('/revenues', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const revenueRecord = {
      ...req.body,
      date: req.body.date || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('revenues').insertOne(revenueRecord);
    res.status(201).json({ 
      success: true, 
      revenueId: result.insertedId,
      message: 'Revenue record created successfully' 
    });
  } catch (err) {
    console.error('Error creating revenue record:', err);
    res.status(500).json({ message: 'Failed to create revenue record' });
  }
});

// GET /api/reports/summary → comprehensive report summary
router.get('/summary', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    
    // Get daily sales summary
    const dailySales = await db.collection('dailySales').find({}).sort({ date: -1 }).limit(30).toArray();
    
    // Get revenues summary
    const revenues = await db.collection('revenues').find({}).sort({ date: -1 }).limit(30).toArray();
    
    // Calculate totals
    const totalSales = dailySales.reduce((sum, sale) => sum + (sale.totalAmount || 0), 0);
    const totalRevenue = revenues.reduce((sum, revenue) => sum + (revenue.amount || 0), 0);
    
    res.json({
      dailySales: dailySales,
      revenues: revenues,
      summary: {
        totalSales: totalSales,
        totalRevenue: totalRevenue,
        totalDays: dailySales.length
      }
    });
  } catch (err) {
    console.error('Error generating report summary:', err);
    res.status(500).json({ message: 'Failed to generate report summary' });
  }
});

module.exports = router;
