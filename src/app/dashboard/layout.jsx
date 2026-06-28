'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const checkScreen = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-950">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
            {/* সাইডবার */}
            <DashboardSidebar
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
                isMobile={isMobile}
            />

            {/* ডান পাশের কন্টেন্ট */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* নাভবার */}
                <DashboardNavbar
                    onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                    user={session?.user}
                    isMobile={isMobile}
                    isSidebarOpen={sidebarOpen}
                />

                {/* মেইন কন্টেন্ট */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}