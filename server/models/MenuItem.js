const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({}, { 
  strict: false,
  collection: 'menuItems'
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
