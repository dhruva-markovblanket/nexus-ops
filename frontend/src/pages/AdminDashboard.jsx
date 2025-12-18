import ButtonPanel from '../components/ButtonPanel'

export default function AdminDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'
  const items = [
    'View All Reports',
    'Campus Analytics',
    'Maintenance Requests',
    'System Overview',
    'Monthly Analysis',
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin & Maintenance Dashboard</h2>
      <p><strong>Role:</strong> admin</p>
      <p><strong>User ID:</strong> {id}</p>
      <p><em>Features will be implemented later</em></p>
      <ButtonPanel items={items} />
    </div>
  )
}
