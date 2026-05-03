import { useState, useEffect } from "react";

const API = 'http://localhost:5000';

export default function MenuManagement() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({ name: "", category: "Classic Pizzas", price: "", size: "Medium", description: "", imageUrl: "" });

  // Get JWT token from localStorage
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch menu items from API
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API}/api/menu`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching menu items:', err);
      setError('Failed to load menu items. Please try again.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Add new menu item
  const handleAdd = async () => {
    try {
      if (!newItem.name || !newItem.price || !newItem.category || !newItem.description) {
        setError('Please fill all required fields');
        return;
      }

      const response = await fetch(`${API}/api/menu`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const addedItem = await response.json();
      setItems(prev => [...prev, addedItem]);
      setNewItem({ name: "", category: "Classic Pizzas", price: "", size: "Medium", description: "", imageUrl: "" });
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error adding menu item:', err);
      setError('Failed to add menu item. Please try again.');
    }
  };

  // Update existing menu item
  const handleUpdate = async () => {
    try {
      if (!editingItem || !newItem.name || !newItem.price || !newItem.category || !newItem.description) {
        setError('Please fill all required fields');
        return;
      }

      const response = await fetch(`${API}/api/menu/${editingItem._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(newItem)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedItem = await response.json();
      setItems(prev => prev.map(item => item._id === editingItem._id ? updatedItem : item));
      setNewItem({ name: "", category: "Classic Pizzas", price: "", size: "Medium", description: "", imageUrl: "" });
      setEditingItem(null);
      setShowModal(false);
      setError(null);
    } catch (err) {
      console.error('Error updating menu item:', err);
      setError('Failed to update menu item. Please try again.');
    }
  };

  // Toggle item availability
  const toggleStatus = async (item) => {
    try {
      const response = await fetch(`${API}/api/menu/${item._id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isAvailable: !item.isAvailable })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const updatedItem = await response.json();
      setItems(prev => prev.map(i => i._id === item._id ? updatedItem : i));
    } catch (err) {
      console.error('Error updating item status:', err);
      setError('Failed to update item status. Please try again.');
    }
  };

  // Delete menu item
  const handleDelete = async (itemId) => {
    try {
      if (!window.confirm('Are you sure you want to delete this menu item?')) {
        return;
      }

      const response = await fetch(`${API}/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setItems(prev => prev.filter(item => item._id !== itemId));
    } catch (err) {
      console.error('Error deleting menu item:', err);
      setError('Failed to delete menu item. Please try again.');
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price,
      size: item.size,
      description: item.description,
      imageUrl: item.imageUrl || ""
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setNewItem({ name: "", category: "Classic Pizzas", price: "", size: "Medium", description: "", imageUrl: "" });
    setError(null);
  };

  // Filter items
  const filtered = items.filter(i => {
    const matchCat = catFilter === "All" || i.category === catFilter;
    const matchStatus = statusFilter === "All" || (i.isAvailable ? "Available" : "Unavailable") === statusFilter;
    const matchSearch = i.name?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });

  // Get unique categories
  const uniqueCategories = ["All", ...new Set(items.map(i => i.category).filter(Boolean))];

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
        <div style={{ color: '#666' }}>Loading menu items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <div style={{ color: '#e74c3c', fontSize: '16px', marginBottom: '20px' }}>{error}</div>
        <button 
          onClick={fetchMenuItems}
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
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Items", value: items.length, color: "#3498db" },
          { label: "Available", value: items.filter(i => i.isAvailable).length, color: "#27ae60" },
          { label: "Unavailable", value: items.filter(i => !i.isAvailable).length, color: "#e74c3c" },
          { label: "Categories", value: uniqueCategories.length - 1, color: "#f39c12" },
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
            {uniqueCategories.map(c => (
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
              {["Item Name", "Category", "Size", "Price", "Orders", "Status", "Actions"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, i) => (
              <tr key={item._id || i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ fontWeight: 600, color: "#1a1a2e" }}>{item.name}</div>
                  <div style={{ fontSize: "10px", color: "#aaa", marginTop: "1px" }}>{item.description}</div>
                </td>
                <td style={{ padding: "10px 14px", color: "#555" }}>{item.category}</td>
                <td style={{ padding: "10px 14px", color: "#888" }}>{item.size || "Regular"}</td>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#1a1a2e" }}>Rs {(item.price || 0).toLocaleString()}</td>
                <td style={{ padding: "10px 14px", color: "#888" }}>{item.orders || 0}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", fontWeight: 500,
                    background: item.isAvailable ? "#e8f5e9" : "#fce4ec",
                    color: item.isAvailable ? "#2e7d32" : "#c62828",
                  }}>{item.isAvailable ? "Available" : "Unavailable"}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <button onClick={() => toggleStatus(item)}
                    style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #e0e0e0", borderRadius: "6px", cursor: "pointer", background: "transparent", color: "#666", marginRight: "4px" }}>
                    {item.isAvailable ? "Disable" : "Enable"}
                  </button>
                  <button onClick={() => handleDelete(item._id)}
                    style={{ fontSize: "11px", padding: "4px 10px", border: "1px solid #e74c3c", borderRadius: "6px", cursor: "pointer", background: "#e74c3c", color: "#fff" }}>
                    Delete
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
              <span style={{ fontSize: "15px", fontWeight: 700, color: "#1a1a2e" }}>
                {editingItem ? "Edit Menu Item" : "Add New Menu Item"}
              </span>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#aaa" }}>×</button>
            </div>
            {[
              { label: "Item Name", field: "name", type: "text", placeholder: "e.g. BBQ Chicken Pizza" },
              { label: "Price (Rs)", field: "price", type: "number", placeholder: "e.g. 850" },
              { label: "Size", field: "size", type: "text", placeholder: "e.g. Medium" },
              { label: "Description", field: "description", type: "text", placeholder: "Short description..." },
              { label: "Image URL", field: "imageUrl", type: "text", placeholder: "https://example.com/image.jpg (optional)" },
            ].map(f => (
              <div key={f.field} style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>{f.label}</label>
                <input type={f.type} value={newItem[f.field] || ""} placeholder={f.placeholder}
                  onChange={e => setNewItem(p => ({ ...p, [f.field]: e.target.value }))}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", outline: "none" }} />
              </div>
            ))}
            <div style={{ marginBottom: "12px" }}>
              <label style={{ fontSize: "11px", color: "#888", display: "block", marginBottom: "4px" }}>Category</label>
              <select value={newItem.category} onChange={e => setNewItem(p => ({ ...p, category: e.target.value }))}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px" }}>
                {uniqueCategories.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button onClick={closeModal}
                style={{ flex: 1, padding: "9px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "13px", cursor: "pointer", background: "transparent" }}>
                Cancel
              </button>
              <button onClick={editingItem ? handleUpdate : handleAdd}
                style={{ flex: 1, padding: "9px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", cursor: "pointer", fontWeight: 600 }}>
                {editingItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}