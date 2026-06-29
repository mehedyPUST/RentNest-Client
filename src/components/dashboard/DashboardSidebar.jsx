// components/dashboard/DashboardSidebar.jsx
'use client';

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, LogOut, Home } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    House,
    Search,
    PlusCircle,
    FileText,
    User,
    CalendarCheck,
    Heart,
    LayoutDashboard,
    Users,
    Building,
    BookOpen,
    CreditCard,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";

export default function DashboardSidebar({ isOpen, setIsOpen, isMobile }) {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session } = useSession();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const userRole = session?.user?.role?.toLowerCase() || 'tenant';

    // ✅ লগআউট হ্যান্ডেল
    const handleLogout = async () => {
        if (isLoggingOut) return;

        try {
            setIsLoggingOut(true);
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    let navItems = [];

    if (userRole === 'tenant') {
        navItems = [
            { icon: House, href: '/dashboard/tenant', label: "Dashboard Home" },
            { icon: CalendarCheck, href: '/dashboard/tenant/my-bookings', label: "My Bookings" },
            { icon: Heart, href: '/dashboard/tenant/favorites', label: "Favorites" },
            { icon: User, href: '/dashboard/tenant/profile', label: "Profile" },
        ];
    } else if (userRole === 'owner') {
        navItems = [
            { icon: House, href: '/dashboard/owner', label: "Dashboard Home" },
            { icon: Search, href: '/dashboard/owner/my-properties', label: "My Properties" },
            { icon: PlusCircle, href: '/dashboard/owner/add-property', label: "Add a New Property" },
            { icon: FileText, href: '/dashboard/owner/booking-requests', label: "Booking Requests" },
            { icon: User, href: '/dashboard/owner/profile', label: "Profile" },
        ];
    } else if (userRole === 'admin') {
        navItems = [
            { icon: LayoutDashboard, href: '/dashboard/admin', label: "Dashboard Home" },
            { icon: Users, href: '/dashboard/admin/all-users', label: "All Users" },
            { icon: Building, href: '/dashboard/admin/all-properties', label: "All Properties" },
            { icon: BookOpen, href: '/dashboard/admin/all-bookings', label: "All Bookings" },
            { icon: CreditCard, href: '/dashboard/admin/transactions', label: "Transactions" },
            { icon: User, href: '/dashboard/admin/profile', label: "Profile" },
        ];
    }

    // ✅ সাইডবার কন্টেন্ট
    const SidebarContent = () => (
        <>
            {/* ✅ হেডার - h-16 fixed (Navbar এর সাথে match) */}
            <div className={`h-16 flex items-center px-4 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'justify-center' : ''}`}>
                <Link
                    href="/"
                    className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}
                >
                    {!isCollapsed ? (
                        <>
                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                                <Home className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Rent<span className="text-emerald-600">Nest</span>
                            </span>
                        </>
                    ) : (
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            RN
                        </span>
                    )}
                </Link>
            </div>

            {/* নেভিগেশন */}
            <div className="flex-1 overflow-y-auto p-3">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                        return (
                            <Link
                                href={item.href}
                                key={item.label}
                                onClick={() => {
                                    if (isMobile) {
                                        setIsOpen(false);
                                    }
                                }}
                                className={`
                                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200
                                    ${isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                                    }
                                    ${isCollapsed ? 'justify-center px-2' : ''}
                                    group relative
                                `}
                            >
                                <item.icon className={`size-5 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />

                                {!isCollapsed && (
                                    <span className="truncate">{item.label}</span>
                                )}

                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* কল্যাপস + লগআউট */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
                {!isMobile && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-sm"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="size-4" />
                        ) : (
                            <>
                                <ChevronLeft className="size-4" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                )}

                {/* লগআউট বাটন */}
                <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                        ${isLoggingOut
                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                            : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                        }
                        ${isCollapsed ? 'justify-center' : ''}
                    `}
                >
                    {isLoggingOut ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                            {!isCollapsed && <span>Logging out...</span>}
                        </>
                    ) : (
                        <>
                            <LogOut className="size-4" />
                            {!isCollapsed && <span>Logout</span>}
                        </>
                    )}
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* ডেস্কটপ সাইডবার */}
            <aside
                className={`
                    hidden lg:flex flex-col h-screen sticky top-0 border-r border-gray-200 dark:border-gray-800 
                    bg-white dark:bg-gray-950 transition-all duration-300 shrink-0
                    ${isCollapsed ? 'w-16' : 'w-64'}
                `}
            >
                <SidebarContent />
            </aside>

            {/* মোবাইল সাইডবার */}
            {isMobile && isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-0 left-0 h-full w-72 bg-white dark:bg-gray-950 shadow-2xl">
                        <div className="flex flex-col h-full">
                            {/* মোবাইল হেডার - h-16 */}
                            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
                                <Link href="/" className="flex items-center gap-3">
                                    {/* ✅ মোবাইলেও Home Icon দেখাবে */}
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                                        <Home className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                                        Rent<span className="text-emerald-600">Nest</span>
                                    </span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                >
                                    <X className="size-5 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>

                            {/* মোবাইল নেভিগেশন */}
                            <div className="flex-1 overflow-y-auto p-3">
                                <nav className="space-y-1">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                                        return (
                                            <Link
                                                href={item.href}
                                                key={item.label}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                }}
                                                className={`
                                                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors
                                                    ${isActive
                                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
                                                    }
                                                `}
                                            >
                                                <item.icon className={`size-5 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : ''}`} />
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>

                            {/* মোবাইল লগআউট */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors
                                        ${isLoggingOut
                                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
                                        }
                                    `}
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                                            <span>Logging out...</span>
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="size-5" />
                                            <span>Logout</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}