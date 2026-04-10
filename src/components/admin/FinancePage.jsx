const transactionsData = [
  { date: "29 Mar", type: "Revenue", desc: "Daily Sales",          amount: 24500, category: "Orders"    },
  { date: "28 Mar", type: "Expense", desc: "Dairy Land Invoice",   amount: 18000, category: "Inventory" },
  { date: "28 Mar", type: "Revenue", desc: "Daily Sales",          amount: 21200, category: "Orders"    },
  { date: "27 Mar", type: "Expense", desc: "Staff Salaries",       amount: 85000, category: "Payroll"   },
  { date: "26 Mar", type: "Revenue", desc: "Daily Sales",          amount: 19800, category: "Orders"    },
  { date: "25 Mar", type: "Expense", desc: "Shan Foods PO",        amount: 12000, category: "Inventory" },
];

export default function FinancePage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Revenue (Mar)",      value: "Rs 3.2L", color: "#27ae60" },
          { label: "Expenses (Mar)",     value: "Rs 1.8L", color: "#e74c3c" },
          { label: "Net Profit",         value: "Rs 1.4L", color: "#3498db" },
          { label: "Pending Invoices",   value: 5,         color: "#f39c12" },
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
            {transactionsData.map((t, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", color: "#888" }}>{t.date}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: t.type === "Revenue" ? "#e8f5e9" : "#fce4ec",
                    color:      t.type === "Revenue" ? "#2e7d32"  : "#c62828" }}>{t.type}</span>
                </td>
                <td style={{ padding: "9px 14px", fontWeight: 500, color: "#1a1a2e" }}>{t.desc}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{t.category}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: t.type === "Revenue" ? "#27ae60" : "#e74c3c" }}>
                  {t.type === "Revenue" ? "+" : "-"} Rs {t.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}