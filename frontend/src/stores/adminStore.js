import { create } from 'zustand';

const useAdminStore = create((set) => ({
    stats: null,
    users: [],
    departments: [],
    courses: [],
    logs: [],
    announcements: [],

    setStats: (stats) => set({ stats }),
    setUsers: (users) => set({ users }),
    setDepartments: (departments) => set({ departments }),
    setCourses: (courses) => set({ courses }),
    setLogs: (logs) => set({ logs }),
    setAnnouncements: (announcements) => set({ announcements }),

    addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
    removeUser: (id) => set((state) => ({ users: state.users.filter(u => u.id !== id) })),
    updateUserInStore: (updated) => set((state) => ({
        users: state.users.map(u => u.id === updated.id ? updated : u)
    }))
}));

export default useAdminStore;
