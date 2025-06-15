'use client';

import { useState, FormEvent } from 'react';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

interface LoginFormProps {
    onSubmit: (username: string, password: string) => Promise<void>;
    loading: boolean;
    error: string;
}

export default function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit(username, password);
    };

    return (
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/20">
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center space-x-3 animate-fade-in">
                    <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700">
                        Email atau Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Masukkan email atau username"
                            required
                            disabled={loading}
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <LockClosedIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                            placeholder="Masukkan password"
                            required
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed cursor-pointer hover:cursor-pointer disabled:hover:cursor-not-allowed"
                        >
                            {showPassword ? (
                                <EyeSlashIcon className="h-5 w-5" />
                            ) : (
                                <EyeIcon className="h-5 w-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading || !username.trim() || !password.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-[1.02] disabled:transform-none cursor-pointer"
                >
                    {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                            <LoadingSpinner size="small" />
                            <span>Masuk...</span>
                        </div>
                    ) : (
                        'Masuk ke Admin Panel'
                    )}
                </button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                    Hubungi administrator jika mengalami kesulitan login
                </p>
            </div>
        </div>
    );
}