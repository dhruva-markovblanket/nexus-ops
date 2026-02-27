import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useAdminStore from '../../stores/adminStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { Plus, Trash2, Megaphone } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const AdminAnnouncements = () => {
    const { announcements, setAnnouncements } = useAdminStore();
    const { setLoading, addToast } = useUiStore();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [targetRole, setTargetRole] = useState('all');

    useEffect(() => {
        const fetchAnnouncements = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/announcements');
                if (res.data.success) setAnnouncements(res.data.data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchAnnouncements();
    }, []);

    const handlePost = async () => {
        if (!title.trim() || !body.trim()) return;
        try {
            const res = await api.post('/admin/announcements', { title, body, targetRole });
            if (res.data.success) {
                setAnnouncements([res.data.data, ...(announcements || [])]);
                setTitle(''); setBody('');
                addToast?.('Announcement posted', 'success');
            }
        } catch (error) { console.error(error); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/admin/announcements/${id}`);
            if (res.data.success) setAnnouncements((announcements || []).filter(a => a.id !== id));
        } catch (error) { console.error(error); }
    };

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Announcements</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Broadcast messages to the entire campus.</p>
            </div>

            {/* Post Form */}
            <div style={{ ...cardStyle, marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>New Announcement</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <textarea placeholder="Body content..." value={body} onChange={(e) => setBody(e.target.value)} rows={3}
                        style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', resize: 'vertical' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <select value={targetRole} onChange={(e) => setTargetRole(e.target.value)}
                            style={{ padding: '0.5rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                            <option value="all">All Roles</option>
                            <option value="student">Students Only</option>
                            <option value="teacher">Teachers Only</option>
                        </select>
                        <button onClick={handlePost} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}><Plus size={16} /> Post</button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(announcements || []).map((a) => (
                    <div key={a.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Megaphone size={16} color="var(--accent-purple)" />
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{a.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{a.body}</p>
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                                <span>Target: {a.targetRole}</span>
                                <span>By: {a.author?.name || 'System'}</span>
                                <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(a.id)} style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0.25rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                ))}
                {(!announcements || announcements.length === 0) && (
                    <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No announcements yet.</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminAnnouncements;
