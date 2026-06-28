'use client';

import { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings, ChevronDown, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardNavbar({ onMenuClick, user, isMobile, isSidebarOpen }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ বেল আইকনে ক্লিক
    const handleBellClick = () => {
        router.push('/dashboard/owner/booking-requests');
    };

    // ✅ সার্চ হ্যান্ডেল
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-4 md:px-6 h-16">
                {/* বাম পাশে - মেনু বাটন */}
                <div className="flex items-center gap-3">
                    {/* মোবাইলে মেনু বাটন - খোলা থাকলে X দেখাবে */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
                        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
                    >
                        {isSidebarOpen ? (
                            <X className="size-5 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Menu className="size-5 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>

                    {/* ডেস্কটপে সার্চ */}
                    <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search properties..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pl-9 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* ডান পাশে - নোটিফিকেশন + প্রোফাইল */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* ✅ বেল আইকন - ক্লিক করলে booking requests পেজে যাবে */}
                    <button
                        onClick={handleBellClick}
                        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="View booking requests"
                    >
                        <Bell className="size-5 text-gray-700 dark:text-gray-300" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* ✅ ইউজার প্রোফাইল - শুধু নাম, ড্রপডাউন নেই */}
                    <div className="flex items-center gap-2 p-1.5 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user?.name || 'User'}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}