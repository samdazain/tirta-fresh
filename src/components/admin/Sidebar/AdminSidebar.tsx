'use client';

import { useState } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdmin } from '@/contexts/AdminContext';
import LogoutModal from './LogoutModal';
import HoverHint from './HoverHint';
import {
    HomeIcon,
    CubeIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ArrowRightStartOnRectangleIcon,
    ChevronRightIcon,
    ChartBarIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    CubeIcon as CubeIconSolid,
    ClipboardDocumentListIcon as ClipboardIconSolid,
    DocumentTextIcon as DocumentIconSolid,
    Cog6ToothIcon as CogIconSolid,
} from '@heroicons/react/24/solid';

interface NavItemProps {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isVisible?: boolean;
}

function NavItem({ href, label, icon: Icon, activeIcon: ActiveIcon, isVisible = true }: NavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li className={`transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
            }`}>
            <Link
                href={href}
                className={`
                    group flex items-center px-4 py-3 mx-3 rounded-xl
                    transition-all duration-200 ease-in-out
                    ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }
                `}
            >
                <span className="mr-3">
                    {isActive ? (
                        <ActiveIcon className="h-5 w-5" />
                    ) : (
                        <Icon className="h-5 w-5" />
                    )}
                </span>
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {label}
                </span>
                {isActive && (
                    <ChevronRightIcon className="ml-auto h-4 w-4" />
                )}
            </Link>
        </li>
    );
}

export default function AdminSidebar() {
    const { user, logout } = useAdmin();
    const [isHovered, setIsHovered] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleLogoutConfirm = async () => {
        try {
            await logout();
            setShowLogoutModal(false);
        } catch (error) {
            console.error('Logout error:', error);
            throw error; // Re-throw to let modal handle the error state
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <aside
                className="w-64 min-h-screen bg-slate-900 shadow-xl border-r border-slate-800 transition-all duration-300 ease-in-out"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-800">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-lg">TF</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">Tirta Fresh</h1>
                            <p className="text-sm text-slate-400">Admin Panel</p>
                        </div>
                    </div>
                </div>

                {/* User Profile */}
                <div className="p-4 border-b border-slate-800">
                    <div className="flex items-center space-x-3 px-3 py-2">
                        <UserCircleIcon className="h-8 w-8 text-slate-400" />
                        <div>
                            <p className="text-sm font-medium text-white">
                                {user?.name || 'Admin User'}
                            </p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="mt-6 flex-1">
                    <div className="px-3">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Menu Utama
                        </p>
                    </div>

                    <ul className="space-y-1">
                        <NavItem
                            href="/admin/dashboard"
                            label="Dashboard"
                            icon={HomeIcon}
                            activeIcon={HomeIconSolid}
                        />
                        <NavItem
                            href="/admin/products"
                            label="Produk"
                            icon={CubeIcon}
                            activeIcon={CubeIconSolid}
                        />
                        <NavItem
                            href="/admin/orders"
                            label="Pesanan"
                            icon={ClipboardDocumentListIcon}
                            activeIcon={ClipboardIconSolid}
                        />
                        <NavItem
                            href="/admin/invoices"
                            label="Invoice"
                            icon={DocumentTextIcon}
                            activeIcon={DocumentIconSolid}
                        />
                        <NavItem
                            href="/admin/reports"
                            label="Laporan"
                            icon={ChartBarIcon}
                            activeIcon={ChartBarIcon}
                        />
                    </ul>

                    {/* Settings Section - Only visible on hover */}
                    <div className={`mt-8 px-3 transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
                        }`}>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Sistem
                        </p>
                    </div>

                    <ul className="space-y-1">
                        <NavItem
                            href="/admin/settings"
                            label="Pengaturan"
                            icon={Cog6ToothIcon}
                            activeIcon={CogIconSolid}
                            isVisible={isHovered}
                        />
                    </ul>
                </nav>

                {/* Logout Button - Only visible on hover */}
                <div className={`p-4 border-t border-slate-800 mt-auto transition-all duration-300 ease-in-out ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}>
                    <button
                        onClick={handleLogoutClick}
                        className="
                            w-full flex items-center px-4 py-3 rounded-xl
                            text-slate-400 hover:text-red-400 hover:bg-red-950/30
                            transition-all duration-200 ease-in-out
                            group
                        "
                    >
                        <ArrowRightStartOnRectangleIcon className="h-5 w-5 mr-3 group-hover:text-red-400 transition-colors" />
                        <span className="font-medium">Keluar</span>
                    </button>
                </div>

                <HoverHint isVisible={isHovered} />
                {/* Version Info */}
                <div className="p-4 border-t border-slate-800">
                    <div className="text-center">
                        <p className="text-xs text-slate-500">Tirta Fresh Admin</p>
                        <p className="text-xs text-slate-600">v1.0.0</p>
                    </div>
                </div>

                {/* Hover Indicator */}
                <div className={`absolute top-1/2 -right-1 w-2 h-16 bg-blue-500 rounded-l-full transition-all duration-300 ease-in-out transform -translate-y-1/2 ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`} />
            </aside>

            {/* Logout Confirmation Modal */}
            <LogoutModal
                isOpen={showLogoutModal}
                onConfirm={handleLogoutConfirm}
                onCancel={handleLogoutCancel}
                userName={user?.name}
            />
        </>
    );
}