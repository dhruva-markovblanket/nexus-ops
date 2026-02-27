import DashboardLayout from '../components/DashboardLayout'
import { BookOpen, Calendar, AlertCircle, Map, MessageSquare, TrendingUp } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const data = [
  { name: 'Sep', gpa: 3.2 },
  { name: 'Oct', gpa: 3.4 },
  { name: 'Nov', gpa: 3.3 },
  { name: 'Dec', gpa: 3.6 },
  { name: 'Jan', gpa: 3.8 },
  { name: 'Feb', gpa: 3.7 },
]

export default function StudentDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'

  const navItems = [
    { label: 'Overview', icon: TrendingUp, active: true },
    { label: 'Timetable', icon: Calendar },
    { label: 'Exams', icon: BookOpen },
    { label: 'Campus Map', icon: Map },
    { label: 'Support', icon: AlertCircle },
  ]

  return (
    <DashboardLayout role="student" title="Academic Overview" id={id} navItems={navItems}>
      <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        {[
          { label: 'Current GPA', value: '3.72', status: '+0.12 this term' },
          { label: 'Active Courses', value: '6', status: '2 assignments due' },
          { label: 'Attendance', value: '94%', status: 'Within acceptable limits' }
        ].map(stat => (
          <div key={stat.label} className="glass-panel" style={{ padding: '1.5rem' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{stat.label}</p>
            <h3 style={{ fontSize: '2rem', margin: '0 0 0.5rem', fontWeight: 600 }}>{stat.value}</h3>
            <p style={{ color: 'var(--accent-blue)', fontSize: '0.75rem', margin: 0 }}>{stat.status}</p>
          </div>
        ))}
      </div>

      <div className="fade-in-delayed" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>Performance Trajectory</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-purple)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} domain={[2.0, 4.0]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="gpa" stroke="var(--accent-purple)" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>Recent Announcements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { title: 'Spring Registration', date: '2d ago', desc: 'Enrollment opens next week.' },
              { title: 'Library Hours', date: '5d ago', desc: 'Extended hours for finals.' },
              { title: 'Campus Wi-Fi', date: '1w ago', desc: 'Maintenance scheduled for Sunday.' },
            ].map(ann => (
              <div key={ann.title} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>{ann.title}</h4>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{ann.date}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>{ann.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
