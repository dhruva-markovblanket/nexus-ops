// Deprecated placeholder kept for compatibility. Use TeacherDashboard instead.
export default function StaffDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'
  return (
    <div style={{ padding: 20 }}>
      <h2>Staff Dashboard (legacy)</h2>
      <p><strong>Role:</strong> staff</p>
      <p><strong>User ID:</strong> {id}</p>
      <p><em>Features will be implemented later</em></p>
    </div>
  )
}
