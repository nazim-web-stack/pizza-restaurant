const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {},
  { collection: 'orders', strict: false, timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
