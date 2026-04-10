import { useState } from "react";

const customersData = [
  { id: 1, name: "Bilal Ahmed", phone: "0300-1234567", email: "bilal@gmail.com", city: "Islamabad", orders: 24, spent: 18400, points: 184, joined: "Jan 2024", tier: "Gold" },
  { id: 2, name: "Sara Malik", phone: "0311-9876543", email: "sara@gmail.com", city: "Rawalpindi", orders: 11, spent: 7150, points: 71, joined: "Mar 2024", tier: "Silver" },
  { id: 3, name: "Ali Raza", phone: "0321-5554433", email: "ali@gmail.com", city: "Islamabad", orders: 8, spent: 5200, points: 52, joined: "Apr 2024", tier: "Silver" },
  { id: 4, name: "Hina Khan", phone: "0333-2221100", email: "hina@gmail.com", city: "Lahore", orders: 19, spent: 14300, points: 143, joined: "Feb 2024", tier: "Gold" },
  { id: 5, name: "Usman Tariq", phone: "0345-6789012", email: "usman@gmail.com", city: "Islamabad", orders: 5, spent: 3100, points: 31, joined: "May 2024", tier: "Bronze" },
];

const tierColor = {
  Gold:   { bg: "#fff8e1", color: "#f57f17" },
  Silver: { bg: "#f5f5f5", color: "#616161" },
  Bronze: { bg: "#fbe9e7", color: "#bf360c" },
};

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const filtered = customersData.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Customers", value: customersData.length, color: "#3498db" },
          { label: "New This Month",  value: 87,                   color: "#27ae60" },
          { label: "Active (30 days)",value: 432,                  color: "#e74c3c" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Customer List</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customer..."
            style={{ padding: "6px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "12px", outline: "none", width: "200px" }} />
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Name","Phone","Email","City","Orders","Total Spent","Loyalty Pts","Tier","Joined"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>{c.name}</td>
                <td style={{ padding: "9px 14px", color: "#666" }}>{c.phone}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{c.email}</td>
                <td style={{ padding: "9px 14px", color: "#666" }}>{c.city}</td>
                <td style={{ padding: "9px 14px", fontWeight: 600 }}>{c.orders}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: "#1a1a2e" }}>Rs {c.spent.toLocaleString()}</td>
                <td style={{ padding: "9px 14px", color: "#e74c3c", fontWeight: 600 }}>{c.points}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: tierColor[c.tier]?.bg, color: tierColor[c.tier]?.color }}>{c.tier}</span>
                </td>
                <td style={{ padding: "9px 14px", color: "#aaa" }}>{c.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}