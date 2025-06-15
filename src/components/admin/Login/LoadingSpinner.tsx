'use client';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-6 w-6',
        large: 'h-8 w-8'
    };

    return (
        <div className="flex justify-center items-center">
            <div
                className={`${sizeClasses[size]} border-2 border-white border-t-transparent rounded-full animate-spin`}
            />
        </div>
    );
}