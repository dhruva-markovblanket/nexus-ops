import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useStudentStore from '../../stores/studentStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { FileText, Clock, CheckCircle } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const StudentAssignments = () => {
    const { assignments, setAssignments } = useStudentStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try { const res = await api.get('/student/assignments'); if (res.data.success) setAssignments(res.data.data); }
            catch (err) { console.error(err); } finally { setLoading(false); }
        }; fetch();
    }, []);

    return (
        <DashboardLayout role="student">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Assignments</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Track your assignments and submissions.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {(assignments || []).map((a) => {
                    const isPastDue = new Date(a.dueDate) < new Date();
                    const hasSubmission = a.submissions && a.submissions.length > 0;
                    return (
                        <div key={a.id} style={{ ...cardStyle, borderLeft: `3px solid ${hasSubmission ? '#10b981' : isPastDue ? '#ef4444' : '#f59e0b'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <FileText size={16} color="var(--accent-purple)" />
                                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{a.title}</h3>
                                    </div>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>{a.description}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={12} /> Due: {new Date(a.dueDate).toLocaleDateString()}</span>
                                        <span>Max: {a.maxMarks} marks</span>
                                        <span>Course: {a.course?.name || '—'}</span>
                                    </div>
                                </div>
                                <div>
                                    {hasSubmission ? (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: '#10b981', fontWeight: 600 }}><CheckCircle size={14} /> Submitted ({a.submissions[0].marks || '—'}/{a.maxMarks})</span>
                                    ) : (
                                        <span style={{ fontSize: '0.8rem', color: isPastDue ? '#ef4444' : '#f59e0b', fontWeight: 600 }}>{isPastDue ? 'Past Due' : 'Pending'}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {(!assignments || assignments.length === 0) && <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No assignments found.</div>}
            </div>
        </DashboardLayout>
    );
};

export default StudentAssignments;
