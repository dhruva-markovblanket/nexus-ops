import { create } from 'zustand';

const useAuthStore = create((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,

    login: (userData, token) => {
        localStorage.setItem('nexus_token', token);
        set({
            user: userData,
            token: token,
            isAuthenticated: true,
        });
    },

    logout: () => {
        localStorage.removeItem('nexus_token');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    },

    hydrate: (userData, token) => {
        set({
            user: userData,
            token: token,
            isAuthenticated: !!token,
        });
    }
}));

export default useAuthStore;
