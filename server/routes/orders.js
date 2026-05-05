const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');

const router = express.Router();

// GET /api/orders - get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to load orders' });
  }
});

// PUT /api/orders/:id - update order status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error('Error updating order status:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { customerId, items, customerName, phone, address, specialNote, totalAmount } = req.body;

    let cid = null;
    if (customerId && customerId !== 'admin' && mongoose.Types.ObjectId.isValid(customerId)) {
      cid = new mongoose.Types.ObjectId(customerId);
    }

    const order = await Order.create({
      customerId: cid,
      items: Array.isArray(items) ? items : [],
      customerName: customerName || '',
      phone: phone || '',
      address: address || '',
      specialNote: specialNote || '',
      totalAmount: typeof totalAmount === 'number' ? totalAmount : Number(totalAmount) || 0,
      status: 'Pending',
      createdAt: new Date()
    });

    res.status(201).json({ 
      success: true, 
      orderId: order._id,
      message: 'Order created successfully'
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create order' 
    });
  }
});

router.get('/customer/:identifier', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const identifier = decodeURIComponent(req.params.identifier);
    
    const orders = await db.collection('orders').find({
      $or: [
        { customerName: identifier },
        { customerId: identifier }
      ]
    }).sort({ createdAt: -1 }).toArray();
    
    res.json(orders);
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
