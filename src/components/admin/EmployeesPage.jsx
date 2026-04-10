const employeesData = [
  { name: "Ahmed Shah",    role: "Head Chef",      shift: "Morning", salary: 45000, phone: "0300-1111111", status: "Present",  joined: "Jan 2023" },
  { name: "Kamran Ali",    role: "Delivery Rider", shift: "Evening", salary: 28000, phone: "0311-2222222", status: "Present",  joined: "Mar 2023" },
  { name: "Nadia Hussain", role: "Cashier",        shift: "Morning", salary: 32000, phone: "0321-3333333", status: "On Leave", joined: "Jun 2023" },
  { name: "Tariq Mehmood", role: "Chef",           shift: "Night",   salary: 35000, phone: "0333-4444444", status: "Present",  joined: "Aug 2023" },
  { name: "Zara Iqbal",    role: "Receptionist",   shift: "Morning", salary: 30000, phone: "0345-5555555", status: "Present",  joined: "Oct 2023" },
];

export default function EmployeesPage() {
  const totalPayroll = employeesData.reduce((s, e) => s + e.salary, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "20px" }}>
        {[
          { label: "Total Staff",     value: employeesData.length,                                         color: "#3498db" },
          { label: "Present Today",   value: employeesData.filter(e => e.status === "Present").length,     color: "#27ae60" },
          { label: "On Leave",        value: employeesData.filter(e => e.status === "On Leave").length,    color: "#e74c3c" },
          { label: "Monthly Payroll", value: `Rs ${totalPayroll.toLocaleString()}`,                        color: "#f39c12" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: "12px", padding: "14px 16px", border: "1px solid #f0f0f0" }}>
            <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px" }}>{s.label}</div>
            <div style={{ fontSize: i === 3 ? "15px" : "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #f0f0f0", overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid #f5f5f5", display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "13px", fontWeight: 600 }}>Employees</span>
          <button style={{ padding: "6px 12px", background: "#e74c3c", color: "#fff", border: "none", borderRadius: "8px", fontSize: "12px", cursor: "pointer", fontWeight: 600 }}>
            + Add Employee
          </button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
          <thead>
            <tr style={{ background: "#fafafa" }}>
              {["Name","Role","Shift","Phone","Salary","Status","Joined"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "9px 14px", fontSize: "11px", color: "#aaa", fontWeight: 500, borderBottom: "1px solid #f0f0f0" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeesData.map((e, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #fafafa" }}
                onMouseEnter={ev => ev.currentTarget.style.background = "#fafafa"}
                onMouseLeave={ev => ev.currentTarget.style.background = "transparent"}>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>{e.name}</td>
                <td style={{ padding: "9px 14px", color: "#555" }}>{e.role}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", background: "#e3f2fd", color: "#1565c0", padding: "2px 7px", borderRadius: "10px" }}>{e.shift}</span>
                </td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{e.phone}</td>
                <td style={{ padding: "9px 14px", fontWeight: 600, color: "#1a1a2e" }}>Rs {e.salary.toLocaleString()}</td>
                <td style={{ padding: "9px 14px" }}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", fontWeight: 500,
                    background: e.status === "Present" ? "#e8f5e9" : "#fce4ec",
                    color:      e.status === "Present" ? "#2e7d32"  : "#c62828" }}>{e.status}</span>
                </td>
                <td style={{ padding: "9px 14px", color: "#aaa" }}>{e.joined}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}