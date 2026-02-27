import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useTeacherStore from '../../stores/teacherStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { Plus, Trash2, Megaphone } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const TeacherAnnouncements = () => {
    const { courses, setCourses } = useTeacherStore();
    const { setLoading, addToast } = useUiStore();
    const [selectedCourse, setSelectedCourse] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/teacher/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        const fetchAnnouncements = async () => {
            try {
                const res = await api.get(`/teacher/courses/${selectedCourse}/announcements`);
                if (res.data.success) setAnnouncements(res.data.data);
            } catch (err) { console.error(err); }
        };
        fetchAnnouncements();
    }, [selectedCourse]);

    const handlePost = async () => {
        if (!title.trim() || !body.trim() || !selectedCourse) return;
        try {
            const res = await api.post(`/teacher/courses/${selectedCourse}/announcements`, { title, body });
            if (res.data.success) {
                setAnnouncements([res.data.data, ...announcements]);
                setTitle(''); setBody('');
                addToast?.('Announcement posted', 'success');
            }
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (id) => {
        try {
            const res = await api.delete(`/teacher/announcements/${id}`);
            if (res.data.success) setAnnouncements(announcements.filter(a => a.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <DashboardLayout role="teacher">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Announcements</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Post announcements to your classes.</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ padding: '0.6rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', minWidth: '300px' }}>
                    <option value="">Select a course...</option>
                    {(courses || []).map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
            </div>

            {selectedCourse && (
                <div style={{ ...cardStyle, marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>New Announcement</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                        <textarea placeholder="Body content..." value={body} onChange={(e) => setBody(e.target.value)} rows={3}
                            style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', resize: 'vertical' }} />
                        <button onClick={handlePost} style={{ alignSelf: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}><Plus size={16} /> Post</button>
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {announcements.map((a) => (
                    <div key={a.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <Megaphone size={16} color="var(--accent-purple)" />
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{a.title}</h4>
                            </div>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{a.body}</p>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{new Date(a.createdAt).toLocaleDateString()}</span>
                        </div>
                        <button onClick={() => handleDelete(a.id)} style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: '0.25rem', color: '#ef4444' }}><Trash2 size={16} /></button>
                    </div>
                ))}
                {selectedCourse && announcements.length === 0 && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No announcements for this course.</div>}
                {!selectedCourse && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>Select a course to view announcements.</div>}
            </div>
        </DashboardLayout>
    );
};

export default TeacherAnnouncements;
