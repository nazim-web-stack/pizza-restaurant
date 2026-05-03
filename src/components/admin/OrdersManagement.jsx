import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/orders`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`${API}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading orders...</div>;

  return (
    <div style={{padding: '24px'}}>
      <h2>Orders Management</h2>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#f5f5f5'}}>
            <th style={{padding: '12px', textAlign: 'left'}}>Order ID</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Customer</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Items</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Total</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Status</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '12px', color: '#e74c3c', fontWeight: 'bold'}}>
                #{String(order._id).slice(-6)}
              </td>
              <td style={{padding: '12px'}}>{order.customerName || 'N/A'}</td>
              <td style={{padding: '12px'}}>
                {(order.items || []).map(i => i.name).join(', ') || 'N/A'}
              </td>
              <td style={{padding: '12px'}}>Rs {order.totalAmount || 0}</td>
              <td style={{padding: '12px'}}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                  background: order.status === 'Delivered' ? '#d4edda' : 
                              order.status === 'Pending' ? '#fff3cd' : '#cce5ff',
                  color: order.status === 'Delivered' ? '#155724' : 
                         order.status === 'Pending' ? '#856404' : '#004085'
                }}>
                  {order.status || 'Pending'}
                </span>
              </td>
              <td style={{padding: '12px'}}>
                <select 
                  value={order.status || 'Pending'}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  style={{padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd'}}
                >
                  <option>Pending</option>
                  <option>Preparing</option>
                  <option>On the way</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>No orders found</p>}
    </div>
  );
}