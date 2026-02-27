import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useTeacherStore from '../../stores/teacherStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const thStyle = { padding: '1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)' };
const cardStyle = { background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' };

const TeacherGradebook = () => {
    const { courses, setCourses } = useTeacherStore();
    const { setLoading, addToast } = useUiStore();
    const [selectedCourse, setSelectedCourse] = useState('');
    const [enrollments, setEnrollments] = useState([]);
    const [editingGrades, setEditingGrades] = useState({});

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/teacher/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        const fetchEnrollments = async () => {
            try {
                const res = await api.get(`/teacher/courses/${selectedCourse}/students`);
                if (res.data.success) setEnrollments(res.data.data);
            } catch (err) { console.error(err); }
        };
        fetchEnrollments();
    }, [selectedCourse]);

    const handleGradeChange = (enrollmentId, grade) => {
        setEditingGrades(prev => ({ ...prev, [enrollmentId]: grade }));
    };

    const handleSaveGrade = async (enrollmentId) => {
        const grade = editingGrades[enrollmentId];
        if (!grade) return;
        try {
            const res = await api.put(`/teacher/enrollments/${enrollmentId}/grade`, { grade });
            if (res.data.success) {
                setEnrollments(enrollments.map(e => e.id === enrollmentId ? { ...e, grade } : e));
                addToast?.('Grade saved', 'success');
            }
        } catch (err) { console.error(err); }
    };

    return (
        <DashboardLayout role="teacher">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Gradebook</h1>
                <p style={{ color: 'var(--text-secondary)' }}>View and edit student grades per course.</p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ padding: '0.6rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', minWidth: '300px' }}>
                    <option value="">Select a course...</option>
                    {(courses || []).map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
            </div>

            {selectedCourse && (
                <div style={cardStyle}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead><tr><th style={thStyle}>Student</th><th style={thStyle}>Current Grade</th><th style={thStyle}>New Grade</th><th style={thStyle}>Action</th></tr></thead>
                        <tbody>
                            {enrollments.map((enrollment) => (
                                <tr key={enrollment.id}>
                                    <td style={{ ...tdStyle, fontWeight: 500 }}>{enrollment.student?.user?.name || '—'}</td>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: '#3b82f6' }}>{enrollment.grade || '—'}</td>
                                    <td style={tdStyle}>
                                        <select value={editingGrades[enrollment.id] || ''} onChange={(e) => handleGradeChange(enrollment.id, e.target.value)}
                                            style={{ padding: '0.4rem 0.75rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                                            <option value="">—</option>
                                            {['A', 'B', 'C', 'D', 'F'].map(g => <option key={g} value={g}>{g}</option>)}
                                        </select>
                                    </td>
                                    <td style={tdStyle}>
                                        <button onClick={() => handleSaveGrade(enrollment.id)} style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Save</button>
                                    </td>
                                </tr>
                            ))}
                            {enrollments.length === 0 && <tr><td colSpan="4" style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No students enrolled</td></tr>}
                        </tbody>
                    </table>
                </div>
            )}

            {!selectedCourse && <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Select a course to view the gradebook.</div>}
        </DashboardLayout>
    );
};

export default TeacherGradebook;
