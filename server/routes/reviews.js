const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Review Schema
const Review = mongoose.model('Review',
  new mongoose.Schema({}, { 
    strict: false
  }),
  'customerReviews'
);

// GET /api/reviews - all reviews
router.get('/', async (req, res) => {
  try {
    const { status, rating } = req.query;
    let filter = {};
    
    if (status) filter.status = status;
    if (rating) filter.rating = parseInt(rating);
    
    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews - add review
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, rating, title, comment, orderId, menuItem } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }
    
    const newReview = new Review({
      customerName,
      customerEmail,
      rating,
      title,
      comment,
      orderId,
      menuItem,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// GET /api/reviews/:id - single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).lean();
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ error: 'Failed to fetch review' });
  }
});

// PUT /api/reviews/:id - update review (for admin response)
router.put('/:id', async (req, res) => {
  try {
    const { status, response } = req.body;
    
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { 
        status, 
        response, 
        updatedAt: new Date() 
      },
      { new: true, strict: false }
    );
    
    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ error: 'Failed to update review' });
  }
});

module.exports = router;
