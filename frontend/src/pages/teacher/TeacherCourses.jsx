import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useTeacherStore from '../../stores/teacherStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const TeacherCourses = () => {
    const { courses, setCourses } = useTeacherStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/teacher/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    return (
        <DashboardLayout role="teacher">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>My Courses</h1>
                <p style={{ color: 'var(--text-secondary)' }}>All courses you are assigned to teach.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {(courses || []).map((c) => (
                    <div key={c.id} style={cardStyle}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{c.name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--accent-purple)', fontWeight: 600, margin: '0 0 0.75rem 0' }}>{c.code}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>Credits: {c.credits}</span>
                            <span>Semester: {c.semester}</span>
                        </div>
                        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                            Students: {c._count?.enrollments || c.enrollments?.length || 0}
                        </div>
                    </div>
                ))}
            </div>
            {(!courses || courses.length === 0) && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No courses assigned.</div>}
        </DashboardLayout>
    );
};

export default TeacherCourses;
