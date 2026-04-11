const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Safe model registration
const Inventory = mongoose.models.Inventory || 
  mongoose.model('Inventory', 
    new mongoose.Schema({}, { strict: false }), 
    'inventory'
  );

// GET /api/inventory - all inventory items
router.get('/', async (req, res) => {
  try {
    console.log('Inventory count:', await Inventory.countDocuments());
    const inventory = await Inventory.find({}).lean();
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// POST /api/inventory - add item
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unit, minStock, price, supplier } = req.body;
    
    // Determine status based on quantity
    let status = 'in-stock';
    if (quantity === 0) {
      status = 'out-of-stock';
    } else if (quantity <= (minStock || 10)) {
      status = 'low-stock';
    }
    
    const newItem = new Inventory({
      name,
      category,
      quantity,
      unit,
      minStock: minStock || 10,
      price,
      supplier,
      status,
      lastRestocked: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating inventory item:', error);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// PUT /api/inventory/:id - update item
router.put('/:id', async (req, res) => {
  try {
    const { name, category, quantity, unit, minStock, price, supplier } = req.body;
    
    // Determine status based on quantity
    let status = 'in-stock';
    if (quantity === 0) {
      status = 'out-of-stock';
    } else if (quantity <= (minStock || 10)) {
      status = 'low-stock';
    }
    
    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        category, 
        quantity, 
        unit, 
        minStock, 
        price, 
        supplier, 
        status,
        updatedAt: new Date(),
        lastRestocked: quantity > 0 ? new Date() : undefined
      },
      { new: true, strict: false }
    );
    
    if (!updatedItem) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    
    res.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

module.exports = router;
