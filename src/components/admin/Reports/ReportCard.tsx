'use client';

import React from 'react';

interface ReportCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export default function ReportCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color = 'blue',
    trend
}: ReportCardProps) {
    const colorClasses = {
        blue: 'bg-blue-500 text-blue-600',
        green: 'bg-green-500 text-green-600',
        purple: 'bg-purple-500 text-purple-600',
        orange: 'bg-orange-500 text-orange-600',
        red: 'bg-red-500 text-red-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={`p-3 rounded-lg ${colorClasses[color].split(' ')[0]} bg-opacity-10`}>
                        <Icon className={`h-6 w-6 ${colorClasses[color].split(' ')[1]}`} />
                    </div>
                )}
            </div>

            {trend && (
                <div className="mt-4 flex items-center">
                    <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                    <span className="text-sm text-gray-500 ml-2">vs previous period</span>
                </div>
            )}
        </div>
    );
}