'use client';

import React from 'react';

interface Column {
    key: string;
    title: string;
    render?: (value: any, row: any) => React.ReactNode;
    align?: 'left' | 'center' | 'right';
}

interface ReportTableProps {
    title: string;
    columns: Column[];
    data: any[];
    maxRows?: number;
}

export default function ReportTable({ title, columns, data, maxRows = 10 }: ReportTableProps) {
    const displayData = maxRows ? data.slice(0, maxRows) : data;

    const formatValue = (value: any) => {
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return value;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${column.align === 'right' ? 'text-right' :
                                            column.align === 'center' ? 'text-center' : 'text-left'
                                        }`}
                                >
                                    {column.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {displayData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${column.align === 'right' ? 'text-right' :
                                                column.align === 'center' ? 'text-center' : 'text-left'
                                            }`}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : formatValue(row[column.key])
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {data.length > maxRows && (
                <div className="px-6 py-3 bg-gray-50 text-center">
                    <p className="text-sm text-gray-500">
                        Showing {maxRows} of {data.length} entries
                    </p>
                </div>
            )}
        </div>
    );
}