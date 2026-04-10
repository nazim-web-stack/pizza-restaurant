const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({}, { 
  strict: false,
  collection: 'menuCategories'
});

module.exports = mongoose.model('MenuCategory', categorySchema);
