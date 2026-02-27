import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useUiStore from '../stores/uiStore';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const Toast = () => {
    const { toasts, removeToast } = useUiStore();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none w-full max-w-sm">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <ToastItem
                        key={toast.id}
                        toast={toast}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
};

const ToastItem = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000); // Auto dismiss after 5 seconds

        return () => clearTimeout(timer);
    }, [onClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'info':
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getBorderColor = () => {
        switch (toast.type) {
            case 'success': return 'border-emerald-500/50';
            case 'error': return 'border-red-500/50';
            case 'info':
            default: return 'border-blue-500/50';
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`bg-[#18181b] border ${getBorderColor()} shadow-2xl rounded-xl p-4 flex items-start gap-3 pointer-events-auto`}
        >
            <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
            </div>
            <div className="flex-1 pr-2 mt-0.5">
                <p className="text-sm font-medium text-white">{toast.message}</p>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 text-zinc-500 hover:text-white transition-colors"
            >
                <X className="w-4 h-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
