const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  position: { type: String, required: true },
  salary: { type: Number },
  hireDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { strict: false });

const Employee = mongoose.model('Employee', EmployeeSchema);

// GET /api/employees - all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find({}).lean();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// POST /api/employees - add employee
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, position, salary, address } = req.body;
    
    const newEmployee = new Employee({
      name,
      email,
      phone,
      position,
      salary,
      address,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const savedEmployee = await newEmployee.save();
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create employee' });
  }
});

// PUT /api/employees/:id - update employee
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, position, salary, status, address } = req.body;
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { 
        name, 
        email, 
        phone, 
        position, 
        salary, 
        status, 
        address, 
        updatedAt: new Date() 
      },
      { new: true, strict: false }
    );
    
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// DELETE /api/employees/:id - delete employee
router.delete('/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

module.exports = router;
