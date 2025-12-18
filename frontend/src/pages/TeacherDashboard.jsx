import ButtonPanel from '../components/ButtonPanel'

export default function TeacherDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'
  const items = [
    'Manage Timetable',
    'Upload Exams',
    'Post Announcements',
    'View Student Reports',
    'Assign Work',
  ]

  return (
    <div style={{ padding: 20 }}>
      <h2>Teaching Staff Dashboard</h2>
      <p><strong>Role:</strong> teacher</p>
      <p><strong>User ID:</strong> {id}</p>
      <p><em>Features will be implemented later</em></p>
      <ButtonPanel items={items} />
    </div>
  )
}
