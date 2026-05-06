import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: '',
    phone: '',
    email: '',
    address: '',
    productsSupplied: ''
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

  // Fetch suppliers
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/suppliers`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching suppliers:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingSupplier 
        ? `${API}/api/suppliers/${editingSupplier._id}`
        : `${API}/api/suppliers`;
      
      const method = editingSupplier ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingSupplier ? 'Supplier updated successfully!' : 'Supplier added successfully!');
        setShowModal(false);
        setEditingSupplier(null);
        setFormData({ supplierName: '', phone: '', email: '', address: '', productsSupplied: '' });
        fetchSuppliers(); // Refresh list
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save supplier. Please try again.');
      }
    } catch (err) {
      console.error('Error saving supplier:', err);
      setMessage('Failed to save supplier. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier?')) return;
    
    try {
      const response = await fetch(`${API}/api/suppliers/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setMessage('Supplier deleted successfully!');
        fetchSuppliers(); // Refresh list
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete supplier. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting supplier:', err);
      setMessage('Failed to delete supplier. Please try again.');
    }
  };

  // Open edit modal
  const handleEdit = (supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      supplierName: supplier.supplierName || supplier.name || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
      productsSupplied: (supplier.productsSupplied || []).join(', ')
    });
    setShowModal(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingSupplier(null);
    setFormData({ supplierName: '', phone: '', email: '', address: '', productsSupplied: '' });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSupplier(null);
    setFormData({ supplierName: '', phone: '', email: '', address: '', productsSupplied: '' });
    setMessage('');
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center', color: '#fff'}}>Loading suppliers...</div>;

  return (
    <div style={{padding: '24px', color: '#333', minHeight: '100vh', background: '#f8f9fa'}}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div>
          <h2 style={{margin: 0, color: '#1a1a2e'}}>Suppliers</h2>
          <p style={{color: '#666', margin: '5px 0'}}>Total Suppliers: {suppliers.length}</p>
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
          + Add Supplier
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

      {/* Suppliers Table */}
      <div style={{background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f8f9fa'}}>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Supplier Name</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Phone</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Email</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Address</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Products Supplied</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Status</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map(supplier => (
              <tr key={supplier._id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '12px', fontWeight: '500'}}>{supplier.supplierName || supplier.name || 'N/A'}</td>
                <td style={{padding: '12px'}}>{supplier.phone || 'N/A'}</td>
                <td style={{padding: '12px', color: '#3498db'}}>{supplier.email || 'N/A'}</td>
                <td style={{padding: '12px', color: '#666'}}>{supplier.address || 'N/A'}</td>
                <td style={{padding: '12px', color: '#666'}}>{(supplier.productsSupplied || []).join(', ') || 'N/A'}</td>
                <td style={{padding: '12px'}}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                    background: supplier.status === 'Active' ? '#d4edda' : '#fff3cd',
                    color: supplier.status === 'Active' ? '#155724' : '#856404'
                  }}>
                    {supplier.status || 'Active'}
                  </span>
                </td>
                <td style={{padding: '12px'}}>
                  <button
                    onClick={() => handleEdit(supplier)}
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
                    onClick={() => handleDelete(supplier._id)}
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
        {suppliers.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px', padding: '40px'}}>No suppliers found</p>}
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
              {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Supplier Name</label>
                <input
                  type="text"
                  value={formData.supplierName}
                  onChange={(e) => setFormData({...formData, supplierName: e.target.value})}
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
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom: '20px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Products Supplied</label>
                <textarea
                  value={formData.productsSupplied}
                  onChange={(e) => setFormData({...formData, productsSupplied: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ced4da',
                    borderRadius: '4px',
                    fontSize: '14px',
                    minHeight: '60px',
                    resize: 'vertical'
                  }}
                  placeholder="e.g., Pizza Dough, Cheese, Vegetables, Packaging"
                />
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
                  {editingSupplier ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}