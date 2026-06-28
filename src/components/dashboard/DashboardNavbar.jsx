'use client';

import { useState } from 'react';
import { Menu, Bell, User, LogOut, Settings, ChevronDown, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

export default function DashboardNavbar({ onMenuClick, user, isMobile, isSidebarOpen }) {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // ✅ সার্চ হ্যান্ডেল
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // ✅ Logout হ্যান্ডেল - authClient.signOut() ব্যবহার
    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            await authClient.signOut();
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout');
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-4 md:px-6 h-16">
                {/* বাম পাশে - মেনু বাটন + সার্চ */}
                <div className="flex items-center gap-3">
                    {/* মোবাইলে মেনু বাটন */}
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

                {/* ডান পাশে - ইউজার প্রোফাইল */}
                <div className="flex items-center gap-2 md:gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            disabled={isLoggingOut}
                        >
                            {/* ইউজার ইমেজ */}
                            {user?.image ? (
                                <img
                                    src={user.image}
                                    alt={user.name || 'User'}
                                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = `
                                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                                                ${user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                        `;
                                    }}
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}

                            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.name || 'User'}
                            </span>
                            <ChevronDown className="hidden md:block size-4 text-gray-500" />
                        </button>

                        {/* ড্রপডাউন - শুধু Logout */}
                        {isDropdownOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setIsDropdownOpen(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 py-1">
                                    {/* ইউজার ইনফো */}
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-3">
                                            {user?.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.name || 'User'}
                                                    className="w-8 h-8 rounded-full object-cover border-2 border-emerald-500"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = `
                                                            <div class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                                                                ${user?.name?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                        `;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-semibold text-sm">
                                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ✅ Logout বাটন - ফাংশনাল */}
                                    <button
                                        onClick={() => {
                                            setIsDropdownOpen(false);
                                            handleLogout();
                                        }}
                                        disabled={isLoggingOut}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                                Logging out...
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="size-4" />
                                                Logout
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}