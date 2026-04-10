import { useState, useEffect } from "react";

const statusConfig = {
  Delivered:    { bg: "#e8f5e9", color: "#2e7d32" },
  Preparing:    { bg: "#fff8e1", color: "#f57f17" },
  "On the way": { bg: "#e3f2fd", color: "#1565c0" },
  Cancelled:    { bg: "#fce4ec", color: "#c62828" },
  Pending:      { bg: "#f3e5f5", color: "#6a1b9a" },
};

const allStatuses = ["All", "Pending", "Preparing", "On the way", "Delivered", "Cancelled"];

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { bg: "#eee", color: "#555" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: "11px", padding: "3px 9px", borderRadius: "20px", fontWeight: 500 }}>
      {status}
    </span>
  );
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Orders fetch error:', err);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  const deleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setOrders(orders.filter(order => order._id !== orderId));
        }
      } catch (err) {
        console.error('Delete order error:', err);
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "All" || order.status === statusFilter;
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#e74c3c" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", background: "#f8f9fa", minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#1a1a2e", marginBottom: "8px" }}>📦 Orders Management</h2>
        <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", marginBottom: "8px" }}>📊 Total Orders</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#3498db" }}>{orders.length}</div>
        </div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", marginBottom: "8px" }}>⏱️ Pending</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#f39c12" }}>
            {orders.filter(o => o.status === 'Pending').length}
          </div>
        </div>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "20px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e", marginBottom: "8px" }}>✅ Completed</div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "#27ae60" }}>
            {orders.filter(o => ['Delivered', 'On the way'].includes(o.status)).length}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", color: "#666", marginRight: "8px" }}>Filter by status:</span>
            {allStatuses.map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: "6px 12px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "20px",
                  fontSize: "11px",
                  cursor: "pointer",
                  background: statusFilter === status ? "#e74c3c" : "transparent",
                  color: statusFilter === status ? "#fff" : "#666",
                  marginRight: "4px"
                }}
              >
                {status}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px 12px",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              fontSize: "12px",
              width: "250px",
              outline: "none"
            }}
          />
          <button
            onClick={fetchOrders}
            style={{
              padding: "8px 16px",
              background: "#3498db",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "12px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid #f5f5f5" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#1a1a2e", margin: 0 }}>📋 Order List</h3>
        </div>
        
        {filteredOrders.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#999" }}>
            No orders found matching the current filters
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "800px" }}>
              <thead>
                <tr style={{ background: "#fafafa", borderBottom: "2px solid #f0f0f0" }}>
                  <th style={{ padding: "12px", textAlign: "left", color: "#666", fontWeight: 600 }}>Order ID</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#666", fontWeight: 600 }}>Customer</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#666", fontWeight: 600 }}>Items</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#666", fontWeight: 600 }}>Total</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#666", fontWeight: 600 }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", color: "#666", fontWeight: 600 }}>Time</th>
                  <th style={{ padding: "12px", textAlign: "center", color: "#666", fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr key={order._id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "12px", color: "#3498db", fontWeight: 600 }}>
                      #{order._id?.slice(-6) || order.id}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ fontWeight: 600, color: "#1a1a2e", marginBottom: "4px" }}>
                        {order.customerName || 'Unknown'}
                      </div>
                      <div style={{ fontSize: "11px", color: "#666" }}>
                        {order.customerPhone || 'No phone'}
                      </div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <div style={{ maxWidth: "200px" }}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={{ marginBottom: "2px" }}>
                            <span style={{ fontWeight: 600 }}>{item.name}</span>
                            <span style={{ color: "#666" }}> x{item.quantity}</span>
                          </div>
                        )).join(', ') || 'No items'}
                      </div>
                    </td>
                    <td style={{ padding: "12px", fontWeight: 700, color: "#1a1a2e" }}>
                      Rs {(order.totalAmount || order.total || 0).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <StatusBadge status={order.status} />
                    </td>
                    <td style={{ padding: "12px", fontSize: "11px", color: "#666" }}>
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        onClick={() => updateOrderStatus(order._id, 'Preparing')}
                        style={{
                          padding: "4px 8px",
                          background: "#f39c12",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "10px",
                          cursor: "pointer",
                          marginRight: "4px"
                        }}
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteOrder(order._id)}
                        style={{
                          padding: "4px 8px",
                          background: "#e74c3c",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "10px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
