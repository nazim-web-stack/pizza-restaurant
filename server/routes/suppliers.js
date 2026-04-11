const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Supplier Schema
const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactPerson: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true }, // vegetables, meat, dairy, etc.
  paymentTerms: { type: String, default: 'Net 30' },
  deliveryDays: { type: String }, // Monday, Wednesday, Friday
  rating: { type: Number, min: 1, max: 5, default: 3 },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const Supplier = mongoose.model('Supplier', SupplierSchema);

// GET /api/suppliers - all suppliers
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const suppliers = await Supplier.find(filter).sort({ name: 1 }).lean();
    res.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// POST /api/suppliers - add supplier
router.post('/', async (req, res) => {
  try {
    const { 
      name, 
      contactPerson, 
      email, 
      phone, 
      address, 
      category, 
      paymentTerms, 
      deliveryDays, 
      rating, 
      notes 
    } = req.body;
    
    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const newSupplier = new Supplier({
      name,
      contactPerson,
      email,
      phone,
      address,
      category,
      paymentTerms: paymentTerms || 'Net 30',
      deliveryDays,
      rating: rating || 3,
      status: 'active',
      notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedSupplier = await newSupplier.save();
    res.status(201).json(savedSupplier);
  } catch (error) {
    console.error('Error creating supplier:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

// GET /api/suppliers/:id - single supplier
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id).lean();
    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    res.json(supplier);
  } catch (error) {
    console.error('Error fetching supplier:', error);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

// PUT /api/suppliers/:id - update supplier
router.put('/:id', async (req, res) => {
  try {
    const { 
      name, 
      contactPerson, 
      email, 
      phone, 
      address, 
      category, 
      paymentTerms, 
      deliveryDays, 
      rating, 
      status, 
      notes 
    } = req.body;
    
    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        contactPerson, 
        email, 
        phone, 
        address, 
        category, 
        paymentTerms, 
        deliveryDays, 
        rating, 
        status, 
        notes, 
        updatedAt: new Date() 
      },
      { new: true, strict: false }
    );
    
    if (!updatedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

// DELETE /api/suppliers/:id - delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
    
    if (!deletedSupplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }
    
    res.json({ message: 'Supplier deleted successfully' });
  } catch (error) {
    console.error('Error deleting supplier:', error);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

module.exports = router;
