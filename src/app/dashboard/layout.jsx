'use client';

import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { useSession } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardSidebar />
            <main className="flex-1 p-3 md:p-4 overflow-y-auto"> {/* প্যাডিং কমানো */}
                {children}
            </main>
        </div>
    );
}