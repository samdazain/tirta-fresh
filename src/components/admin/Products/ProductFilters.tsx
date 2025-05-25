'use client';

import { memo } from 'react';
import { Search, Filter } from 'lucide-react';

interface ProductFiltersProps {
    searchTerm: string;
    categoryFilter: string;
    onSearchChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
}

const CATEGORY_OPTIONS = [
    { value: 'all', label: 'All Categories' },
    { value: 'gallon', label: 'Gallon' },
    { value: 'bottle', label: 'Bottle' },
    { value: 'glass', label: 'Glass' },
    { value: 'other', label: 'Other' },
] as const;

const ProductFilters = memo(({
    searchTerm,
    categoryFilter,
    onSearchChange,
    onCategoryChange
}: ProductFiltersProps) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
            <div className="flex-1">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={18} className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <select
                    value={categoryFilter}
                    onChange={(e) => onCategoryChange(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    {CATEGORY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    </div>
));

ProductFilters.displayName = 'ProductFilters';

export default ProductFilters;