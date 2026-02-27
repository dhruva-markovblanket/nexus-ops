import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useTeacherStore from '../../stores/teacherStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const thStyle = { padding: '1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)' };
const cardStyle = { background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' };

const statusColors = { Present: '#10b981', Absent: '#ef4444', Late: '#f59e0b' };

const TeacherAttendance = () => {
    const { courses, setCourses } = useTeacherStore();
    const { setLoading, addToast } = useUiStore();
    const [selectedCourse, setSelectedCourse] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/teacher/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    useEffect(() => {
        if (!selectedCourse) return;
        const fetchStudents = async () => {
            try {
                const res = await api.get(`/teacher/courses/${selectedCourse}/students`);
                if (res.data.success) {
                    setStudents(res.data.data);
                    const initial = {};
                    res.data.data.forEach(s => { initial[s.studentId || s.id] = 'Present'; });
                    setAttendance(initial);
                }
            } catch (err) { console.error(err); }
        };
        fetchStudents();
    }, [selectedCourse]);

    const handleSubmit = async () => {
        try {
            const records = Object.entries(attendance).map(([studentId, status]) => ({ studentId, status, date }));
            const res = await api.post(`/teacher/courses/${selectedCourse}/attendance`, { records });
            if (res.data.success) addToast?.('Attendance saved', 'success');
        } catch (err) { console.error(err); }
    };

    return (
        <DashboardLayout role="teacher">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Attendance</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Mark student attendance for your courses.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                    style={{ padding: '0.6rem 1rem', background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.9rem', minWidth: '300px' }}>
                    <option value="">Select a course...</option>
                    {(courses || []).map(c => <option key={c.id} value={c.id}>{c.name} ({c.code})</option>)}
                </select>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                    style={{ padding: '0.6rem 1rem', maxWidth: '200px' }} />
            </div>

            {selectedCourse && students.length > 0 && (
                <>
                    <div style={cardStyle}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead><tr><th style={thStyle}>Student</th><th style={thStyle}>Status</th></tr></thead>
                            <tbody>
                                {students.map((enrollment) => {
                                    const sid = enrollment.studentId || enrollment.id;
                                    return (
                                        <tr key={sid}>
                                            <td style={{ ...tdStyle, fontWeight: 500 }}>{enrollment.student?.user?.name || '—'}</td>
                                            <td style={tdStyle}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {['Present', 'Absent', 'Late'].map(status => (
                                                        <button key={status} onClick={() => setAttendance(prev => ({ ...prev, [sid]: status }))}
                                                            style={{
                                                                fontSize: '0.8rem', padding: '0.35rem 0.75rem', borderRadius: '6px',
                                                                background: attendance[sid] === status ? statusColors[status] : 'transparent',
                                                                color: attendance[sid] === status ? '#fff' : 'var(--text-secondary)',
                                                                border: `1px solid ${attendance[sid] === status ? statusColors[status] : 'var(--border-subtle)'}`,
                                                                boxShadow: 'none', cursor: 'pointer'
                                                            }}>
                                                            {status}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleSubmit} style={{ fontSize: '0.9rem', padding: '0.7rem 2rem' }}>Submit Attendance</button>
                    </div>
                </>
            )}

            {!selectedCourse && <div style={{ ...cardStyle, padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>Select a course to mark attendance.</div>}
        </DashboardLayout>
    );
};

export default TeacherAttendance;
