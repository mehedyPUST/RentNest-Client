// app/dashboard/admin/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import {
    Users,
    Building2,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Home,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    RefreshCw,
    UserPlus,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import AccessDenied from '@/components/AccessDenied';

const AdminDashboardHomePage = () => {
    const { data: session, status } = useSession();
    const user = session?.user;

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProperties: 0,
        pendingProperties: 0,
        totalBookings: 0,
        confirmedBookings: 0,
        totalRevenue: 0,
        monthlyGrowth: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchDashboardData = async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
                cache: 'no-store'
            });

            if (!statsRes.ok) {
                const errorData = await statsRes.json();
                throw new Error(errorData.message || 'Failed to fetch stats');
            }

            const statsData = await statsRes.json();

            if (statsData.success) {
                setStats({
                    totalUsers: statsData.stats?.totalUsers || 0,
                    totalProperties: statsData.stats?.totalProperties || 0,
                    pendingProperties: statsData.stats?.pendingProperties || 0,
                    totalBookings: statsData.stats?.totalBookings || 0,
                    confirmedBookings: statsData.stats?.confirmedBookings || 0,
                    totalRevenue: statsData.stats?.totalRevenue || 0,
                    monthlyGrowth: statsData.stats?.monthlyGrowth || 0
                });
            }

            try {
                const activitiesRes = await fetch(`${API_URL}/api/bookings?isAdmin=true&limit=5`, {
                    cache: 'no-store'
                });

                if (activitiesRes.ok) {
                    const activitiesData = await activitiesRes.json();
                    if (activitiesData.success) {
                        setRecentActivities(activitiesData.bookings || []);
                    } else {
                        setRecentActivities([]);
                    }
                } else {
                    setRecentActivities([]);
                }
            } catch (err) {
                console.warn('Could not fetch recent bookings:', err);
                setRecentActivities([]);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.message);
            toast.error(error.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Fixed useEffect
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        fetchDashboardData();
    }, [user]);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            'confirmed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
            'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' }
        };
        const info = statusMap[status] || statusMap['pending'];
        return (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${info.bg} ${info.text}`}>
                {info.label}
            </span>
        );
    };

    // Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to view the admin dashboard.</p>
                    <Link href="/login" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Check if user is admin
    if (user.role?.toLowerCase() !== 'admin') {
        return <AccessDenied role="admin" />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Welcome, {user?.name || 'Admin'}! 👋
                            </h1>
                            <p className="text-blue-100 mt-1">
                                Here's what's happening with your platform today.
                            </p>
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            className="mt-4 md:mt-0 flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </motion.div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm">
                            <UserPlus className="w-3 h-3 text-green-500" />
                            <span className="text-green-500 font-medium">+12</span>
                            <span className="text-gray-400">this month</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Properties</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm">
                            <span className="text-yellow-500 font-medium">{stats.pendingProperties}</span>
                            <span className="text-gray-400">pending approval</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <Calendar className="w-5 h-5 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-green-500 font-medium">{stats.confirmedBookings}</span>
                            <span className="text-gray-400">confirmed</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Revenue</p>
                                <p className="text-2xl font-bold text-emerald-600">
                                    {formatCurrency(stats.totalRevenue)}
                                </p>
                            </div>
                            <div className="bg-emerald-100 p-3 rounded-lg">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                        <div className="mt-2 flex items-center gap-1 text-sm">
                            {stats.monthlyGrowth >= 0 ? (
                                <>
                                    <TrendingUp className="w-3 h-3 text-green-500" />
                                    <span className="text-green-500 font-medium">{stats.monthlyGrowth}%</span>
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="w-3 h-3 text-red-500" />
                                    <span className="text-red-500 font-medium">{Math.abs(stats.monthlyGrowth)}%</span>
                                </>
                            )}
                            <span className="text-gray-400">vs last month</span>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/dashboard/admin/all-properties"
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition text-center hover:border-blue-300"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Building2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm">Manage Properties</h3>
                            <p className="text-xs text-gray-500">{stats.pendingProperties} pending</p>
                        </Link>

                        <Link
                            href="/dashboard/admin/all-users"
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition text-center hover:border-blue-300"
                        >
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm">Manage Users</h3>
                            <p className="text-xs text-gray-500">{stats.totalUsers} total users</p>
                        </Link>

                        <Link
                            href="/dashboard/admin/all-bookings"
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition text-center hover:border-blue-300"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <Calendar className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm">Manage Bookings</h3>
                            <p className="text-xs text-gray-500">{stats.totalBookings} total bookings</p>
                        </Link>

                        <Link
                            href="/dashboard/admin/transactions"
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition text-center hover:border-blue-300"
                        >
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                                <DollarSign className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm">Transactions</h3>
                            <p className="text-xs text-gray-500">View all payments</p>
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Recent Bookings
                            </h2>
                            <Link
                                href="/dashboard/admin/all-bookings"
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                View All →
                            </Link>
                        </div>

                        {recentActivities.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">📭</div>
                                <p className="text-gray-500">No recent bookings</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentActivities.slice(0, 5).map((booking, index) => (
                                    <div
                                        key={booking._id || index}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                            <Home className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {booking.propertyInfo?.title || 'Property'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {booking.tenantInfo?.name || 'Unknown'} • {formatDate(booking.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {getStatusBadge(booking.bookingStatus)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Platform Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-blue-600" />
                                Platform Overview
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Users className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Total Users</p>
                                        <p className="text-xs text-gray-500">Registered accounts</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{stats.totalUsers}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <Building2 className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Properties</p>
                                        <p className="text-xs text-gray-500">{stats.pendingProperties} pending</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{stats.totalProperties}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                        <Calendar className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Bookings</p>
                                        <p className="text-xs text-gray-500">{stats.confirmedBookings} confirmed</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-gray-900">{stats.totalBookings}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">Revenue</p>
                                        <p className="text-xs text-gray-500">Total earnings</p>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-emerald-600">
                                    {formatCurrency(stats.totalRevenue)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm">{error}</p>
                            <button
                                onClick={fetchDashboardData}
                                className="ml-auto text-sm bg-red-100 px-3 py-1 rounded-lg hover:bg-red-200 transition"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboardHomePage;
