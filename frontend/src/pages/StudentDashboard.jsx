import ButtonPanel from '../components/ButtonPanel'

export default function StudentDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'
  const items = [
    'Academic Progress',
    'Timetable',
    'Exams',
    'Report an Issue',
    'Campus Navigation',
    'Announcements',
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Student Dashboard</h2>
      <p><strong>Role:</strong> student</p>
      <p><strong>User ID:</strong> {id}</p>
      <p><em>Features will be implemented later</em></p>
      <ButtonPanel items={items} />
    </div>
  )
}
