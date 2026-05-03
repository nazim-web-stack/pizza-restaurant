import { useState, useEffect } from "react";

const API = 'http://localhost:5000';

export default function ReportsPage() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null);

  // Get JWT token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch stats from API
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/api/admin/stats`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data || {});
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load stats. Please try again.');
      setStats({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(0,0,0,0.1)',
          borderTop: '4px solid #e74c3c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px'
        }}></div>
        <div style={{ color: '#666' }}>Loading reports...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: '#e74c3c', fontSize: '16px', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={fetchStats}
          style={{
            padding: '10px 20px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Retry
        </button>
        <button 
          onClick={() => setError(null)}
          style={{
            padding: '10px 20px',
            background: '#666',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Orders", value: stats.totalOrders || 0, color: "#f39c12" },
          { label: "Total Menu Items", value: stats.totalMenuItems || 0, color: "#e74c3c" },
          { label: "Total Revenue", value: `Rs ${((stats.totalRevenue || 0) / 1000).toFixed(1)}K`, color: "#3498db" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "14px" }}>
        {/* Revenue Overview */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "16px" }}>
            Revenue Overview
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>Total Revenue</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#27ae60" }}>
                Rs {((stats.totalRevenue || 0) / 1000).toFixed(1)}K
              </div>
            </div>
            <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>Avg Order Value</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#3498db" }}>
                Rs {stats.totalOrders ? Math.round((stats.totalRevenue || 0) / stats.totalOrders) : 0}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Overview */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "14px" }}>Customer Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
            <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>Total Customers</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#e74c3c" }}>
                {stats.totalCustomers || 0}
              </div>
            </div>
            <div style={{ padding: "12px", background: "#f8f9fa", borderRadius: "8px" }}>
              <div style={{ fontSize: "11px", color: "#666", marginBottom: "4px" }}>Orders per Customer</div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#f39c12" }}>
                {stats.totalCustomers ? Math.round((stats.totalOrders || 0) / stats.totalCustomers) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}