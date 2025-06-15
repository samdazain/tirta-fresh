'use client';

import React from 'react';

interface DataPoint {
    label: string;
    value: number;
    color?: string;
}

interface ReportChartProps {
    title: string;
    data: DataPoint[];
    type: 'bar' | 'line' | 'pie';
    height?: number;
}

export default function ReportChart({ title, data, type, height = 300 }: ReportChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
                <div className="flex items-center justify-center h-64 text-gray-500">
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));

    const renderBarChart = () => (
        <div className="space-y-4">
            {data.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                    <div className="w-20 text-sm text-gray-600 text-right">{item.label}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 relative">
                        <div
                            className={`h-4 rounded-full transition-all duration-500 ${item.color || 'bg-blue-500'
                                }`}
                            style={{
                                width: `${(item.value / maxValue) * 100}%`
                            }}
                        />
                    </div>
                    <div className="w-20 text-sm font-medium text-gray-900">
                        {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderLineChart = () => (
        <div className="relative" style={{ height: `${height}px` }}>
            <svg width="100%" height="100%" className="overflow-visible">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Grid lines */}
                {[...Array(5)].map((_, i) => (
                    <line
                        key={i}
                        x1="0"
                        y1={i * (height / 4)}
                        x2="100%"
                        y2={i * (height / 4)}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                    />
                ))}

                {/* Line path */}
                <path
                    d={data.map((point, index) => {
                        const x = (index / (data.length - 1)) * 100;
                        const y = height - (point.value / maxValue) * height;
                        return `${index === 0 ? 'M' : 'L'} ${x}% ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Data points */}
                {data.map((point, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = height - (point.value / maxValue) * height;
                    return (
                        <circle
                            key={index}
                            cx={`${x}%`}
                            cy={y}
                            r="4"
                            fill="rgb(59, 130, 246)"
                            stroke="white"
                            strokeWidth="2"
                        />
                    );
                })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2">
                {data.map((point, index) => (
                    <span key={index} className="text-xs text-gray-500">
                        {point.label}
                    </span>
                ))}
            </div>
        </div>
    );

    const renderPieChart = () => {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let currentAngle = 0;
        const radius = 80;
        const centerX = 100;
        const centerY = 100;

        return (
            <div className="flex items-center space-x-8">
                <svg width="200" height="200" viewBox="0 0 200 200">
                    {data.map((item, index) => {
                        // const percentage = (item.value / total) * 100;
                        const angle = (item.value / total) * 360;
                        const startAngle = currentAngle;
                        const endAngle = currentAngle + angle;

                        const x1 = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                        const y1 = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                        const x2 = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
                        const y2 = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);

                        const largeArcFlag = angle > 180 ? 1 : 0;

                        const pathData = [
                            `M ${centerX} ${centerY}`,
                            `L ${x1} ${y1}`,
                            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                            'Z'
                        ].join(' ');

                        currentAngle += angle;

                        const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'];

                        return (
                            <path
                                key={index}
                                d={pathData}
                                fill={colors[index % colors.length]}
                                stroke="white"
                                strokeWidth="2"
                            />
                        );
                    })}
                </svg>

                <div className="space-y-2">
                    {data.map((item, index) => {
                        const percentage = ((item.value / total) * 100).toFixed(1);
                        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500'];

                        return (
                            <div key={index} className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`} />
                                <span className="text-sm text-gray-600">{item.label}</span>
                                <span className="text-sm font-medium">{percentage}%</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

            {type === 'bar' && renderBarChart()}
            {type === 'line' && renderLineChart()}
            {type === 'pie' && renderPieChart()}
        </div>
    );
}