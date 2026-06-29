// app/dashboard/owner/profile/page.jsx
'use client';

import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied';
import UserProfile from "@/components/UserProfile/UserProfile";

export default function OwnerProfilePage() {
    const { data: session, status } = useSession();
    const user = session?.user;

    // ✅ Loading state
    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // ✅ Not authenticated
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view this page.</p>
                </div>
            </div>
        );
    }

    // ✅ ✅ ✅ Role Check - Owner
    if (user.role?.toLowerCase() !== 'owner') {
        return <AccessDenied role="owner" />;
    }

    return <UserProfile role="owner" />;
}