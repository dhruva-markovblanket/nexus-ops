import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useStudentStore from '../../stores/studentStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { Calendar, Clock, MapPin } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const StudentExams = () => {
    const { exams, setExams } = useStudentStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/student/exams'); if (res.data.success) setExams(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    const now = new Date();
    const upcoming = (exams || []).filter(e => new Date(e.date) >= now);
    const past = (exams || []).filter(e => new Date(e.date) < now);

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Examinations</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Upcoming and past examination schedule.</p>
            </div>

            {upcoming.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#10b981' }}>Upcoming Exams</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {upcoming.map(exam => (
                            <div key={exam.id} style={{ ...cardStyle, borderLeft: '3px solid #10b981' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.75rem 0' }}>{exam.course?.name || '—'}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={14} /> {new Date(exam.date).toLocaleDateString()}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={14} /> {exam.duration} min • {exam.type}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} /> {exam.room}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {past.length > 0 && (
                <div>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-tertiary)' }}>Past Exams</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                        {past.map(exam => (
                            <div key={exam.id} style={{ ...cardStyle, opacity: 0.7 }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 0 0.5rem 0' }}>{exam.course?.name || '—'}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>{new Date(exam.date).toLocaleDateString()} • {exam.type}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(!exams || exams.length === 0) && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No exams scheduled.</div>}
        </DashboardLayout>
    );
};

export default StudentExams;
