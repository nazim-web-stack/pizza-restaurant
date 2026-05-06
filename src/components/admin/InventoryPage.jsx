import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    quantity: '',
    unit: '',
    supplier: '',
    minStock: ''
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

  // Fetch inventory
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/api/inventory`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingItem 
        ? `${API}/api/inventory/${editingItem._id}`
        : `${API}/api/inventory`;
      
      const method = editingItem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMessage(editingItem ? 'Stock item updated successfully!' : 'Stock item added successfully!');
        setShowModal(false);
        setEditingItem(null);
        setFormData({ itemName: '', quantity: '', unit: '', supplier: '', minStock: '' });
        fetchInventory(); // Refresh list
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save stock item. Please try again.');
      }
    } catch (err) {
      console.error('Error saving stock item:', err);
      setMessage('Failed to save stock item. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock item?')) return;
    
    try {
      const response = await fetch(`${API}/api/inventory/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setMessage('Stock item deleted successfully!');
        fetchInventory(); // Refresh list
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to delete stock item. Please try again.');
      }
    } catch (err) {
      console.error('Error deleting stock item:', err);
      setMessage('Failed to delete stock item. Please try again.');
    }
  };

  // Open edit modal
  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName || item.name || '',
      quantity: item.quantity || '',
      unit: item.unit || '',
      supplier: item.supplier || '',
      minStock: item.minStock || ''
    });
    setShowModal(true);
  };

  // Open add modal
  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ itemName: '', quantity: '', unit: '', supplier: '', minStock: '' });
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ itemName: '', quantity: '', unit: '', supplier: '', minStock: '' });
    setMessage('');
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center', color: '#fff'}}>Loading inventory...</div>;

  return (
    <div style={{padding: '24px', color: '#333', minHeight: '100vh', background: '#f8f9fa'}}>
      {/* Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
        <div>
          <h2 style={{margin: 0, color: '#1a1a2e'}}>Inventory</h2>
          <p style={{color: '#666', margin: '5px 0'}}>Total Items: {inventory.length}</p>
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
          + Add Stock
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

      {/* Inventory Table */}
      <div style={{background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <table style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead>
            <tr style={{background: '#f8f9fa'}}>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Item Name</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Quantity</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Unit</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Supplier</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Min Stock</th>
              <th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #dee2e6'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item._id} style={{borderBottom: '1px solid #eee'}}>
                <td style={{padding: '12px', fontWeight: '500'}}>{item.itemName || item.name || 'N/A'}</td>
                <td style={{padding: '12px', color: item.quantity <= (item.minStock || 10) ? '#e74c3c' : '#27ae60', fontWeight: 'bold'}}>
                  {item.quantity || 0}
                </td>
                <td style={{padding: '12px', color: '#666'}}>{item.unit || 'N/A'}</td>
                <td style={{padding: '12px'}}>{item.supplier || 'N/A'}</td>
                <td style={{padding: '12px', color: '#888'}}>{item.minStock || 'N/A'}</td>
                <td style={{padding: '12px'}}>
                  <button
                    onClick={() => handleEdit(item)}
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
                    onClick={() => handleDelete(item._id)}
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
        {inventory.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px', padding: '40px'}}>No inventory items found</p>}
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
              {editingItem ? 'Edit Stock Item' : 'Add Stock Item'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{marginBottom: '15px'}}>
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Item Name</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({...formData, itemName: e.target.value})}
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
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({...formData, quantity: e.target.value})}
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
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Unit</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({...formData, unit: e.target.value})}
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
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Supplier</label>
                <input
                  type="text"
                  value={formData.supplier}
                  onChange={(e) => setFormData({...formData, supplier: e.target.value})}
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
                <label style={{display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500'}}>Min Stock</label>
                <input
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({...formData, minStock: e.target.value})}
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
                  {editingItem ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}