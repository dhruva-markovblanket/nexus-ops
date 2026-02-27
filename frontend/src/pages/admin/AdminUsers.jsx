import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useAdminStore from '../../stores/adminStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

const thStyle = { padding: '1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)' };
const cardStyle = { background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' };

const getRoleBadge = (role) => {
    const colors = { admin: { bg: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'rgba(239,68,68,0.2)' }, teacher: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: 'rgba(245,158,11,0.2)' }, student: { bg: 'rgba(16,185,129,0.1)', color: '#10b981', border: 'rgba(16,185,129,0.2)' } };
    const c = colors[role] || colors.student;
    return { padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 600, background: c.bg, color: c.color, border: `1px solid ${c.border}`, textTransform: 'capitalize' };
};

const AdminUsers = () => {
    const { users, setUsers } = useAdminStore();
    const { setLoading, addToast } = useUiStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchUsers(); }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/users');
            if (res.data.success) setUsers(res.data.data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const res = await api.delete(`/admin/users/${id}`);
            if (res.data.success) { setUsers(users.filter(u => u.id !== id)); addToast?.('User deleted', 'success'); }
        } catch (error) { console.error(error); }
    };

    const filteredUsers = (users || []).filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>User Directory</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage all registered accounts across the university.</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}><Plus size={16} /> Add User</button>
            </div>

            <div style={cardStyle}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                    <input type="text" placeholder="Search by name, email, or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ maxWidth: '400px' }} />
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Role</th><th style={thStyle}>Department</th><th style={{ ...thStyle, textAlign: 'right' }}>Actions</th></tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td style={{ ...tdStyle, fontWeight: 500 }}>{user.name}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{user.email}</td>
                                    <td style={tdStyle}><span style={getRoleBadge(user.role)}>{user.role}</span></td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{user.department?.name || '—'}</td>
                                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                                            <button style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0.25rem', color: 'var(--text-tertiary)' }}><Edit size={15} /></button>
                                            <button onClick={() => handleDelete(user.id)} style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0.25rem', color: '#ef4444' }}><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No users found</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminUsers;
