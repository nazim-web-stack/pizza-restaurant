import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function InventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/inventory`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => { setInventory(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading inventory...</div>;

  return (
    <div style={{padding: '24px'}}>
      <h2>Inventory</h2>
      <p style={{color: '#666'}}>Total Items: {inventory.length}</p>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#f5f5f5'}}>
            <th style={{padding: '12px', textAlign: 'left'}}>Item Name</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Quantity</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Unit</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Supplier</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Min Stock</th>
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
            </tr>
          ))}
        </tbody>
      </table>
      {inventory.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>No inventory items found</p>}
    </div>
  );
}