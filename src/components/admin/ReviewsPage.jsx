const reviewsData = [
  { customer: "Bilal Ahmed", item: "Margherita Pizza",  rating: 5, comment: "Excellent pizza! Absolutely perfect.",               date: "29 Mar", replied: true  },
  { customer: "Sara Malik",  item: "Pepperoni Pizza",   rating: 4, comment: "Good, but could be more spicy",        date: "28 Mar", replied: false },
  { customer: "Ali Raza",    item: "Garlic Bread",      rating: 3, comment: "Average, needs improvement",             date: "27 Mar", replied: false },
  { customer: "Hina Khan",   item: "Veggie Special",    rating: 5, comment: "Very fresh ingredients, loved it!",              date: "26 Mar", replied: true  },
  { customer: "Usman Tariq", item: "BBQ Chicken Pizza", rating: 4, comment: "Good but delivery was a bit late",                 date: "25 Mar", replied: false },
];

export default function ReviewsPage() {
  const avg = (reviewsData.reduce((s, r) => s + r.rating, 0) / reviewsData.length).toFixed(1);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Average Rating",  value: `${avg} / 5`,                                      color: "#f39c12" },
          { label: "Total Reviews",   value: 318,                                                color: "#3498db" },
          { label: "Pending Reply",   value: reviewsData.filter(r => !r.replied).length,         color: "#e74c3c" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reviewsData.map((r, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: 600, fontSize: "13px", color: "#1a1a2e" }}>{r.customer}</span>
                <span style={{ margin: "0 6px", color: "#ddd" }}>·</span>
                <span style={{ fontSize: "12px", color: "#888" }}>{r.item}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11px", color: "#aaa" }}>{r.date}</span>
                {r.replied
                  ? <span style={{ fontSize: "10px", background: "#e8f5e9", color: "#2e7d32", padding: "2px 7px", borderRadius: "10px" }}>Replied</span>
                  : <span style={{ fontSize: "10px", background: "#fce4ec", color: "#c62828", padding: "2px 7px", borderRadius: "10px" }}>No Reply</span>}
              </div>
            </div>
            <div style={{ marginBottom: "6px", color: "#f39c12" }}>
              {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
              <span style={{ fontSize: "11px", color: "#aaa", marginLeft: "4px" }}>{r.rating}/5</span>
            </div>
            <p style={{ fontSize: "12px", color: "#555", margin: 0 }}>{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}