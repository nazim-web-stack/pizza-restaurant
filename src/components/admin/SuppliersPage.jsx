const suppliersData = [
  { name: "Shan Foods Pvt", category: "Spices & Sauces", contact: "0300-1111111", email: "shan@foods.com",    lastOrder: "25 Mar", amount: 12000, status: "Active"  },
  { name: "Dairy Land",     category: "Dairy",           contact: "0311-2222222", email: "dairy@land.com",   lastOrder: "28 Mar", amount: 18000, status: "Pending" },
  { name: "Al-Bakery Co",   category: "Bakery",          contact: "0321-3333333", email: "albakery@co.com",  lastOrder: "20 Mar", amount:  9500, status: "Active"  },
  { name: "Al-Meat Co",     category: "Meat",            contact: "0333-4444444", email: "almeat@co.com",    lastOrder: "22 Mar", amount: 25000, status: "Active"  },
  { name: "Fresh Farms",    category: "Vegetables",      contact: "0345-5555555", email: "fresh@farms.com",  lastOrder: "29 Mar", amount:  6500, status: "Active"  },
];

export default function SuppliersPage() {
  const totalSpend = suppliersData.reduce((s, i) => s + i.amount, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Suppliers",    value: suppliersData.length,                                    color: "#3498db" },
          { label: "Pending Orders",     value: suppliersData.filter(s => s.status === "Pending").length, color: "#f39c12" },
          { label: "This Month Spend",   value: `Rs ${totalSpend.toLocaleString()}`,                      color: "#e74c3c" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: i === 2 ? "16px" : "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Suppliers & Purchase Orders</span>
          <button style={{ padding: "6px 12px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
            + New PO
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Supplier","Category","Contact","Email","Last Order","Amount","Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {suppliersData.map((s, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>{s.name}</td>
                <td style={{ padding: "9px 14px", color: "#666" }}>{s.category}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{s.contact}</td>
                <td style={{ padding: "9px 14px", color: "#3498db" }}>{s.email}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{s.lastOrder}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: "#1a1a2e" }}>Rs {s.amount.toLocaleString()}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: s.status === "Active" ? "#e8f5e9" : "#fff8e1",
                    color:      s.status === "Active" ? "#2e7d32"  : "#f57f17" }}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}