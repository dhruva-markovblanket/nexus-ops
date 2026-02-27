import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useStudentStore from '../../stores/studentStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const thStyle = { padding: '1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)' };
const cardStyle = { background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' };

const StudentGrades = () => {
    const { grades, setGrades } = useStudentStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/student/grades'); if (res.data.success) setGrades(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    const getGradeColor = (g) => {
        if (g === 'A') return '#10b981'; if (g === 'B') return '#3b82f6'; if (g === 'C') return '#f59e0b'; return '#ef4444';
    };

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Grade Transcript</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Your academic performance across all courses.</p>
            </div>
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr><th style={thStyle}>Course</th><th style={thStyle}>Code</th><th style={thStyle}>Credits</th><th style={thStyle}>Grade</th><th style={thStyle}>Attendance</th></tr></thead>
                    <tbody>
                        {(grades || []).map((enrollment) => (
                            <tr key={enrollment.id}>
                                <td style={{ ...tdStyle, fontWeight: 500 }}>{enrollment.course?.name || '—'}</td>
                                <td style={{ ...tdStyle, color: 'var(--accent-purple)', fontWeight: 600 }}>{enrollment.course?.code || '—'}</td>
                                <td style={tdStyle}>{enrollment.course?.credits || '—'}</td>
                                <td style={tdStyle}><span style={{ fontWeight: 700, color: getGradeColor(enrollment.grade) }}>{enrollment.grade || '—'}</span></td>
                                <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{enrollment.attendance || '—'}%</td>
                            </tr>
                        ))}
                        {(!grades || grades.length === 0) && <tr><td colSpan="5" style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No grades yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default StudentGrades;
