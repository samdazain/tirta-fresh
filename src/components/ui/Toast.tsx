'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    onClose: (id: string) => void;
}

export function Toast({ id, message, type, duration = 4000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger entrance animation
        const timer = setTimeout(() => setIsVisible(true), 10);

        // Auto-close timer
        const closeTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            clearTimeout(closeTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for exit animation
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case 'error':
                return <XCircle className="h-5 w-5 text-red-400" />;
            case 'warning':
                return <AlertCircle className="h-5 w-5 text-yellow-400" />;
            default:
                return <AlertCircle className="h-5 w-5 text-blue-400" />;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200';
            default:
                return 'bg-blue-50 border-blue-200';
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'success':
                return 'text-green-800';
            case 'error':
                return 'text-red-800';
            case 'warning':
                return 'text-yellow-800';
            default:
                return 'text-blue-800';
        }
    };

    return (
        <div
            className={`
                flex items-center p-4 mb-3 rounded-lg border shadow-lg transition-all duration-300 ease-in-out
                ${getBackgroundColor()} ${getTextColor()}
                ${isVisible
                    ? 'transform translate-x-0 opacity-100'
                    : 'transform translate-x-full opacity-0'
                }
            `}
        >
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-medium">{message}</p>
            </div>
            <button
                onClick={handleClose}
                className="ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}