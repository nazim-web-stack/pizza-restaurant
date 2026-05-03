require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customers');
const employeeRoutes = require('./routes/employees');
const inventoryRoutes = require('./routes/inventory');
const reviewRoutes = require('./routes/reviews');
const supplierRoutes = require('./routes/suppliers');
const financeRoutes = require('./routes/finance');
const loyaltyRoutes = require('./routes/loyalty');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/pak_fried_food';

const CORS_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(
  cors({
    origin: CORS_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api', financeRoutes);
app.use('/api', loyaltyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, name: 'Pizza Delicious API' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected:', MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Pizza Delicious server on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
