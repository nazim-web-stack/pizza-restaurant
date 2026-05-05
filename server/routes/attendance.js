const express = require('express');
const mongoose = require('mongoose');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// GET /api/attendance → 'attendance' collection
router.get('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const attendance = await db.collection('attendance').find({}).sort({ date: -1 }).toArray();
    res.json(attendance);
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// POST /api/attendance → mark attendance
router.post('/', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const attendanceRecord = {
      ...req.body,
      date: req.body.date || new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('attendance').insertOne(attendanceRecord);
    res.status(201).json({ 
      success: true, 
      attendanceId: result.insertedId,
      message: 'Attendance marked successfully' 
    });
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});

// PUT /api/attendance/:id → update attendance record
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const result = await db.collection('attendance').updateOne(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Attendance updated successfully' 
    });
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'Failed to update attendance' });
  }
});

// DELETE /api/attendance/:id → delete attendance record
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid attendance ID' });
    }
    
    const result = await db.collection('attendance').deleteOne(
      { _id: new mongoose.Types.ObjectId(id) }
    );
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Attendance record deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting attendance record:', err);
    res.status(500).json({ message: 'Failed to delete attendance record' });
  }
});

module.exports = router;
