import { useState, useEffect } from "react";

const API = 'http://localhost:5000';

const tierColor = {
  Gold:   { bg: "#fff8e1", color: "#f57f17" },
  Silver: { bg: "#f5f5f5", color: "#616161" },
  Bronze: { bg: "#fbe9e7", color: "#bf360c" },
};

export default function LoyaltyPage() {
  const [loyaltyData, setLoyaltyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get JWT token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch loyalty points from API
  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/api/loyalty`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setLoyaltyData(data || []);
    } catch (err) {
      console.error('Error fetching loyalty data:', err);
      setError('Failed to load loyalty data. Please try again.');
      setLoyaltyData([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const calculateStats = () => {
    const totalIssued = loyaltyData.reduce((sum, l) => sum + (l.earned || 0), 0);
    const totalRedeemed = loyaltyData.reduce((sum, l) => sum + (l.used || 0), 0);
    const activeMembers = loyaltyData.length;

    return {
      totalIssued,
      totalRedeemed,
      activeMembers
    };
  };

  const stats = calculateStats();

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
        <div style={{ color: '#666' }}>Loading loyalty data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: '#e74c3c', fontSize: '16px', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={fetchLoyaltyData}
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
          { label: "Points Issued (Total)", value: stats.totalIssued.toLocaleString(), color: "#3498db" },
          { label: "Points Redeemed",       value: stats.totalRedeemed.toLocaleString(), color: "#e74c3c" },
          { label: "Active Members",        value: stats.activeMembers,      color: "#27ae60" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Loyalty Points Ledger</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Customer","Points Earned","Points Used","Balance","Tier"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loyaltyData.map((l, i) => (
              <tr key={l._id || i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>{l.customer || l.customerName || 'N/A'}</td>
                <td style={{ padding: "9px 14px", color: "#27ae60", fontWeight: 600 }}>+{l.earned || 0}</td>
                <td style={{ padding: "9px 14px", color: "#e74c3c", fontWeight: 600 }}>-{l.used || 0}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: "#1a1a2e" }}>{l.balance || (l.earned - l.used) || 0}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: tierColor[l.tier]?.bg, color: tierColor[l.tier]?.color }}>{l.tier || 'Bronze'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}