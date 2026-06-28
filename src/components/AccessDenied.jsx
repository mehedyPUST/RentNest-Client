// components/AccessDenied.jsx
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Home, ArrowLeft, AlertTriangle, Building2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export default function AccessDenied({ role = 'tenant' }) {
    const { data: session } = useSession();
    const user = session?.user;

    const getDashboardLink = () => {
        const userRole = user?.role?.toLowerCase() || 'tenant';
        if (userRole === 'admin') return '/dashboard/admin';
        if (userRole === 'owner') return '/dashboard/owner';
        return '/dashboard/tenant';
    };

    const getRoleName = () => {
        const userRole = user?.role?.toLowerCase() || 'tenant';
        if (userRole === 'admin') return 'Admin';
        if (userRole === 'owner') return 'Owner';
        return 'Tenant';
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="relative mb-6"
                >
                    <div className="w-28 h-28 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <Shield className="w-14 h-14 text-red-600 dark:text-red-400" />
                    </div>
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
                        className="absolute -top-2 -right-2"
                    >
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                    </motion.div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                >
                    Access Denied
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 dark:text-gray-400 mb-2"
                >
                    You don't have permission to access this page.
                </motion.p>

                {user && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.45 }}
                        className="text-sm text-gray-500 dark:text-gray-500 mb-6"
                    >
                        Your current role: <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">{getRoleName()}</span>
                    </motion.p>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link
                        href={getDashboardLink()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                    >
                        <Home className="w-4 h-4" />
                        Go to Dashboard
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
                    >
                        <Building2 className="w-4 h-4" />
                        Home
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}