import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useAdminStore from '../../stores/adminStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const thStyle = { padding: '1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)' };
const cardStyle = { background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' };

const AdminAuditLogs = () => {
    const { logs, setLogs } = useAdminStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/audit-logs');
                if (res.data.success) setLogs(res.data.data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchLogs();
    }, []);

    const getActionColor = (action) => {
        if (action.includes('FAIL') || action.includes('DELETE')) return '#ef4444';
        if (action.includes('CREATE')) return '#10b981';
        if (action.includes('SYSTEM')) return 'var(--accent-purple)';
        return '#3b82f6';
    };

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Audit Logs</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Comprehensive system activity tracking.</p>
            </div>

            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr><th style={thStyle}>Timestamp</th><th style={thStyle}>User</th><th style={thStyle}>Action</th><th style={thStyle}>Entity</th><th style={thStyle}>Details</th></tr>
                        </thead>
                        <tbody>
                            {(logs || []).map((log) => (
                                <tr key={log.id}>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(log.timestamp).toLocaleString()}</td>
                                    <td style={{ ...tdStyle, fontWeight: 500 }}>{log.user?.name || 'System'}</td>
                                    <td style={tdStyle}><span style={{ color: getActionColor(log.action), fontWeight: 600, fontSize: '0.8rem' }}>{log.action}</span></td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{log.entity}</td>
                                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--text-tertiary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.metadata || '—'}</td>
                                </tr>
                            ))}
                            {(!logs || logs.length === 0) && (
                                <tr><td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No audit logs found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminAuditLogs;
