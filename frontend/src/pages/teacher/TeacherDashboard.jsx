import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useTeacherStore from '../../stores/teacherStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { BookOpen, Users, ClipboardList, TrendingUp } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const TeacherDashboard = () => {
    const { courses, setCourses } = useTeacherStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/teacher/courses'); if (res.data.success) setCourses(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    const totalStudents = (courses || []).reduce((acc, c) => acc + (c._count?.enrollments || c.enrollments?.length || 0), 0);

    return (
        <DashboardLayout role="teacher">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Teacher Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Overview of your academic responsibilities.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Assigned Courses', value: (courses || []).length, icon: BookOpen, color: '#3b82f6' },
                    { label: 'Total Students', value: totalStudents, icon: Users, color: '#10b981' },
                    { label: 'Active Assignments', value: '—', icon: ClipboardList, color: '#f59e0b' },
                    { label: 'Avg Performance', value: '—', icon: TrendingUp, color: '#8b5cf6' },
                ].map((stat) => (
                    <div key={stat.label} style={cardStyle}>
                        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{stat.label}</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, margin: '0 0 0.75rem 0' }}>{stat.value}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: stat.color }}>
                            <stat.icon size={14} /> Active
                        </div>
                    </div>
                ))}
            </div>

            <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Your Courses</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {(courses || []).map((c) => (
                        <div key={c.id} style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>{c.name}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>{c.code} • {c.credits} credits • {c._count?.enrollments || c.enrollments?.length || 0} students</p>
                        </div>
                    ))}
                </div>
                {(!courses || courses.length === 0) && <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>No courses assigned.</p>}
            </div>
        </DashboardLayout>
    );
};

export default TeacherDashboard;
