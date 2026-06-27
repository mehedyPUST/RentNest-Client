// app/dashboard/owner/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import {
    Building2,
    CalendarCheck,
    DollarSign,
    Calendar,
    TrendingUp,
    Plus,
    Loader2,
    AlertCircle,
    RefreshCw,
    User,
    Eye
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function OwnerDashboardHomePage() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user || null;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalProperties: 0,
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        monthlyEarnings: [],
        recentBookings: []
    });
    const [timeFrame, setTimeFrame] = useState('12');

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // ✅ Fetch dashboard data
    const fetchDashboardData = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const ownerId = user.id || user._id;
            const response = await fetch(`${API_URL}/api/owner/stats/${ownerId}`, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const data = await response.json();

            if (data.success) {
                setStats({
                    totalEarnings: data.stats?.totalEarnings || 0,
                    totalProperties: data.stats?.totalProperties || 0,
                    totalBookings: data.stats?.totalBookings || 0,
                    pendingBookings: data.stats?.pendingBookings || 0,
                    confirmedBookings: data.stats?.confirmedBookings || 0,
                    monthlyEarnings: data.stats?.monthlyEarnings || [],
                    recentBookings: data.stats?.recentBookings || []
                });
            } else {
                throw new Error(data.message || 'Failed to fetch stats');
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    // ✅ Filter monthly earnings by time frame
    const getFilteredData = () => {
        const months = parseInt(timeFrame);
        const data = stats.monthlyEarnings || [];
        return data.slice(-months);
    };

    // ✅ Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    // ✅ Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    // ✅ Custom Tooltip for Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
                    <p className="text-lg font-bold text-emerald-600">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // ✅ Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // ✅ Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                        Try Again
                    </button>
                </div>
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
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your dashboard.</p>
                    <Link href="/login" className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Check if user is owner
    if (user.role?.toLowerCase() !== 'owner') {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                    <div className="text-5xl mb-4">⛔</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400">You do not have permission to view this dashboard.</p>
                    <Link href="/dashboard" className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const chartData = getFilteredData();

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome back, {user?.name || 'Owner'}! 👋
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Here's an overview of your property business.
                    </p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Main Stats - 4 Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
                            <p className="text-2xl font-bold text-emerald-600">
                                {formatCurrency(stats.totalEarnings)}
                            </p>
                        </div>
                        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Properties</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.totalProperties}
                            </p>
                        </div>
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                            <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.totalBookings}
                            </p>
                        </div>
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {stats.confirmedBookings} confirmed · {stats.pendingBookings} pending
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats.totalBookings > 0
                                    ? Math.round((stats.confirmedBookings / stats.totalBookings) * 100)
                                    : 0}%
                            </p>
                        </div>
                        <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ✅ Monthly Earnings Chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800"
            >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                            Monthly Earnings
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {chartData.length} months · Total: {formatCurrency(stats.totalEarnings)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTimeFrame('6')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${timeFrame === '6'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            6M
                        </button>
                        <button
                            onClick={() => setTimeFrame('12')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${timeFrame === '12'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            12M
                        </button>
                        <button
                            onClick={() => setTimeFrame('24')}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${timeFrame === '24'
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            24M
                        </button>
                    </div>
                </div>

                {chartData.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📊</div>
                        <p className="text-gray-500 dark:text-gray-400">No earnings data available yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Start getting bookings to see your earnings</p>
                    </div>
                ) : (
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="earnings"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fill="url(#colorEarnings)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        Recent Bookings
                    </h3>
                    {stats.recentBookings?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentBookings.slice(0, 5).map((booking, index) => (
                                <div
                                    key={booking._id || index}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/dashboard/owner/bookings/${booking._id}`)}
                                >
                                    <div className={`w-2 h-2 rounded-full ${booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'approved'
                                            ? 'bg-green-500'
                                            : booking.bookingStatus === 'pending'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}></div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 dark:text-gray-300">
                                            {booking.propertyInfo?.title || 'Property'} - {booking.tenantInfo?.name || 'Unknown'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(booking.createdAt)} • {formatCurrency(booking.propertyInfo?.price)}
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'approved'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                            : booking.bookingStatus === 'pending'
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                        }`}>
                                        {booking.bookingStatus || 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">No recent bookings</p>
                        </div>
                    )}
                    <Link
                        href="/dashboard/owner/booking-requests"
                        className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        View Booking Requests →
                    </Link>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-[#18181b] rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/owner/add-property"
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors text-blue-700 dark:text-blue-400 font-medium"
                        >
                            <Building2 className="size-5" />
                            Add New Property
                        </Link>
                        <Link
                            href="/dashboard/owner/bookings"
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors text-green-700 dark:text-green-400 font-medium"
                        >
                            <CalendarCheck className="size-5" />
                            View All Bookings
                        </Link>
                        <Link
                            href="/dashboard/owner/my-properties"
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors text-purple-700 dark:text-purple-400 font-medium"
                        >
                            <Eye className="size-5" />
                            My Properties
                        </Link>
                        <Link
                            href="/dashboard/owner/profile"
                            className="w-full flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors text-orange-700 dark:text-orange-400 font-medium"
                        >
                            <User className="size-5" />
                            Update Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
