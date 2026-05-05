const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/finance/transactions → 'transactions' collection
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

// GET /api/finance/expenses → 'expenses' collection
router.get('/expenses', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const expenses = await db.collection('expenses').find({}).sort({ date: -1 }).toArray();
    res.json(expenses);
  } catch (err) {
    console.error('Error fetching expenses:', err);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
});

// GET /api/finance/revenues → 'revenues' collection
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

// POST /api/finance/transactions → add transaction
router.post('/transactions', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const transaction = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('transactions').insertOne(transaction);
    res.status(201).json({ 
      success: true, 
      transactionId: result.insertedId,
      message: 'Transaction created successfully' 
    });
  } catch (err) {
    console.error('Error creating transaction:', err);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

// POST /api/finance/expenses → add expense
router.post('/expenses', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const expense = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('expenses').insertOne(expense);
    res.status(201).json({ 
      success: true, 
      expenseId: result.insertedId,
      message: 'Expense created successfully' 
    });
  } catch (err) {
    console.error('Error creating expense:', err);
    res.status(500).json({ message: 'Failed to create expense' });
  }
});

// POST /api/finance/revenues → add revenue
router.post('/revenues', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const revenue = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('revenues').insertOne(revenue);
    res.status(201).json({ 
      success: true, 
      revenueId: result.insertedId,
      message: 'Revenue created successfully' 
    });
  } catch (err) {
    console.error('Error creating revenue:', err);
    res.status(500).json({ message: 'Failed to create revenue' });
  }
});

module.exports = router;
