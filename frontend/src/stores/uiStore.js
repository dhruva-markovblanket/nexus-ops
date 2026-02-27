import { create } from 'zustand';

const useUiStore = create((set) => ({
    isLoading: false,
    globalError: null,
    toasts: [], // { id, type: 'success'|'error'|'info', message }

    setLoading: (state) => set({ isLoading: state }),
    setError: (error) => set({ globalError: error }),
    clearError: () => set({ globalError: null }),

    addToast: (message, type = 'info') => set((state) => ({
        toasts: [...state.toasts, { id: Date.now().toString(), message, type }]
    })),

    removeToast: (id) => set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
    })),
}));

export default useUiStore;
