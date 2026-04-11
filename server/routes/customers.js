const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// GET /api/customers - all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({}).lean();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /api/customers/:id - single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).lean();
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// PUT /api/customers/:id - update customer
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;
    
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, address, updatedAt: new Date() },
      { new: true, strict: false }
    );
    
    if (!updatedCustomer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

module.exports = router;
