'use client';

import { useEffect, useState } from 'react';

interface DebugInfoProps {
    show?: boolean;
}

export default function DebugInfo({ show = process.env.NODE_ENV === 'development' }: DebugInfoProps) {
    const [debugInfo, setDebugInfo] = useState('Loading...');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('/api/admin/auth/session');
                const data = await response.json();
                setDebugInfo(`Session: ${JSON.stringify(data, null, 2)}`);
            } catch (error) {
                setDebugInfo(`Session error: ${error}`);
            }
        };

        if (show) {
            checkSession();
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Debug Information</h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono">
                {debugInfo}
            </pre>
        </div>
    );
}