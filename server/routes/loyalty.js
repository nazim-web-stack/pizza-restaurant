const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/loyalty → 'loyaltyPoints' collection
router.get('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const loyaltyPoints = await db.collection('loyaltyPoints').find({}).sort({ balance: -1 }).toArray();
    res.json(loyaltyPoints);
  } catch (err) {
    console.error('Error fetching loyalty points:', err);
    res.status(500).json({ message: 'Failed to fetch loyalty points' });
  }
});

// POST /api/loyalty → add loyalty points
router.post('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const loyaltyData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('loyaltyPoints').insertOne(loyaltyData);
    res.status(201).json({ 
      success: true, 
      loyaltyId: result.insertedId,
      message: 'Loyalty points created successfully' 
    });
  } catch (err) {
    console.error('Error creating loyalty points:', err);
    res.status(500).json({ message: 'Failed to create loyalty points' });
  }
});

// PUT /api/loyalty/:id → update points
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid loyalty ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('loyaltyPoints').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Loyalty record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Loyalty points updated successfully' 
    });
  } catch (err) {
    console.error('Error updating loyalty points:', err);
    res.status(500).json({ message: 'Failed to update loyalty points' });
  }
});

// DELETE /api/loyalty/:id → delete loyalty record
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid loyalty ID' });
    }
    
    const result = await db.collection('loyaltyPoints').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Loyalty record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Loyalty record deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting loyalty record:', err);
    res.status(500).json({ message: 'Failed to delete loyalty record' });
  }
});

module.exports = router;
