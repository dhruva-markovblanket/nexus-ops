import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useAdminStore from '../../stores/adminStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const thStyle = { padding: '1rem', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' };
const tdStyle = { padding: '1rem', fontSize: '0.875rem', borderBottom: '1px solid var(--border-subtle)' };
const cardStyle = { background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)', overflow: 'hidden' };

const AdminCourses = () => {
    const { courses, setCourses } = useAdminStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/courses');
                if (res.data.success) setCourses(res.data.data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchCourses();
    }, []);

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Course Registry</h1>
                <p style={{ color: 'var(--text-secondary)' }}>All courses offered across departments.</p>
            </div>

            <div style={cardStyle}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr><th style={thStyle}>Code</th><th style={thStyle}>Name</th><th style={thStyle}>Department</th><th style={thStyle}>Teacher</th><th style={thStyle}>Credits</th><th style={thStyle}>Semester</th></tr>
                        </thead>
                        <tbody>
                            {(courses || []).map((course) => (
                                <tr key={course.id}>
                                    <td style={{ ...tdStyle, fontWeight: 600, color: 'var(--accent-purple)' }}>{course.code}</td>
                                    <td style={{ ...tdStyle, fontWeight: 500 }}>{course.name}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{course.department?.name || '—'}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{course.teacher?.user?.name || '—'}</td>
                                    <td style={tdStyle}>{course.credits}</td>
                                    <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{course.semester}</td>
                                </tr>
                            ))}
                            {(!courses || courses.length === 0) && (
                                <tr><td colSpan="6" style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '2rem' }}>No courses found.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminCourses;
