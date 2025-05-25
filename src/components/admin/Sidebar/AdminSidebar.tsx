'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    HomeIcon,
    CubeIcon,
    ClipboardDocumentListIcon,
    DocumentTextIcon,
    Cog6ToothIcon,
    ArrowRightStartOnRectangleIcon,
    UserCircleIcon
} from '@heroicons/react/24/outline';
import {
    HomeIcon as HomeIconSolid,
    CubeIcon as CubeIconSolid,
    ClipboardDocumentListIcon as ClipboardIconSolid,
    DocumentTextIcon as DocumentIconSolid,
    Cog6ToothIcon as CogIconSolid
} from '@heroicons/react/24/solid';

interface NavItemProps {
    href: string;
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    activeIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

function NavItem({ href, label, icon: Icon, activeIcon: ActiveIcon }: NavItemProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <li>
            <Link
                href={href}
                className={`
                    group flex items-center px-4 py-3 mx-3 rounded-xl
                    transition-all duration-200 ease-in-out
                    ${isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                    }
                `}
            >
                <span className="mr-3">
                    {isActive ? (
                        <ActiveIcon className="h-5 w-5" />
                    ) : (
                        <Icon className="h-5 w-5 group-hover:text-blue-600 transition-colors" />
                    )}
                </span>
                <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {label}
                </span>
                {isActive && (
                    <span className="ml-auto">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                    </span>
                )}
            </Link>
        </li>
    );
}

export default function AdminSidebar() {
    const handleLogout = async () => {
        try {
            await fetch('/api/admin/auth/logout', {
                method: 'POST',
            });

            // Redirect to login page
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <aside className="w-64 min-h-screen bg-slate-900 shadow-xl border-r border-slate-800">
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
                        <p className="text-sm font-medium text-white">Admin User</p>
                        <p className="text-xs text-slate-400">Administrator</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex-1">
                <div className="px-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
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
                </ul>

                {/* Settings Section */}
                <div className="mt-8 px-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        Pengaturan
                    </p>
                </div>

                <ul className="space-y-1">
                    <NavItem
                        href="/admin/settings"
                        label="Pengaturan"
                        icon={Cog6ToothIcon}
                        activeIcon={CogIconSolid}
                    />
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-800 mt-auto">
                <button
                    onClick={handleLogout}
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

            {/* Version Info */}
            <div className="p-4 border-t border-slate-800">
                <div className="text-center">
                    <p className="text-xs text-slate-500">
                        Version 1.0.0
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                        © 2024 Tirta Fresh
                    </p>
                </div>
            </div>
        </aside>
    );
}