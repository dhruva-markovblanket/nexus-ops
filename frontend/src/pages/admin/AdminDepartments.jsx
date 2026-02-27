import React, { useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import useAdminStore from '../../stores/adminStore';
import useUiStore from '../../stores/uiStore';
import api from '../../utils/api';
import { Building2 } from 'lucide-react';

const cardStyle = { background: 'var(--bg-surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' };

const AdminDepartments = () => {
    const { departments, setDepartments } = useAdminStore();
    const { setLoading } = useUiStore();

    useEffect(() => {
        const fetchDepartments = async () => {
            setLoading(true);
            try {
                const res = await api.get('/admin/departments');
                if (res.data.success) setDepartments(res.data.data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchDepartments();
    }, []);

    return (
        <DashboardLayout role="admin">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Departments</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage academic departments and their leadership.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {(departments || []).map((dept) => (
                    <div key={dept.id} style={cardStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Building2 size={22} color="var(--accent-purple)" />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>{dept.name}</h3>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: 0 }}>Department ID: {dept.id.substring(0, 8)}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            <span>Head: {dept.head?.user?.name || 'Not assigned'}</span>
                            <span>{dept._count?.users || 0} members</span>
                        </div>
                    </div>
                ))}
                {(!departments || departments.length === 0) && (
                    <div style={{ ...cardStyle, textAlign: 'center', color: 'var(--text-tertiary)', padding: '3rem' }}>No departments found.</div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminDepartments;
