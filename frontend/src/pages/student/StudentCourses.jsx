import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useStudentStore from '../../stores/studentStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const StudentCourses = () => {
    const { courses, setCourses } = useStudentStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/student/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Courses</h1>
                <p style={{ color: 'var(--text-secondary)' }}>All courses you are currently enrolled in.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {(courses || []).map((enrollment) => {
                    const c = enrollment.course || enrollment;
                    return (
                        <div key={enrollment.id} style={cardStyle}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{c.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600, margin: '0 0 0.75rem 0' }}>{c.code}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span>Credits: {c.credits}</span>
                                <span>Grade: <strong style={{ color: enrollment.grade === 'A' ? '#10b981' : enrollment.grade === 'B' ? '#3b82f6' : '#f59e0b' }}>{enrollment.grade || '—'}</strong></span>
                            </div>
                            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                Attendance: {enrollment.attendance || '—'}%
                            </div>
                        </div>
                    );
                })}
            </div>
            {(!courses || courses.length === 0) && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No courses found.</div>}
        </DashboardLayout>
    );
};

export default StudentCourses;
