import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

interface DropdownProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
    label: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="text-white text-xl font-medium mb-2">
                {label}
            </div>

            <div
                className="w-full h-14 bg-zinc-300 rounded-[10px] flex items-center cursor-pointer hover:bg-zinc-400 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="ml-4 text-black text-xl font-medium truncate pr-12">
                    {value || "Select an option"}
                </div>

                <ChevronDownIcon className="w-8 h-8 absolute right-4 text-indigo-900 transition-transform duration-200" style={{
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
            </div>

            {isOpen && (
                <div className="w-full max-h-96 overflow-auto bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] absolute z-50 mt-2">
                    <div className="flex flex-col">
                        {options.map((option) => (
                            <div
                                key={option}
                                className="w-full h-10 bg-slate-700 text-white flex items-center justify-center text-xl font-normal cursor-pointer hover:bg-slate-600 transition-colors duration-200"
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dropdown;