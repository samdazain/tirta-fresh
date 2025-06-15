'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProps } from '@/components/ui/Toast';

interface ToastContextType {
    showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastProviderProps {
    children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<(ToastProps & { id: string })[]>([]);

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const showToast = (message: string, type: ToastProps['type'], duration = 4000) => {
        const id = Math.random().toString(36).substring(2, 9);
        const newToast = {
            id,
            message,
            type,
            duration,
            onClose: removeToast
        };

        setToasts(prev => [...prev, newToast]);
    };

    const showSuccess = (message: string, duration?: number) => showToast(message, 'success', duration);
    const showError = (message: string, duration?: number) => showToast(message, 'error', duration);
    const showWarning = (message: string, duration?: number) => showToast(message, 'warning', duration);
    const showInfo = (message: string, duration?: number) => showToast(message, 'info', duration);

    return (
        <ToastContext.Provider value={{
            showToast,
            showSuccess,
            showError,
            showWarning,
            showInfo
        }}>
            {children}

            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-50 max-w-sm w-full">
                {toasts.map(toast => (
                    <Toast key={toast.id} {...toast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}