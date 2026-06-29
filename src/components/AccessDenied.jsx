// components/AccessDenied.jsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Home, ArrowLeft, AlertTriangle, Building2 } from 'lucide-react';
import { useSession } from '@/lib/auth-client';

export default function AccessDenied({ role = 'tenant' }) {
    const router = useRouter();
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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.2,
            },
        },
    };

    const alertVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.4,
            },
        },
    };

    const titleVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut",
            },
        },
    };

    const textVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: 0.4,
                ease: "easeOut",
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                delay: 0.5,
                ease: "easeOut",
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1,
            },
        },
    };

    const dividerVariants = {
        hidden: { width: 0 },
        visible: {
            width: 48,
            transition: {
                duration: 0.6,
                delay: 0.3,
                ease: "easeOut",
            },
        },
    };

    const dotVariants = {
        hidden: { scale: 0 },
        visible: {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.4,
            },
        },
    };

    return (
        <motion.div
            className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 px-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="relative mb-6">
                    <motion.div
                        className="w-28 h-28 mx-auto bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20 rounded-full flex items-center justify-center shadow-lg shadow-red-500/10"
                        variants={iconVariants}
                    >
                        <Shield className="w-14 h-14 text-red-600 dark:text-red-400" />
                    </motion.div>
                    <motion.div
                        className="absolute -top-2 -right-2"
                        variants={alertVariants}
                    >
                        <AlertTriangle className="w-8 h-8 text-amber-500" />
                    </motion.div>
                </div>

                {/* Title */}
                <motion.h1
                    className="text-4xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight"
                    variants={titleVariants}
                >
                    Access Denied
                </motion.h1>

                {/* Divider */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <motion.div
                        className="w-12 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                        variants={dividerVariants}
                    />
                    <motion.div
                        className="w-2 h-2 bg-blue-600 rounded-full"
                        variants={dotVariants}
                    />
                    <motion.div
                        className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        variants={dividerVariants}
                    />
                </div>

                {/* Message */}
                <motion.p
                    className="text-gray-600 dark:text-gray-400 mb-3 text-lg"
                    variants={textVariants}
                >
                    You don't have permission to access this page.
                </motion.p>

                {user && (
                    <motion.p
                        className="text-sm text-gray-500 dark:text-gray-500 mb-6"
                        variants={textVariants}
                    >
                        Your current role: <span className="font-semibold capitalize text-blue-600 dark:text-blue-400">{getRoleName()}</span>
                    </motion.p>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Link
                            href={getDashboardLink()}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/30 w-full text-sm"
                        >
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Link>
                    </motion.div>

                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all w-full text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </motion.div>

                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/30 w-full text-sm"
                        >
                            <Building2 className="w-4 h-4" />
                            Home
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}