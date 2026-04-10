import { useState } from "react";

const monthlyData = [
  { month: "Oct", revenue: 180000, height: 47 },
  { month: "Nov", revenue: 210000, height: 55 },
  { month: "Dec", revenue: 260000, height: 68 },
  { month: "Jan", revenue: 195000, height: 51 },
  { month: "Feb", revenue: 280000, height: 73 },
  { month: "Mar", revenue: 320000, height: 84 },
];

export default function ReportsPage() {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Best Day",         value: "Saturday",  color: "#f39c12" },
          { label: "Best Selling Item",value: "Margherita",color: "#e74c3c" },
          { label: "Avg Order Value",  value: "Rs 850",    color: "#3498db" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "14px" }}>
        {/* Bar chart */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "16px" }}>
            Monthly Revenue (last 6 months)
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px" }}>
            {monthlyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}
                onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                {hovered === i && (
                  <div style={{ fontSize: "9px", color: "#e74c3c", fontWeight: 700 }}>
                    Rs {(d.revenue / 1000).toFixed(0)}K
                  </div>
                )}
                <div style={{ width: "100%", height: `${d.height}px`, borderRadius: "4px 4px 0 0",
                  background: hovered === i ? "#e74c3c" : "#f5b7b1", transition: "background 0.15s", cursor: "pointer" }} />
                <span style={{ fontSize: "9px", color: "#aaa" }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "16px", border: "1px solid #f0f0f0" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "#1a1a2e", marginBottom: "14px" }}>Sales by Category</div>
          {[
            { name: "Classic Pizzas",   pct: 42 },
            { name: "Specialty Pizzas", pct: 28 },
            { name: "Sides & Extras",   pct: 18 },
            { name: "Beverages",        pct: 12 },
          ].map((c, i) => (
            <div key={i} style={{ marginBottom: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontSize: "12px", color: "#555" }}>{c.name}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#1a1a2e" }}>{c.pct}%</span>
              </div>
              <div style={{ background: "#f5f5f5", borderRadius: "4px", height: "5px" }}>
                <div style={{ background: "#e74c3c", width: `${c.pct}%`, height: "100%", borderRadius: "4px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}