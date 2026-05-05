const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/invoices → 'invoices' collection
router.get('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const invoices = await db.collection('invoices').find({}).sort({ invoiceDate: -1 }).toArray();
    res.json(invoices);
  } catch (err) {
    console.error('Error fetching invoices:', err);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});

// POST /api/invoices → create invoice
router.post('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const invoice = {
      ...req.body,
      invoiceDate: req.body.invoiceDate || new Date(),
      dueDate: req.body.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: req.body.status || 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Generate invoice number if not provided
    if (!invoice.invoiceNumber) {
      const lastInvoice = await db.collection('invoices')
        .find({})
        .sort({ invoiceNumber: -1 })
        .limit(1)
        .toArray();
      
      const lastNumber = lastInvoice.length > 0 ? parseInt(lastInvoice[0].invoiceNumber.replace('INV-', '')) : 0;
      invoice.invoiceNumber = `INV-${String(lastNumber + 1).padStart(6, '0')}`;
    }
    
    const result = await db.collection('invoices').insertOne(invoice);
    res.status(201).json({ 
      success: true, 
      invoiceId: result.insertedId,
      invoiceNumber: invoice.invoiceNumber,
      message: 'Invoice created successfully' 
    });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({ message: 'Failed to create invoice' });
  }
});

// PUT /api/invoices/:id → update invoice
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('invoices').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Invoice updated successfully' 
    });
  } catch (err) {
    console.error('Error updating invoice:', err);
    res.status(500).json({ message: 'Failed to update invoice' });
  }
});

// DELETE /api/invoices/:id → delete invoice
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid invoice ID' });
    }
    
    const result = await db.collection('invoices').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Invoice deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting invoice:', err);
    res.status(500).json({ message: 'Failed to delete invoice' });
  }
});

module.exports = router;
