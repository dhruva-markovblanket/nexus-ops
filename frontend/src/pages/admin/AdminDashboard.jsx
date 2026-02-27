import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useAdminStore from '../../stores/adminStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import SecurityMap3D from '../../components/SecurityMap3D';
import { Activity, Shield, Users, Building2, BookOpen } from 'lucide-react';

const cardStyle = {
    background: 'var(--bg-surface)',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border-subtle)',
};

const AdminDashboard = () => {
    const { stats, setStats, logs, setLogs } = useAdminStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                const [statsRes, logsRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/audit-logs')
                ]);
                if (statsRes.data.success) setStats(statsRes.data.data);
                if (logsRes.data.success) setLogs(logsRes.data.data.slice(0, 5));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const getEventColor = (action) => {
        if (action.includes('SYSTEM')) return 'var(--accent-purple)';
        if (action.includes('FAIL') || action.includes('DELETE')) return '#ef4444';
        if (action.includes('CREATE')) return '#10b981';
        return '#3b82f6';
    };

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Operations Control Center</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Live system metrics and infrastructure health.</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Users', value: (stats?.students || 0) + (stats?.teachers || 0), icon: Users, color: '#10b981', sub: 'Active Directory' },
                    { label: 'Departments', value: stats?.departments || 0, icon: Building2, color: '#3b82f6', sub: 'Campus Sectors' },
                    { label: 'Active Courses', value: stats?.courses || 0, icon: BookOpen, color: '#8b5cf6', sub: 'Fall 2026 Semester' },
                    { label: 'System Uptime', value: '99.9%', icon: Activity, color: '#10b981', sub: 'All endpoints Operational' },
                ].map((stat) => (
                    <div key={stat.label} style={cardStyle}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 1rem 0' }}>{stat.value}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: stat.color }}>
                            <stat.icon size={14} /> {stat.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* Maps and Logging */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                {/* 3D Security Map */}
                <div style={{ ...cardStyle, position: 'relative', overflow: 'hidden', minHeight: '400px', padding: 0 }}>
                    <div style={{ position: 'absolute', top: '1rem', left: '1.5rem', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: 'calc(100% - 3rem)' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Shield size={18} color="var(--accent-purple)" /> Live Threat Topography
                        </h3>
                        <span style={{ padding: '0.25rem 0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em', border: '1px solid rgba(16,185,129,0.2)' }}>
                            SECURE
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '400px' }}>
                        <SecurityMap3D />
                    </div>
                </div>

                {/* Recent Events */}
                <div style={cardStyle}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Recent Events</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {logs && logs.length > 0 ? logs.map((log) => (
                            <div key={log.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0, backgroundColor: getEventColor(log.action) }} />
                                <div>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{log.action}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', margin: 0 }}>{log.entity} - {log.user?.name || 'System'}</p>
                                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', fontFamily: 'monospace', marginTop: '0.25rem', display: 'block' }}>{new Date(log.timestamp).toLocaleTimeString()}</span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem', marginTop: '2.5rem' }}>Waiting for data stream...</div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
