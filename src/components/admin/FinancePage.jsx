import { useState, useEffect } from "react";

const API = 'http://localhost:5000';

export default function FinancePage() {
  const [transactions, setTransactions] = useState([]);
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

  // Fetch transactions from API
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/api/transactions`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTransactions(data || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const calculateStats = () => {
    const revenue = transactions.filter(t => t.type === 'Revenue').reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = transactions.filter(t => t.type === 'Expense').reduce((sum, t) => sum + (t.amount || 0), 0);
    const netProfit = revenue - expenses;
    const pendingInvoices = transactions.filter(t => t.status === 'Pending').length;

    return {
      revenue: `Rs ${(revenue / 1000).toFixed(1)}L`,
      expenses: `Rs ${(expenses / 1000).toFixed(1)}L`,
      netProfit: `Rs ${(netProfit / 1000).toFixed(1)}L`,
      pendingInvoices
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
        <div style={{ color: '#666' }}>Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: '#e74c3c', fontSize: '16px', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={fetchTransactions}
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Revenue (Mar)",      value: stats.revenue, color: "#27ae60" },
          { label: "Expenses (Mar)",     value: stats.expenses, color: "#e74c3c" },
          { label: "Net Profit",         value: stats.netProfit, color: "#3498db" },
          { label: "Pending Invoices",   value: stats.pendingInvoices,         color: "#f39c12" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Recent Transactions</span>
          <button style={{ padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "12px", cursor: "pointer", background: "transparent" }}>
            Export CSV
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Date","Type","Description","Category","Amount"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={t._id || i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", color: "#888" }}>{new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: t.type === "Revenue" ? "#e8f5e9" : "#fce4ec",
                    color:      t.type === "Revenue" ? "#2e7d32"  : "#c62828" }}>{t.type}</span>
                </td>
                <td style={{ padding: "9px 14px", fontWeight: 500, color: "#1a1a2e" }}>{t.description || t.desc}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{t.category || 'General'}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: t.type === "Revenue" ? "#27ae60" : "#e74c3c" }}>
                  {t.type === "Revenue" ? "+" : "-"} Rs {(t.amount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}