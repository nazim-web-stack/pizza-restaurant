const express = require('express');
const MenuItem = require('../models/MenuItem');
const MenuCategory = require('../models/MenuCategory');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load menu' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuCategory.find().lean();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load categories' });
  }
});

// Admin routes (protected)
router.post('/', adminAuth, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl } = req.body;
    
    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: 'Name, price, category, and description are required' });
    }

    const menuItem = await MenuItem.create({
      name,
      price: Number(price),
      category,
      description,
      imageUrl: imageUrl || '',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create menu item' });
  }
});

router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { name, price, category, description, imageUrl, isAvailable } = req.body;
    const { id } = req.params;

    const updateData = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = Number(price);
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: false }
    );

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(menuItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update menu item' });
  }
});

router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete menu item' });
  }
});

module.exports = router;
