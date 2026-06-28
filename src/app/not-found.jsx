// app/not-found.jsx

"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Building2 } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 px-4">
            <div className="max-w-md w-full text-center">
                {/* 404 Animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="relative mb-8"
                >
                    <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 select-none">
                        404
                    </div>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Building2 className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
                >
                    Page Not Found
                </motion.h1>

                {/* Message */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 dark:text-gray-400 mb-8"
                >
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </motion.p>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                    >
                        <Home className="w-4 h-4" />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>

                    <Link
                        href="/all-properties"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/25"
                    >
                        <Search className="w-4 h-4" />
                        Browse Properties
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}