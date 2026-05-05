const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/delivery → 'deliveryDetails' collection
router.get('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const deliveryRecords = await db.collection('deliveryDetails').find({}).sort({ createdAt: -1 }).toArray();
    res.json(deliveryRecords);
  } catch (err) {
    console.error('Error fetching delivery records:', err);
    res.status(500).json({ message: 'Failed to fetch delivery records' });
  }
});

// POST /api/delivery → add delivery record
router.post('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const deliveryRecord = {
      ...req.body,
      status: req.body.status || 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('deliveryDetails').insertOne(deliveryRecord);
    res.status(201).json({ 
      success: true, 
      deliveryId: result.insertedId,
      message: 'Delivery record added successfully' 
    });
  } catch (err) {
    console.error('Error adding delivery record:', err);
    res.status(500).json({ message: 'Failed to add delivery record' });
  }
});

// PUT /api/delivery/:id → update delivery record
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid delivery record ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('deliveryDetails').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Delivery record updated successfully' 
    });
  } catch (err) {
    console.error('Error updating delivery record:', err);
    res.status(500).json({ message: 'Failed to update delivery record' });
  }
});

// DELETE /api/delivery/:id → delete delivery record
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid delivery record ID' });
    }
    
    const result = await db.collection('deliveryDetails').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Delivery record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Delivery record deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting delivery record:', err);
    res.status(500).json({ message: 'Failed to delete delivery record' });
  }
});

module.exports = router;
