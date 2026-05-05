const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/warehouse → 'warehouse' collection
router.get('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const warehouseItems = await db.collection('warehouse').find({}).sort({ createdAt: -1 }).toArray();
    res.json(warehouseItems);
  } catch (err) {
    console.error('Error fetching warehouse items:', err);
    res.status(500).json({ message: 'Failed to fetch warehouse items' });
  }
});

// POST /api/warehouse → add warehouse item
router.post('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const warehouseItem = {
      ...req.body,
      quantity: req.body.quantity || 0,
      minStock: req.body.minStock || 0,
      status: req.body.status || 'In Stock',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('warehouse').insertOne(warehouseItem);
    res.status(201).json({ 
      success: true, 
      itemId: result.insertedId,
      message: 'Warehouse item added successfully' 
    });
  } catch (err) {
    console.error('Error adding warehouse item:', err);
    res.status(500).json({ message: 'Failed to add warehouse item' });
  }
});

// PUT /api/warehouse/:id → update warehouse item
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid warehouse item ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('warehouse').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Warehouse item not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Warehouse item updated successfully' 
    });
  } catch (err) {
    console.error('Error updating warehouse item:', err);
    res.status(500).json({ message: 'Failed to update warehouse item' });
  }
});

// DELETE /api/warehouse/:id → delete warehouse item
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid warehouse item ID' });
    }
    
    const result = await db.collection('warehouse').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Warehouse item not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Warehouse item deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting warehouse item:', err);
    res.status(500).json({ message: 'Failed to delete warehouse item' });
  }
});

module.exports = router;
