const loyaltyData = [
  { customer: "Bilal Ahmed", earned: 320, used: 136, balance: 184, tier: "Gold"   },
  { customer: "Hina Khan",   earned: 200, used:  57, balance: 143, tier: "Gold"   },
  { customer: "Sara Malik",  earned:  95, used:  24, balance:  71, tier: "Silver" },
  { customer: "Ali Raza",    earned:  52, used:   0, balance:  52, tier: "Silver" },
  { customer: "Usman Tariq", earned:  31, used:   0, balance:  31, tier: "Bronze" },
];

const tierColor = {
  Gold:   { bg: "#fff8e1", color: "#f57f17" },
  Silver: { bg: "#f5f5f5", color: "#616161" },
  Bronze: { bg: "#fbe9e7", color: "#bf360c" },
};

export default function LoyaltyPage() {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Points Issued (Total)", value: "45,820", color: "#3498db" },
          { label: "Points Redeemed",       value: "12,440", color: "#e74c3c" },
          { label: "Active Members",        value: 876,      color: "#27ae60" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Loyalty Points Ledger</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Customer","Points Earned","Points Used","Balance","Tier"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loyaltyData.map((l, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={e => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>{l.customer}</td>
                <td style={{ padding: "9px 14px", color: "#27ae60", fontWeight: 600 }}>+{l.earned}</td>
                <td style={{ padding: "9px 14px", color: "#e74c3c", fontWeight: 600 }}>-{l.used}</td>
                <td style={{ padding: "9px 14px", fontWeight: 700, color: "#1a1a2e" }}>{l.balance}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: tierColor[l.tier]?.bg, color: tierColor[l.tier]?.color }}>{l.tier}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}