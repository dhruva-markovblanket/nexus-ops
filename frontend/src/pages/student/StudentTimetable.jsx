import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useStudentStore from '../../stores/studentStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const StudentTimetable = () => {
    const { timetable, setTimetable } = useStudentStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/student/timetable'); if (res.data.success) setTimetable(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    const getSlot = (day, time) => {
        return (timetable || []).find(t => t.dayOfWeek === day && t.startTime === time);
    };

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Weekly Timetable</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Your weekly class schedule.</p>
            </div>
            <div style={{ ...cardStyle, overflowX: 'auto', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>Time</th>
                            {days.map(d => <th key={d} style={{ padding: '1rem', fontWeight: 600, fontSize: '0.8rem', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'center' }}>{d}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {timeSlots.map(time => (
                            <tr key={time}>
                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>{time}</td>
                                {days.map(day => {
                                    const slot = getSlot(day, time);
                                    return (
                                        <td key={day} style={{ padding: '0.5rem', border: '1px solid var(--border-subtle)', textAlign: 'center', verticalAlign: 'middle' }}>
                                            {slot ? (
                                                <div style={{ background: 'var(--accent-glow)', borderRadius: '6px', padding: '0.5rem', border: '1px solid rgba(139,92,246,0.2)' }}>
                                                    <p style={{ fontSize: '0.75rem', fontWeight: 600, margin: '0 0 0.15rem 0', color: 'var(--accent-purple)' }}>{slot.course?.code || '—'}</p>
                                                    <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', margin: 0 }}>{slot.room}</p>
                                                </div>
                                            ) : null}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
};

export default StudentTimetable;
