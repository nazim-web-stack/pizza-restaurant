import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(`${API}/api/customers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => { setCustomers(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  const filtered = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading customers...</div>;

  return (
    <div style={{padding: '24px'}}>
      <h2>Customers</h2>
      <div style={{marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <span style={{color: '#666'}}>Total: {customers.length} customers</span>
        <input 
          placeholder="Search customer..." 
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', width: '250px'}}
        />
      </div>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#f5f5f5'}}>
            <th style={{padding: '12px', textAlign: 'left'}}>Name</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Email</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Phone</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Role</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Joined</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(customer => (
            <tr key={customer._id} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '12px', fontWeight: '500'}}>{customer.name || 'N/A'}</td>
              <td style={{padding: '12px', color: '#666'}}>{customer.email || 'N/A'}</td>
              <td style={{padding: '12px'}}>{customer.phone || 'N/A'}</td>
              <td style={{padding: '12px'}}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                  background: customer.role === 'admin' ? '#fff3cd' : '#d4edda',
                  color: customer.role === 'admin' ? '#856404' : '#155724'
                }}>
                  {customer.role || 'user'}
                </span>
              </td>
              <td style={{padding: '12px', color: '#888'}}>
                {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('en-US', {month: 'short', year: 'numeric'}) : 'N/A'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>No customers found</p>}
    </div>
  );
}