import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useStudentStore from '../../stores/studentStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { BookOpen, TrendingUp, ClipboardList, Megaphone } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const StudentDashboard = () => {
    const { courses, setCourses, grades, setGrades } = useStudentStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [coursesRes, gradesRes] = await Promise.all([
                    api.get('/student/courses'),
                    api.get('/student/grades')
                ]);
                if (coursesRes.data.success) setCourses(coursesRes.data.data);
                if (gradesRes.data.success) setGrades(gradesRes.data.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchData();
    }, []);

    const avgGpa = grades && grades.length > 0 ? (grades.reduce((a, g) => a + (g.student?.gpa || 0), 0) / grades.length).toFixed(2) : '—';

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Student Dashboard</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Your academic overview at a glance.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Enrolled Courses', value: (courses || []).length, icon: BookOpen, color: '#3b82f6' },
                    { label: 'Current GPA', value: avgGpa, icon: TrendingUp, color: '#10b981' },
                    { label: 'Pending Assignments', value: '—', icon: ClipboardList, color: '#f59e0b' },
                    { label: 'Announcements', value: '—', icon: Megaphone, color: '#8b5cf6' },
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

            {/* Recent Courses */}
            <div style={cardStyle}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Your Courses</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                    {(courses || []).slice(0, 6).map((c) => (
                        <div key={c.id} style={{ background: 'var(--bg-base)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.25rem 0' }}>{c.course?.name || c.name}</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>{c.course?.code || c.code} • Grade: {c.grade || '—'}</p>
                        </div>
                    ))}
                </div>
                {(!courses || courses.length === 0) && <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '2rem' }}>No courses enrolled.</p>}
            </div>
        </DashboardLayout>
    );
};

export default StudentDashboard;
