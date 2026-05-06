import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: '',
    salary: '',
    status: 'Active'
  });
  const [message, setMessage] = useState('');

  // Get JWT token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch employees
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/employees`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingEmployee 
        ? `${API}/api/employees/${editingEmployee._id}`
        : `${API}/api/employees`;
      
      const method = editingEmployee ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingEmployee ? 'Employee updated successfully!' : 'Employee added successfully!');
        setShowModal(false);
        setEditingEmployee(null);
        setFormData({ name: '', position: '', phone: '', salary: '', status: 'Active' });
        fetchEmployees(); // Refresh list
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save employee. Please try again.');
      }
    } catch (err) {
      console.error('Error saving employee:', err);
      setMessage('Failed to save employee. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      const response = await fetch(`${API}/api/employees/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setMessage('Employee deleted successfully!');
        fetchEmployees(); // Refresh list
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete employee. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting employee:', err);
      setMessage('Failed to delete employee. Please try again.');
    }
  };

  // Open edit modal
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      name: employee.name || '',
      position: employee.position || employee.role || '',
      phone: employee.phone || '',
      salary: employee.salary || '',
      status: employee.status || 'Active'
    });
    setShowModal(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingEmployee(null);
    setFormData({ name: '', position: '', phone: '', salary: '', status: 'Active' });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({ name: '', position: '', phone: '', salary: '', status: 'Active' });
    setMessage('');
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center', color: '#fff'}}>Loading employees...</div>;

  return (
    <div style={{padding: '24px', color: '#333', minHeight: '100vh', background: '#f8f9fa'}}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div>
          <h2 style={{margin: 0, color: '#1a1a2e'}}>Employees</h2>
          <p style={{color: '#666', margin: '5px 0'}}>Total Staff: {employees.length}</p>
        </div>
        <button
          onClick={handleAdd}
          style={{
            background: '#28a745',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          + Add Employee
        </button>
      </div>

      {/* Success/Error Message */}
      {message && (
        <div style={{
          padding: '12px',
          marginBottom: '20px',
          borderRadius: '6px',
          background: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      {/* Employees Table */}
      <div style={{background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f8f9fa'}}>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Name</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Position/Role</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Phone</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Salary</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '12px', fontWeight: '500'}}>{emp.name || 'N/A'}</td>
                <td style={{padding: '12px', color: '#666'}}>{emp.position || emp.role || 'N/A'}</td>
                <td style={{padding: '12px'}}>{emp.phone || 'N/A'}</td>
                <td style={{padding: '12px'}}>Rs {emp.salary || 'N/A'}</td>
                <td style={{padding: '12px'}}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                    background: emp.status === 'Active' ? '#d4edda' : '#fff3cd',
                    color: emp.status === 'Active' ? '#155724' : '#856404'
                  }}>
                    {emp.status || 'Active'}
                  </span>
                </td>
                <td style={{padding: '12px'}}>
                  <button
                    onClick={() => handleEdit(emp)}
                    style={{
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '8px',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(emp._id)}
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px', padding: '40px'}}>No employees found</p>}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}>
            <h3 style={{margin: '0 0 20px 0', color: '#1a1a2e'}}>
              {editingEmployee ? 'Edit Employee' : 'Add Employee'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Position/Role</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Salary</label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData({...formData, salary: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>

              <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  style={{
                    background: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#28a745',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {editingEmployee ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}