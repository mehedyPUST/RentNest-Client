// app/dashboard/tenant/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import {
    Home,
    Calendar,
    Heart,
    User,
    LogOut,
    Settings,
    Bell,
    ChevronRight,
    TrendingUp,
    Building2,
    HeartHandshake,
    Star,
    MapPin,
    Clock,
    DollarSign,
    Eye,
    Shield,
    Award,
    Sparkles
} from 'lucide-react';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';

const TenantDashboardHomePage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user || null;

    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        favorites: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [recentFavorites, setRecentFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('Good Morning');

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // ✅ Set greeting based on time
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning 🌅');
        else if (hour < 17) setGreeting('Good Afternoon ☀️');
        else if (hour < 21) setGreeting('Good Evening 🌇');
        else setGreeting('Good Night 🌙');
    }, []);

    // ✅ Fetch dashboard data
    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const tenantId = user?.id || user?._id;

            // Fetch bookings
            const bookingsRes = await fetch(
                `${API_URL}/api/bookings/my-bookings?tenantId=${tenantId}&page=1&limit=5`
            );
            const bookingsData = await bookingsRes.json();

            if (bookingsData.success) {
                const bookings = bookingsData.bookings || [];
                setRecentBookings(bookings);

                setStats(prev => ({
                    ...prev,
                    totalBookings: bookingsData.pagination?.totalItems || bookings.length,
                    pendingBookings: bookings.filter(b => b.bookingStatus === 'pending').length,
                    confirmedBookings: bookings.filter(b =>
                        b.bookingStatus === 'confirmed' || b.bookingStatus === 'approved'
                    ).length,
                }));
            }

            // Fetch favorites
            const favRes = await fetch(
                `${API_URL}/api/favorites/my-favorites?tenantId=${tenantId}&page=1&limit=3`
            );
            const favData = await favRes.json();

            if (favData.success) {
                setRecentFavorites(favData.favorites || []);
                setStats(prev => ({
                    ...prev,
                    favorites: favData.favorites?.length || 0
                }));
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Format price
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        return `$${price.toLocaleString()}`;
    };

    // ✅ Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ✅ Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
            'confirmed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
            'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
            'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled' },
        };
        const info = statusMap[status] || statusMap['pending'];
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${info.bg} ${info.text}`}>
                {info.label}
            </span>
        );
    };

    // ✅ Quick actions
    const quickActions = [
        {
            title: 'Browse Properties',
            icon: Home,
            color: 'bg-blue-500',
            href: '/all-properties',
            description: 'Find your dream home'
        },
        {
            title: 'My Bookings',
            icon: Calendar,
            color: 'bg-purple-500',
            href: '/dashboard/tenant/my-bookings',
            description: 'Manage your bookings'
        },
        {
            title: 'Favorites',
            icon: Heart,
            color: 'bg-red-500',
            href: '/dashboard/tenant/favorites',
            description: 'Your saved properties'
        },
        {
            title: 'Profile',
            icon: User,
            color: 'bg-green-500',
            href: '/dashboard/tenant/profile',
            description: 'Update your info'
        },
    ];

    // ✅ Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // ✅ Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to view your dashboard.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* 🎯 Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white"
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {greeting}, {user?.name || 'Tenant'}! 👋
                                </h1>
                                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                    Tenant
                                </span>
                            </div>
                            <p className="text-white/80 mt-1">
                                Welcome to your dashboard. Here's what's happening with your rentals.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <button
                                onClick={() => router.push('/all-properties')}
                                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition flex items-center gap-2"
                            >
                                <Building2 className="w-4 h-4" />
                                Find Properties
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* 📊 Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Bookings</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Calendar className="w-5 h-5 text-blue-600" />
                            </div>
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
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <Clock className="w-5 h-5 text-yellow-600" />
                            </div>
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
                                <p className="text-sm text-gray-500">Confirmed</p>
                                <p className="text-2xl font-bold text-green-600">{stats.confirmedBookings}</p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                            </div>
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
                                <p className="text-sm text-gray-500">Favorites</p>
                                <p className="text-2xl font-bold text-red-600">{stats.favorites}</p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <Heart className="w-5 h-5 text-red-600" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 🚀 Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.div
                                key={action.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ y: -5 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition cursor-pointer"
                                onClick={() => router.push(action.href)}
                            >
                                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 📝 Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-600" />
                                Recent Bookings
                            </h2>
                            <Link
                                href="/dashboard/tenant/bookings"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recentBookings.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">📭</div>
                                <p className="text-gray-500">No bookings yet</p>
                                <button
                                    onClick={() => router.push('/all-properties')}
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Browse properties →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentBookings.slice(0, 4).map((booking) => (
                                    <div
                                        key={booking._id}
                                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                        onClick={() => router.push(`/dashboard/tenant/bookings/${booking._id}`)}
                                    >
                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                            <img
                                                src={booking.propertyInfo?.images?.[0] || '/placeholder.jpg'}
                                                alt={booking.propertyInfo?.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-gray-900 truncate">
                                                {booking.propertyInfo?.title || 'Property'}
                                            </h4>
                                            <p className="text-sm text-gray-500 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {booking.propertyInfo?.location || 'N/A'}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-sm font-semibold text-blue-600">
                                                    {formatPrice(booking.propertyInfo?.price)}
                                                </span>
                                                <span className="text-xs text-gray-400">|</span>
                                                {getStatusBadge(booking.bookingStatus)}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {formatDate(booking.createdAt)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Favorites */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-600" />
                                Recent Favorites
                            </h2>
                            <Link
                                href="/dashboard/tenant/favorites"
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {recentFavorites.length === 0 ? (
                            <div className="text-center py-8">
                                <div className="text-4xl mb-2">❤️</div>
                                <p className="text-gray-500">No favorites yet</p>
                                <button
                                    onClick={() => router.push('/all-properties')}
                                    className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                                >
                                    Start exploring →
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentFavorites.slice(0, 4).map((favorite) => {
                                    const property = favorite.propertyData || {};
                                    return (
                                        <div
                                            key={favorite._id}
                                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                                            onClick={() => router.push(`/all-properties/${favorite.propertyId}`)}
                                        >
                                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                                <img
                                                    src={property.images?.[0] || '/placeholder.jpg'}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-gray-900 truncate">
                                                    {property.title || 'Untitled'}
                                                </h4>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {property.location || 'N/A'}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        {formatPrice(property.price)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">|</span>
                                                    <span className="text-xs text-gray-500">
                                                        {property.specifications?.bedrooms || 0} beds
                                                    </span>
                                                    <span className="text-xs text-gray-400">|</span>
                                                    <span className="text-xs text-gray-500">
                                                        {property.specifications?.bathrooms || 0} baths
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {formatDate(favorite.createdAt)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* 🏷️ Features / Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                        <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Shield className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Verified Properties</h4>
                        <p className="text-sm text-gray-500">All listings are verified</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                        <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HeartHandshake className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Secure Booking</h4>
                        <p className="text-sm text-gray-500">Safe and secure process</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                        <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Award className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Best Prices</h4>
                        <p className="text-sm text-gray-500">Competitive rental rates</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
                        <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900">Premium Service</h4>
                        <p className="text-sm text-gray-500">24/7 customer support</p>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default TenantDashboardHomePage;