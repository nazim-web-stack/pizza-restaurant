import { useState, useEffect } from 'react';

const API = 'http://localhost:5000';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/employees`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => { setEmployees(Array.isArray(data) ? data : []); setLoading(false); })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>Loading employees...</div>;

  return (
    <div style={{padding: '24px'}}>
      <h2>Employees</h2>
      <p style={{color: '#666'}}>Total Staff: {employees.length}</p>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{background: '#f5f5f5'}}>
            <th style={{padding: '12px', textAlign: 'left'}}>Name</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Role</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Phone</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Salary</th>
            <th style={{padding: '12px', textAlign: 'left'}}>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id} style={{borderBottom: '1px solid #eee'}}>
              <td style={{padding: '12px', fontWeight: '500'}}>{emp.name || 'N/A'}</td>
              <td style={{padding: '12px', color: '#666'}}>{emp.position || emp.role || 'N/A'}</td>
              <td style={{padding: '12px'}}>{emp.phone || 'N/A'}</td>
              <td style={{padding: '12px'}}>Rs {emp.salary || 'N/A'}</td>
              <td style={{padding: '12px'}}>
                <span style={{
                  padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem',
                  background: emp.status === 'Active' ? '#d4edda' : '#fff3cd',
                  color: emp.status === 'Active' ? '#155724' : '#856404'
                }}>
                  {emp.status || 'Active'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {employees.length === 0 && <p style={{textAlign: 'center', color: '#888', marginTop: '40px'}}>No employees found</p>}
    </div>
  );
}