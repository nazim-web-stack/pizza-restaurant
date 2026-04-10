import { useState, useEffect } from "react";

const statusConfig = {
  Delivered:   { bg: "#e8f5e9", color: "#2e7d32" },
  Preparing:   { bg: "#fff8e1", color: "#f57f17" },
  "On the way":{ bg: "#e3f2fd", color: "#1565c0" },
  Cancelled:   { bg: "#fce4ec", color: "#c62828" },
  Pending:     { bg: "#f3e5f5", color: "#6a1b9a" },
};

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || { bg: "#eee", color: "#555" };
  return (
    <span style={{ background: cfg.bg, color: cfg.color, fontSize: "11px", padding: "3px 8px", borderRadius: "20px", fontWeight: 500, whiteSpace: "nowrap" }}>
      {status}
    </span>
  );
}

const StatCard = ({ title, value, change, color, icon }) => (
  <div style={{ 
    background: "#fff", 
    borderRadius: "12px", 
    padding: "20px", 
    border: "1px solid #f0f0f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
      <span style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</span>
      <span style={{ fontSize: "20px", color: color }}>{icon}</span>
    </div>
    <div style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a2e", marginBottom: "4px" }}>
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    {change && (
      <div style={{ fontSize: "11px", color: change >= 0 ? "#27ae60" : "#e74c3c" }}>
        {change >= 0 ? '+' : ''}{change}% from last month
      </div>
    )}
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalCustomers: 0,
    totalMenuItems: 0,
    totalRevenue: 0,
    recentOrders: 0,
    topItems: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesByDay, setSalesByDay] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/recent-orders', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => setRecentOrders(Array.isArray(data) ? data : []))
    .catch(() => setRecentOrders([]));
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log('Fetching dashboard stats...');
      
      // Fetch dashboard stats
      const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Stats response status:', statsResponse.status);
      
      if (!statsResponse.ok) {
        const errorText = await statsResponse.text();
        console.error('Stats response error:', errorText);
        throw new Error(`Failed to fetch stats: ${statsResponse.status} ${errorText}`);
      }
      
      const statsData = await statsResponse.json();
      console.log('Stats data received:', statsData);
      setStats(statsData);

      // Fetch sales by day
      const salesResponse = await fetch('http://localhost:5000/api/admin/sales-by-day', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (salesResponse.ok) {
        const salesData = await salesResponse.json();
        setSalesByDay(salesData || []);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#666" }}>
        Loading dashboard data...
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
    <div>
      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { title: "Total Orders", value: stats.totalOrders, change: 12, color: "#e74c3c", icon: "📦" },
          { title: "Total Customers", value: stats.totalCustomers, change: 15, color: "#3498db", icon: "👥" },
          { title: "Total Menu Items", value: stats.totalMenuItems, change: 5, color: "#2ecc71", icon: "🍕" },
          { title: "Total Revenue", value: `Rs ${stats.totalRevenue.toLocaleString()}`, change: 8, color: "#f39c12", icon: "💰" },
        ].map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>

      {/* ── Row 2: Chart + Recent Orders ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "14px", marginBottom: "20px" }}>

        {/* Bar Chart */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e" }}>Sales This Week</span>
            <span style={{ fontSize: "11px", color: "#888" }}>Rs {stats.recentOrders * 1000 || 0} total</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "100px" }}>
            {salesByDay.map((day, i) => {
              const maxSales = Math.max(...salesByDay.map(d => d.total), 1);
              const barHeight = maxSales > 0 ? (day.total / maxSales) * 80 : 0;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div
                    style={{
                      width: "100%",
                      height: `${barHeight}px`,
                      background: "#f5b7b1",
                      borderRadius: "4px 4px 0 0",
                      transition: "background 0.15s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#e74c3c"}
                    onMouseLeave={(e) => e.target.style.background = "#f5b7b1"}
                  />
                  <span style={{ fontSize: "9px", color: "#aaa" }}>{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e" }}>Recent Orders</span>
            <span style={{ fontSize: "11px", color: "#e74c3c", cursor: "pointer", fontWeight: 500 }}>View all →</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #f5f5f5" }}>
                {["Order", "Customer", "Items", "Total", "Status", "Time"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "6px 8px", fontSize: "10px", color: "#aaa", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders || []).map((order, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "7px 8px", color: "#e74c3c", fontWeight: 600 }}>{order.id}</td>
                  <td style={{ padding: "7px 8px", color: "#333" }}>{order.customer}</td>
                  <td style={{ padding: "7px 8px", color: "#888", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(order.items || []).map(i => i.name).join(', ')}</td>
                  <td style={{ padding: "7px 8px", fontWeight: 600, color: "#1a1a2e" }}>{order.total}</td>
                  <td style={{ padding: "7px 8px" }}><StatusBadge status={order.status} /></td>
                  <td style={{ padding: "7px 8px", color: "#aaa" }}>{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Row 3: Top Items + Low Stock ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

        {/* Top Items */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #f5f5f5" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a2e" }}>🔥 Top Selling Items</span>
          </div>
          <div style={{ padding: "16px" }}>
            {(stats.topItems || []).length === 0 ? (
              <div style={{ textAlign: "center", color: "#999", fontSize: "12px" }}>
                No sales data available
              </div>
            ) : (
              (stats.topItems || []).map((item, i) => (
                <div key={i} style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center",
                  marginBottom: "12px",
                  padding: "8px 0",
                  borderBottom: i < (stats.topItems || []).length - 1 ? "1px solid #fafafa" : "none"
                }}>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "#1a1a2e" }}>{item._id}</div>
                    <div style={{ fontSize: "10px", color: "#999" }}>{item.count} orders</div>
                  </div>
                  <div style={{ 
                    fontSize: "11px", 
                    color: "#27ae60", 
                    fontWeight: 500,
                    background: "#e8f5e9",
                    padding: "2px 6px",
                    borderRadius: "10px"
                  }}>
                    #{i + 1}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}