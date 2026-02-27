import DashboardLayout from '../components/DashboardLayout'
import { useParams } from 'react-router-dom'
import { Activity, Server, Shield, Database, Settings } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SecurityMap3D from '../components/SecurityMap3D'

const data = [
  { time: '00:00', load: 12 },
  { time: '04:00', load: 8 },
  { time: '08:00', load: 45 },
  { time: '12:00', load: 85 },
  { time: '16:00', load: 72 },
  { time: '20:00', load: 35 },
  { time: '24:00', load: 15 },
]

const OverviewTab = () => (
  <>
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
      {[
        { label: 'System Uptime', value: '99.99%', status: 'Operational', color: '#10b981' },
        { label: 'Active Users', value: '1,284', status: '+12% from yesterday', color: 'var(--text-secondary)' },
        { label: 'Server Load', value: '42%', status: 'Stable', color: 'var(--text-secondary)' },
        { label: 'Security Alerts', value: '0', status: 'All systems clear', color: 'var(--text-secondary)' },
      ].map(stat => (
        <div key={stat.label} className="glass-panel" style={{ padding: '1.5rem', borderTop: `2px solid ${stat.color === '#10b981' ? stat.color : 'transparent'}` }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>{stat.label}</p>
          <h3 style={{ fontSize: '1.75rem', margin: 0, fontWeight: 600 }}>{stat.value}</h3>
          <p style={{ color: stat.color, fontSize: '0.75rem', margin: '0.5rem 0 0 0' }}>{stat.status}</p>
        </div>
      ))}
    </div>

    <div className="fade-in-delayed" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>Global Network Load</h3>
          <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '0.75rem' }}>Live</span>
        </div>
        <div style={{ height: '300px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="load" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '1.5rem' }}>System Events</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { type: 'Auth', msg: 'Admin login success', time: 'Just now', color: 'var(--accent-blue)' },
            { type: 'DB', msg: 'Automated backup completed', time: '2h ago', color: '#10b981' },
            { type: 'Node', msg: 'API gateway scaled to 4', time: '5h ago', color: 'var(--accent-purple)' },
            { type: 'Sec', msg: 'Multiple failed logins detected', time: '12h ago', color: '#f59e0b' },
            { type: 'Sys', msg: 'Weekly security scan pass', time: '1d ago', color: 'var(--text-secondary)' },
          ].map((event, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: event.color, marginTop: '5px', flexShrink: 0 }}></div>
              <div>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{event.msg}</p>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{event.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
)

const PlaceholderTab = ({ name, description }) => (
  <div className="fade-in" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
    <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>{name}</h2>
    <p>{description}</p>
    <div style={{ marginTop: '2rem', padding: '2rem', border: '1px dashed var(--border-subtle)', borderRadius: '12px' }}>
      Waiting for data stream...
    </div>
  </div>
)

export default function AdminDashboard() {
  const id = localStorage.getItem('nexus_user_id') || 'unknown'
  const { tab = 'overview' } = useParams()

  const navItems = [
    { id: 'overview', label: 'System Overview', icon: Activity, active: tab === 'overview' },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server, active: tab === 'infrastructure' },
    { id: 'security-logs', label: 'Security Logs', icon: Shield, active: tab === 'security-logs' },
    { id: 'databases', label: 'Databases', icon: Database, active: tab === 'databases' },
    { id: 'settings', label: 'Settings', icon: Settings, active: tab === 'settings' },
  ]

  const renderContent = () => {
    switch (tab) {
      case 'overview': return <OverviewTab />
      case 'infrastructure': return <PlaceholderTab name="Infrastructure" description="Cloud resources and server node management." />
      case 'security-logs': return (
        <div style={{ padding: '1rem' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 500 }}>Live Threat Topography</h2>
          <SecurityMap3D />
        </div>
      )
      case 'databases': return <PlaceholderTab name="Databases" description="PostgreSQL and Redis cluster status." />
      case 'settings': return <PlaceholderTab name="Settings" description="Global portal configuration access." />
      default: return <OverviewTab />
    }
  }

  return (
    <DashboardLayout role="admin" title="Operations Control Center" id={id} navItems={navItems}>
      {renderContent()}
    </DashboardLayout>
  )
}
