import { useState } from "react";

const ordersData = [
  { id: "#1047", customer: "Bilal Ahmed", phone: "0300-1234567", items: "Margherita x2, BBQ Chicken x1", total: 1850, status: "Preparing", time: "12:30 PM", address: "F-7/3 Islamabad", type: "Delivery" },
  { id: "#1046", customer: "Sara Malik", phone: "0311-9876543", items: "Pepperoni x1", total: 650, status: "Delivered", time: "11:55 AM", address: "Satellite Town RWP", type: "Delivery" },
  { id: "#1045", customer: "Ali Raza", phone: "0321-5554433", items: "Fries x2, Garlic Bread x1", total: 480, status: "On the way", time: "11:40 AM", address: "G-9 Islamabad", type: "Delivery" },
  { id: "#1044", customer: "Hina Khan", phone: "0333-2221100", items: "Veggie Special x2", total: 1100, status: "Cancelled", time: "11:10 AM", address: "Dine-in Table 4", type: "Dine-in" },
  { id: "#1043", customer: "Usman Tariq", phone: "0345-6789012", items: "Margherita x1", total: 600, status: "Delivered", time: "10:50 AM", address: "I-8 Islamabad", type: "Delivery" },
  { id: "#1042", customer: "Ayesha Noor", phone: "0300-9988776", items: "BBQ Chicken x2, Fries x1", total: 2120, status: "Pending", time: "10:30 AM", address: "E-11 Islamabad", type: "Delivery" },
  { id: "#1041", customer: "Kamran Shah", phone: "0321-1122334", items: "Pepperoni x2", total: 1600, status: "Delivered", time: "10:10 AM", address: "Dine-in Table 2", type: "Dine-in" },
];

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
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = ordersData.filter(o => {
    const matchStatus = filter === "All" || o.status === filter;
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = allStatuses.reduce((acc, s) => {
    acc[s] = s === "All" ? ordersData.length : ordersData.filter(o => o.status === s).length;
    return acc;
  }, {});

  const todayRevenue = ordersData.filter(o => o.status !== "Cancelled").reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Orders", value: ordersData.length, color: "#3498db" },
          { label: "Pending / Preparing", value: ordersData.filter(o => ["Pending","Preparing"].includes(o.status)).length, color: "#f39c12" },
          { label: "Delivered Today", value: ordersData.filter(o => o.status === "Delivered").length, color: "#27ae60" },
          { label: "Today's Revenue", value: `Rs ${todayRevenue.toLocaleString()}`, color: "#e74c3c" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters + Search */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {allStatuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                style={{ padding: "5px 12px", borderRadius: "20px", border: "1px solid", fontSize: "12px", cursor: "pointer", fontWeight: filter === s ? 600 : 400,
                  background: filter === s ? "#e74c3c" : "transparent",
                  color: filter === s ? "#fff" : "#666",
                  borderColor: filter === s ? "#e74c3c" : "#e0e0e0",
                }}>
                {s} {counts[s] > 0 && <span style={{ opacity: 0.8 }}>({counts[s]})</span>}
              </button>
            ))}
          </div>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search order or customer..."
            style={{ padding: "7px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "12px", width: "220px", outline: "none" }}
          />
        </div>

        {/* Table */}
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Order ID", "Customer", "Phone", "Items", "Total", "Type", "Status", "Time"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center", padding: "30px", color: "#aaa", fontSize: "13px" }}>No orders found</td></tr>
            ) : filtered.map((o, i) => (
              <tr key={i}
                style={{ borderBottom: "1px solid #fafafa", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 14px", color: "#e74c3c", fontWeight: 700 }}>{o.id}</td>
                <td style={{ padding: "10px 14px", fontWeight: 500, color: "#1a1a2e" }}>{o.customer}</td>
                <td style={{ padding: "10px 14px", color: "#888" }}>{o.phone}</td>
                <td style={{ padding: "10px 14px", color: "#555", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.items}</td>
                <td style={{ padding: "10px 14px", fontWeight: 600, color: "#1a1a2e" }}>Rs {o.total.toLocaleString()}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: "11px", background: o.type === "Dine-in" ? "#e3f2fd" : "#f3e5f5", color: o.type === "Dine-in" ? "#1565c0" : "#6a1b9a", padding: "2px 7px", borderRadius: "10px" }}>
                    {o.type}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: "10px 14px", color: "#aaa" }}>{o.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}