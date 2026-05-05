const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/salaries → 'salaries' collection
router.get('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const salaries = await db.collection('salaries').find({}).sort({ paymentDate: -1 }).toArray();
    res.json(salaries);
  } catch (err) {
    console.error('Error fetching salaries:', err);
    res.status(500).json({ message: 'Failed to fetch salaries' });
  }
});

// POST /api/salaries → add salary record
router.post('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const salaryRecord = {
      ...req.body,
      paymentDate: req.body.paymentDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('salaries').insertOne(salaryRecord);
    res.status(201).json({ 
      success: true, 
      salaryId: result.insertedId,
      message: 'Salary record created successfully' 
    });
  } catch (err) {
    console.error('Error creating salary record:', err);
    res.status(500).json({ message: 'Failed to create salary record' });
  }
});

// PUT /api/salaries/:id → update salary record
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid salary ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('salaries').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Salary record updated successfully' 
    });
  } catch (err) {
    console.error('Error updating salary record:', err);
    res.status(500).json({ message: 'Failed to update salary record' });
  }
});

// DELETE /api/salaries/:id → delete salary record
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid salary ID' });
    }
    
    const result = await db.collection('salaries').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Salary record deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting salary record:', err);
    res.status(500).json({ message: 'Failed to delete salary record' });
  }
});

module.exports = router;
