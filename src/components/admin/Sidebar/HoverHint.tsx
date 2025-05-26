'use client';

import { ChevronUpIcon } from '@heroicons/react/24/outline';

interface HoverHintProps {
    isVisible: boolean;
}

export default function HoverHint({ isVisible }: HoverHintProps) {
    if (isVisible) return null;

    return (
        <div className="flex justify-center py-2 animate-pulse">
            <div className="flex items-center space-x-1 text-slate-600">
                <span className="text-xs">Hover for more</span>
                <ChevronUpIcon className="h-3 w-3 animate-bounce" />
            </div>
        </div>
    );
}