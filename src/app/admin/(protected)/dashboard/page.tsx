'use client';

import DashboardHeader from '@/components/admin/Dashboard/DashboardHeader';
import DashboardStats from '@/components/admin/Dashboard/DashboardStats';
import RecentOrders from '@/components/admin/Dashboard/RecentOrders';
import QuickActions from '@/components/admin/Dashboard/QuickActions';

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Dashboard Header */}
            <DashboardHeader />

            {/* Stats Cards */}
            <DashboardStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <RecentOrders />
                </div>

                {/* Quick Actions - Takes 1 column */}
                <div className="lg:col-span-1">
                    <QuickActions />
                </div>
            </div>
        </div>
    );
}