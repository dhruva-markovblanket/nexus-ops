import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useTeacherStore from '../../stores/teacherStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { Plus, FileText, CheckCircle, Eye } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const TeacherAssignments = () => {
    const { courses, setCourses } = useTeacherStore();
    const { setLoading, addToast } = useUiStore();
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [showCreate, setShowCreate] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '', maxMarks: 100 });

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/teacher/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        const fetchAssignments = async () => {
            try {
                const res = await api.get(`/teacher/courses/${selectedCourse}/assignments`);
                if (res.data.success) setAssignments(res.data.data);
            } catch (err) { console.error(err); }
        };
        fetchAssignments();
    }, [selectedCourse]);

    const handleCreate = async () => {
        if (!form.title || !form.dueDate) return;
        try {
            const res = await api.post(`/teacher/courses/${selectedCourse}/assignments`, form);
            if (res.data.success) {
                setAssignments([...assignments, res.data.data]);
                setForm({ title: '', description: '', dueDate: '', maxMarks: 100 });
                setShowCreate(false);
                addToast?.('Assignment created', 'success');
            }
        } catch (err) { console.error(err); }
    };

    return (
        <DashboardLayout role="teacher">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Assignments</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Create and manage course assignments.</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ padding: '0.6rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', minWidth: '300px' }}>
                    <option value="">Select a course...</option>
                    {(courses || []).map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
                {selectedCourse && <button onClick={() => setShowCreate(!showCreate)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}><Plus size={16} /> New</button>}
            </div>

            {/* Create Form */}
            {showCreate && selectedCourse && (
                <div style={{ ...cardStyle, marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Create Assignment</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                            style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', resize: 'vertical' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} style={{ flex: 1 }} />
                            <input type="number" placeholder="Max Marks" value={form.maxMarks} onChange={(e) => setForm({ ...form, maxMarks: parseInt(e.target.value) })} style={{ flex: 1 }} />
                        </div>
                        <button onClick={handleCreate} style={{ alignSelf: 'flex-end', fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}>Create</button>
                    </div>
                </div>
            )}

            {/* Assignments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {assignments.map((a) => (
                    <div key={a.id} style={cardStyle}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <FileText size={16} color="var(--accent-purple)" />
                                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{a.title}</h3>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{a.description}</p>
                                <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                    <span>Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                                    <span>Max: {a.maxMarks}</span>
                                    <span>Submissions: {a._count?.submissions || a.submissions?.length || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {selectedCourse && assignments.length === 0 && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No assignments for this course.</div>}
                {!selectedCourse && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>Select a course to view assignments.</div>}
            </div>
        </DashboardLayout>
    );
};

export default TeacherAssignments;
