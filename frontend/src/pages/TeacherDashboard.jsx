import DashboardLayout from '../components/DashboardLayout'
import { Users, BookOpen, ClipboardList, PieChart, Send } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'CS101', avg: 85, max: 100 },
  { name: 'CS202', avg: 72, max: 100 },
  { name: 'MTH301', avg: 68, max: 100 },
  { name: 'PHY101', avg: 79, max: 100 },
  { name: 'ENG201', avg: 91, max: 100 },
]

export default function TeacherDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'

  const navItems = [
    { label: 'Overview', icon: PieChart, active: true },
    { label: 'Classes', icon: Users },
    { label: 'Assignments', icon: ClipboardList },
    { label: 'Exams', icon: BookOpen },
    { label: 'Announcements', icon: Send },
  ]

  return (
    <DashboardLayout role="teacher" title="Faculty Dashboard" id={id} navItems={navItems}>
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Students', value: '142' },
          { label: 'Active Classes', value: '5' },
          { label: 'Pending Grading', value: '28' },
          { label: 'Average Score', value: '79%' }
        ].map(stat => (
          <div key={stat.label} className="glass-panel" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{stat.label}</p>
            <h3 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 600 }}>{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="fade-in-delayed" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>Class Performance Averages</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                />
                <Bar dataKey="avg" fill="var(--accent-blue)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>Upcoming Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: 'Grade Midterms', course: 'CS202', due: 'Tomorrow' },
              { title: 'Upload Syllabus', course: 'CS304', due: 'In 2 days' },
              { title: 'Review Proposals', course: 'CS101', due: 'Next week' },
            ].map(task => (
              <div key={task.title} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{task.course}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)' }}>{task.due}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
