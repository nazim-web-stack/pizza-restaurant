import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/suppliers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => { setSuppliers(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading suppliers...</div>;

  return (
    <div style={{padding: '24px'}}>
      <h2>Suppliers</h2>
      <p style={{color: '#666'}}>Total Suppliers: {suppliers.length}</p>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#f5f5f5'}}>
            <th style={{padding: '12px', textAlign: 'left'}}>Supplier Name</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Phone</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Email</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Products Supplied</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(supplier => (
            <tr key={supplier._id} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '12px', fontWeight: '500'}}>{supplier.supplierName || supplier.name || 'N/A'}</td>
              <td style={{padding: '12px'}}>{supplier.phone || 'N/A'}</td>
              <td style={{padding: '12px', color: '#3498db'}}>{supplier.email || 'N/A'}</td>
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
            </tr>
          ))}
        </tbody>
      </table>
      {suppliers.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>No suppliers found</p>}
    </div>
  );
}