import { useState } from "react";

const menuData = [
  { id: 1, name: "Margherita Pizza", category: "Classic Pizzas", price: 600, size: "Medium", status: "Available", orders: 142, description: "Classic tomato sauce, mozzarella, basil" },
  { id: 2, name: "BBQ Chicken Pizza", category: "Specialty", price: 950, size: "Large", status: "Available", orders: 98, description: "BBQ sauce, grilled chicken, onions" },
  { id: 3, name: "Pepperoni Pizza", category: "Classic Pizzas", price: 800, size: "Medium", status: "Available", orders: 87, description: "Pepperoni, mozzarella, tomato sauce" },
  { id: 4, name: "Veggie Special", category: "Vegetarian", price: 700, size: "Medium", status: "Unavailable", orders: 45, description: "Mixed veggies, olives, bell pepper" },
  { id: 5, name: "Garlic Bread", category: "Sides", price: 220, size: "Regular", status: "Available", orders: 64, description: "Toasted bread with garlic butter" },
  { id: 6, name: "Cheesy Fries", category: "Sides", price: 280, size: "Regular", status: "Available", orders: 52, description: "Crispy fries with cheese sauce" },
  { id: 7, name: "Chicken Broast", category: "Specialty", price: 1100, size: "Large", status: "Available", orders: 39, description: "Crispy fried chicken, special spices" },
  { id: 8, name: "Chocolate Lava Cake", category: "Desserts", price: 320, size: "Regular", status: "Unavailable", orders: 28, description: "Warm chocolate cake, vanilla ice cream" },
];

const categories = ["All", "Classic Pizzas", "Specialty", "Vegetarian", "Sides", "Desserts"];

export default function MenuManagement() {
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState(menuData);
  const [newItem, setNewItem] = useState({ name: "", category: "Classic Pizzas", price: "", size: "Medium", description: "" });

  const filtered = items.filter(i => {
    const matchCat = catFilter === "All" || i.category === catFilter;
    const matchStatus = statusFilter === "All" || i.status === statusFilter;
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  const toggleStatus = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === "Available" ? "Unavailable" : "Available" } : i));
  };

  const handleAdd = () => {
    if (!newItem.name || !newItem.price) return;
    setItems(prev => [...prev, { ...newItem, id: Date.now(), price: parseInt(newItem.price), orders: 0 }]);
    setNewItem({ name: "", category: "Classic Pizzas", price: "", size: "Medium", description: "" });
    setShowModal(false);
  };

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Items", value: items.length, color: "#3498db" },
          { label: "Available", value: items.filter(i => i.status === "Available").length, color: "#27ae60" },
          { label: "Unavailable", value: items.filter(i => i.status === "Unavailable").length, color: "#e74c3c" },
          { label: "Categories", value: categories.length - 1, color: "#f39c12" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                style={{ padding: "5px 11px", borderRadius: "20px", border: "1px solid", fontSize: "11px", cursor: "pointer",
                  background: catFilter === c ? "#e74c3c" : "transparent",
                  color: catFilter === c ? "#fff" : "#666",
                  borderColor: catFilter === c ? "#e74c3c" : "#e0e0e0",
                }}>{c}</button>
            ))}
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: "5px 10px", border: "1px solid #e0e0e0", borderRadius: "20px", fontSize: "11px", color: "#666", cursor: "pointer" }}>
              <option>All</option><option>Available</option><option>Unavailable</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search item..."
              style={{ padding: "7px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "12px", width: "180px", outline: "none" }} />
            <button onClick={() => setShowModal(true)}
              style={{ padding: "7px 14px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
              + Add Item
            </button>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Item Name", "Category", "Size", "Price", "Orders", "Status", "Action"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{item.name}</div>
                  <div style={{ fontSize: "10px", color: "#aaa", marginTop: "1px" }}>{item.description}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "#555" }}>{item.category}</td>
                <td style={{ padding: "10px 14px", color: "#888" }}>{item.size}</td>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1a1a2e" }}>Rs {item.price.toLocaleString()}</td>
                <td style={{ padding: "10px 14px", color: "#888" }}>{item.orders}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", fontWeight: 500,
                    background: item.status === "Available" ? "#e8f5e9" : "#fce4ec",
                    color: item.status === "Available" ? "#2e7d32" : "#c62828",
                  }}>{item.status}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <button onClick={() => toggleStatus(item.id)}
                    style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #e0e0e0", borderRadius: "6px", cursor: "pointer", background: "transparent", color: "#666" }}>
                    {item.status === "Available" ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "#fff", borderRadius: "14px", padding: "24px", width: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e" }}>Add New Menu Item</span>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#aaa" }}>×</button>
            </div>
            {[
              { label: "Item Name", field: "name", type: "text", placeholder: "e.g. BBQ Chicken Pizza" },
              { label: "Price (Rs)", field: "price", type: "number", placeholder: "e.g. 850" },
              { label: "Description", field: "description", type: "text", placeholder: "Short description..." },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>{f.label}</label>
                <input type={f.type} value={newItem[f.field]} placeholder={f.placeholder}
                  onChange={e => setNewItem(p => ({ ...p, [f.field]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>Category</label>
              <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px" }}>
                {categories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={() => setShowModal(false)}
                style={{ flex: 1, padding: "9px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", cursor: "pointer", background: "transparent" }}>
                Cancel
              </button>
              <button onClick={handleAdd}
                style={{ flex: 1, padding: "9px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}