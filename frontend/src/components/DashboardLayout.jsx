import { useNavigate } from 'react-router-dom'
import { LogOut, Bell, Search, Hexagon } from 'lucide-react'

export default function DashboardLayout({ children, role, title, id, navItems }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem('nexus_user_id')
        navigate('/')
    }

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside
                className="dashboard-sidebar"
            >
                <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div style={{
                        width: '40px', height: '40px',
                        background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
                        borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Hexagon color="white" size={24} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', margin: 0 }} className="text-gradient">Nexus Ops</h2>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>Enterprise</p>
                    </div>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item, idx) => {
                        const Icon = item.icon
                        return (
                            <button
                                key={item.label}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                                    padding: '0.75rem 1rem', borderRadius: '8px',
                                    background: item.active ? 'var(--accent-glow)' : 'transparent',
                                    color: item.active ? 'var(--text-primary)' : 'var(--text-secondary)',
                                    border: '1px solid',
                                    borderColor: item.active ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                                    textAlign: 'left', fontSize: '0.9rem', width: '100%', cursor: 'pointer',
                                    boxShadow: 'none'
                                }}
                            >
                                <Icon size={18} color={item.active ? 'var(--accent-purple)' : 'currentColor'} />
                                {item.label}
                            </button>
                        )
                    })}
                </nav>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--border-focus)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>
                            {id.substring(0, 2)}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{id}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{role} Access</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)'
                        }}
                    >
                        <LogOut size={16} /> Disconnect
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="dashboard-main">
                {/* Topbar */}
                <header className="dashboard-topbar">
                    <h1 style={{ fontSize: '1.25rem', margin: 0, fontWeight: 500 }}>{title}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                            <input
                                placeholder="Search resources..."
                                style={{
                                    background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                                    padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '20px', fontSize: '0.85rem', width: '240px'
                                }}
                            />
                        </div>
                        <button style={{ background: 'transparent', border: 'none', padding: '0.5rem', position: 'relative', boxShadow: 'none' }}>
                            <Bell size={20} color="var(--text-secondary)" />
                            <span style={{ position: 'absolute', top: '6px', right: '8px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
                        </button>
                    </div>
                </header>

                {/* Dynamic Content */}
                <div className="dashboard-content">
                    <div>
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
