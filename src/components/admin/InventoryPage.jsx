const inventoryData = [
  { item: "Mozzarella Cheese", category: "Dairy",      stock: 2, unit: "kg", minLevel: 5, supplier: "Dairy Land",  level: "critical" },
  { item: "Pepperoni",         category: "Meat",       stock: 1, unit: "kg", minLevel: 3, supplier: "Al-Meat Co",  level: "critical" },
  { item: "Pizza Dough",       category: "Bakery",     stock: 5, unit: "kg", minLevel: 8, supplier: "Al-Bakery Co",level: "low"      },
  { item: "Tomato Sauce",      category: "Sauces",     stock: 3, unit: "L",  minLevel: 5, supplier: "Shan Foods",  level: "low"      },
  { item: "Olive Oil",         category: "Oils",       stock: 8, unit: "L",  minLevel: 3, supplier: "Shan Foods",  level: "ok"       },
  { item: "Bell Peppers",      category: "Vegetables", stock: 4, unit: "kg", minLevel: 2, supplier: "Fresh Farms", level: "ok"       },
  { item: "Chicken Breast",    category: "Meat",       stock: 6, unit: "kg", minLevel: 5, supplier: "Al-Meat Co",  level: "ok"       },
];

const levelConfig = {
  critical: { bg: "#fce4ec", color: "#c62828", label: "Critical" },
  low:      { bg: "#fff8e1", color: "#f57f17", label: "Low"      },
  ok:       { bg: "#e8f5e9", color: "#2e7d32", label: "OK"       },
};

export default function InventoryPage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Items",    value: inventoryData.length,                              color: "#3498db" },
          { label: "Low / Critical", value: inventoryData.filter(i => i.level !== "ok").length, color: "#e74c3c" },
          { label: "OK Stock",       value: inventoryData.filter(i => i.level === "ok").length,  color: "#27ae60" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Inventory</span>
          <button style={{ padding: "6px 12px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
            + Add Stock
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Item","Category","In Stock","Min Level","Supplier","Status"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inventoryData.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa", background: item.level === "critical" ? "#fffbfb" : "transparent" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = item.level === "critical" ? "#fffbfb" : "transparent"}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>{item.item}</td>
                <td style={{ padding: "9px 14px", color: "#666" }}>{item.category}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: item.level !== "ok" ? "#e74c3c" : "#1a1a2e" }}>{item.stock} {item.unit}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{item.minLevel} {item.unit}</td>
                <td style={{ padding: "9px 14px", color: "#555" }}>{item.supplier}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: levelConfig[item.level].bg, color: levelConfig[item.level].color }}>
                    {levelConfig[item.level].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}