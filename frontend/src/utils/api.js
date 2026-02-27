import axios from 'axios';
import useAuthStore from '../stores/authStore';
import useUiStore from '../stores/uiStore';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 & Global Errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const uiStore = useUiStore.getState();
        const authStore = useAuthStore.getState();

        if (error.response?.status === 401) {
            // Token expired or invalid
            authStore.logout();
            uiStore.addToast('Session expired. Please log in again.', 'error');
            window.location.href = '/'; // Force redirect to login
        } else if (error.response?.status === 403) {
            uiStore.addToast('Access denied. Insufficient permissions.', 'error');
        } else {
            const message = error.response?.data?.error || 'A network error occurred.';
            uiStore.addToast(message, 'error');
        }

        return Promise.reject(error);
    }
);

export default api;
