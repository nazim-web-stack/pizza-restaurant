const express = require('express');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const MenuItem = require('../models/MenuItem');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Test route without authentication for debugging
router.get('/stats-test', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();
    
    // Calculate total revenue (sum all orders regardless of payment status)
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalAmount || order.total || 0);
    }, 0);

    res.json({
      totalOrders,
      totalCustomers,
      totalMenuItems,
      totalRevenue,
      message: 'Test route - no auth required'
    });
  } catch (err) {
    console.error('Admin stats test error:', err);
    res.status(500).json({ message: 'Failed to fetch test stats', error: err.message });
  }
});

// Get admin dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalMenuItems = await MenuItem.countDocuments();
    
    // Calculate total revenue (sum all orders regardless of payment status)
    const orders = await Order.find({}, 'totalAmount');
    const totalRevenue = orders.reduce((sum, o) => 
      sum + (o.totalAmount || 0), 0);
    
    res.json({ 
      totalOrders, 
      totalCustomers, 
      totalMenuItems, 
      totalRevenue 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all customers
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const customers = await Customer.find()
      .select('name email phone role createdAt status loyaltyPoints totalOrders totalSpent')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch customers' });
  }
});

// Get customer by ID
router.get('/customers/:id', adminAuth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch customer' });
  }
});

// Update customer status
router.put('/customers/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update customer' });
  }
});

// Get recent orders
router.get('/recent-orders', adminAuth, async (req, res) => {
  try {
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    
    res.json(recentOrders);
  } catch (err) {
    console.error('Recent orders error:', err);
    res.status(500).json({ message: 'Failed to fetch recent orders' });
  }
});

// Get sales by day of week
router.get('/sales-by-day', adminAuth, async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const orders = await Order.find({
      createdAt: { $gte: oneWeekAgo }
    }).lean();
    
    // Group by day of week
    const salesByDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
      day,
      total: 0
    }));
    
    orders.forEach(order => {
      const dayOfWeek = new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short' });
      const dayIndex = salesByDay.findIndex(d => d.day === dayOfWeek);
      if (dayIndex !== -1) {
        salesByDay[dayIndex].total += order.totalAmount || order.total || 0;
      }
    });
    
    res.json(salesByDay);
  } catch (err) {
    console.error('Sales by day error:', err);
    res.status(500).json({ message: 'Failed to fetch sales data' });
  }
});

// Get recent orders (without auth for simplicity)
router.get('/recent-orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete customer
router.delete('/customers/:id', adminAuth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json({ message: 'Customer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete customer' });
  }
});

module.exports = router;
