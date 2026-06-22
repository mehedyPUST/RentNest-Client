// app/dashboard/owner/page.jsx
'use client';

import React from 'react';

import { Building2, CalendarCheck, DollarSign } from 'lucide-react';
import { OwnerDashboardStats } from '@/components/dashboard/OwnerDashboardStats';

export default function OwnerDashboardHomePage() {
    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Welcome back, John! 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Here's an overview of your property business.
                </p>
            </div>

            {/* Main Stats - 3 Cards */}
            <OwnerDashboardStats />

            {/* Extended Stats - 6 Cards (Optional) */}


            {/* Recent Activity & Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Recent Bookings
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">Sunset Villa - John Doe</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago • $450</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                                Confirmed
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">Ocean View - Sarah Smith</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago • $620</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full">
                                Pending
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-700 dark:text-gray-300">Mountain Retreat - Mike Johnson</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">5 days ago • $380</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                                Checked In
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors text-blue-700 dark:text-blue-400 font-medium">
                            <Building2 className="size-5" />
                            Add New Property
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors text-green-700 dark:text-green-400 font-medium">
                            <CalendarCheck className="size-5" />
                            View All Bookings
                        </button>
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors text-purple-700 dark:text-purple-400 font-medium">
                            <DollarSign className="size-5" />
                            View Earnings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}