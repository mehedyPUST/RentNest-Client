// app/dashboard/tenant/my-bookings/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied'; // ✅ যোগ করুন
import {
    FaHome, FaCalendarAlt, FaMapMarkerAlt, FaDollarSign,
    FaCheckCircle, FaClock, FaTimesCircle, FaEye, FaTrash,
    FaSpinner, FaChevronLeft, FaChevronRight, FaSearch,
    FaFilter, FaTimes, FaBed, FaBath, FaSquare,
    FaUser, FaPhone, FaEnvelope, FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyBookings = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user || null;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // ✅ Fetch bookings
    const fetchBookings = async (page = 1, status = 'all', search = '') => {
        if (!user) {
            setError('Please login to view bookings');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const tenantId = user.id || user._id;

            let url = `${API_URL}/api/bookings/my-bookings?tenantId=${tenantId}&page=${page}&limit=10`;
            if (status !== 'all') {
                url += `&status=${status}`;
            }
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            console.log('📤 Fetching bookings:', url);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const data = await response.json();
            console.log('📥 Bookings Response:', data);

            if (data.success) {
                setBookings(data.bookings || []);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            } else {
                throw new Error(data.message || 'Failed to fetch bookings');
            }
        } catch (error) {
            console.error('❌ Error fetching bookings:', error);
            setError(error.message);
            toast.error(error.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Cancel booking
    const cancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const tenantId = user.id || user._id;
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}?tenantId=${tenantId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel booking');
            }

            toast.success('Booking cancelled successfully');
            fetchBookings(pagination.currentPage, filterStatus, searchTerm);
        } catch (error) {
            console.error('❌ Error cancelling booking:', error);
            toast.error(error.message || 'Failed to cancel booking');
        }
    };

    // ✅ View booking details
    const viewBookingDetails = (bookingId) => {
        router.push(`/dashboard/tenant/my-bookings/${bookingId}`);
    };

    // ✅ Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchBookings(newPage, filterStatus, searchTerm);
        }
    };

    // ✅ Handle status filter
    const handleStatusFilter = (status) => {
        setFilterStatus(status);
        fetchBookings(1, status, searchTerm);
    };

    // ✅ Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        fetchBookings(1, filterStatus, searchTerm);
    };

    // ✅ Clear search
    const clearSearch = () => {
        setSearchTerm('');
        fetchBookings(1, filterStatus, '');
    };

    // ✅ Initial load
    useEffect(() => {
        if (user) {
            fetchBookings(1, filterStatus, searchTerm);
        }
    }, [user]);

    // ✅ Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': {
                icon: <FaClock className="mr-1" />,
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                label: 'Pending'
            },
            'confirmed': {
                icon: <FaCheckCircle className="mr-1" />,
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Confirmed'
            },
            'approved': {
                icon: <FaCheckCircle className="mr-1" />,
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Approved'
            },
            'rejected': {
                icon: <FaTimesCircle className="mr-1" />,
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                label: 'Rejected'
            },
            'cancelled': {
                icon: <FaTimesCircle className="mr-1" />,
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-300',
                label: 'Cancelled'
            },
            'completed': {
                icon: <FaCheckCircle className="mr-1" />,
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-300',
                label: 'Completed'
            }
        };

        const statusInfo = statusMap[status] || statusMap['pending'];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                {statusInfo.icon}
                {statusInfo.label}
            </span>
        );
    };

    // ✅ Get payment status badge
    const getPaymentStatusBadge = (status) => {
        const statusMap = {
            'paid': {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Paid ✓'
            },
            'pending': {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                label: 'Pending'
            },
            'failed': {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                label: 'Failed ✗'
            },
            'refunded': {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-300',
                label: 'Refunded'
            }
        };

        const statusInfo = statusMap[status] || statusMap['pending'];
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}>
                {statusInfo.label}
            </span>
        );
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

    // ✅ Format currency
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // ✅ Get status count
    const getStatusCount = (status) => {
        if (status === 'all') return bookings.length;
        return bookings.filter(b => b.bookingStatus === status).length;
    };

    // ✅ Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">Loading your bookings...</h2>
                    <p className="text-gray-500 mt-2">Please wait</p>
                </div>
            </div>
        );
    }

    // ✅ Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to view your bookings.</p>
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

    // ✅ ✅ ✅ Role Check - Tenant (AccessDenied যোগ করা)
    if (user.role?.toLowerCase() !== 'tenant') {
        return <AccessDenied role="tenant" />;
    }

    // ✅ Error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                    <p className="text-gray-600">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchBookings(1, filterStatus, searchTerm);
                        }}
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // ✅ Main render
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Page Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                            <p className="text-gray-600 mt-1">Manage and track your property bookings</p>
                            {user && (
                                <p className="text-sm text-gray-500 mt-1">
                                    👋 Welcome, {user.name || user.email}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => router.push('/all-properties')}
                            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <FaHome className="text-sm" />
                            Browse Properties
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FaHome className="text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Pending</p>
                                <p className="text-2xl font-bold text-yellow-600">
                                    {bookings.filter(b => b.bookingStatus === 'pending').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-lg">
                                <FaClock className="text-yellow-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Confirmed</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {bookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'approved').length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <FaCheckCircle className="text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Cancelled</p>
                                <p className="text-2xl font-bold text-red-600">
                                    {bookings.filter(b => b.bookingStatus === 'cancelled' || b.bookingStatus === 'rejected').length}
                                </p>
                            </div>
                            <div className="bg-red-100 p-3 rounded-lg">
                                <FaTimesCircle className="text-red-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by property name or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </form>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                        >
                            <FaFilter className="text-gray-500" />
                            <span className="text-gray-700">Filters</span>
                            {filterStatus !== 'all' && (
                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full">
                                    {filterStatus}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Filter Buttons */}
                    {showFilters && (
                        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-700">Status:</span>
                            <button
                                onClick={() => handleStatusFilter('all')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'all'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                All ({getStatusCount('all')})
                            </button>
                            <button
                                onClick={() => handleStatusFilter('pending')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'pending'
                                    ? 'bg-yellow-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Pending ({getStatusCount('pending')})
                            </button>
                            <button
                                onClick={() => handleStatusFilter('approved')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'approved'
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Approved ({getStatusCount('approved')})
                            </button>
                            <button
                                onClick={() => handleStatusFilter('rejected')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filterStatus === 'rejected'
                                    ? 'bg-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Rejected ({getStatusCount('rejected')})
                            </button>
                        </div>
                    )}
                </div>

                {/* Bookings List */}
                {bookings.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                        <div className="text-gray-300 text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings found</h3>
                        <p className="text-gray-500">You haven't made any bookings yet.</p>
                        <button
                            onClick={() => router.push('/all-properties')}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            Browse Properties
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking._id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                            >
                                <div className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                        {/* Property Info */}
                                        <div className="flex items-start gap-4 flex-1">
                                            <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                                <img
                                                    src={booking.propertyInfo?.images?.[0] || '/placeholder.jpg'}
                                                    alt={booking.propertyInfo?.title || 'Property'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                    {booking.propertyInfo?.title || 'Property'}
                                                </h3>
                                                <p className="text-sm text-gray-600 flex items-center gap-1">
                                                    <FaMapMarkerAlt className="text-red-400 text-xs" />
                                                    {booking.propertyInfo?.location || 'Location not specified'}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                    <span className="text-sm font-semibold text-blue-600">
                                                        <FaDollarSign className="inline mr-1" />
                                                        {formatCurrency(booking.propertyInfo?.price)}
                                                        /month
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <FaCalendarAlt className="text-blue-400" />
                                                        Move-in: {formatDate(booking.moveInDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status & Actions */}
                                        <div className="flex flex-wrap items-center gap-3 mt-4 lg:mt-0">
                                            <div className="flex flex-col items-end gap-1">
                                                {getStatusBadge(booking.bookingStatus)}
                                                {booking.paymentStatus && (
                                                    getPaymentStatusBadge(booking.paymentStatus)
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => viewBookingDetails(booking._id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <FaEye className="text-lg" />
                                                </button>

                                                {(booking.bookingStatus === 'pending') && (
                                                    <button
                                                        onClick={() => cancelBooking(booking._id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                        title="Cancel Booking"
                                                    >
                                                        <FaTrash className="text-lg" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* ✅ Rejection Reason */}
                                    {booking.bookingStatus === 'rejected' && (
                                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <FaTimesCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-red-700">
                                                        Booking Rejected ❌
                                                    </p>
                                                    {booking.rejectionReason && (
                                                        <p className="text-sm text-red-600 mt-1">
                                                            <span className="font-medium">Reason:</span> {booking.rejectionReason}
                                                        </p>
                                                    )}
                                                    {booking.rejectedAt && (
                                                        <p className="text-xs text-red-400 mt-1">
                                                            Rejected on: {formatDate(booking.rejectedAt)}
                                                        </p>
                                                    )}
                                                    {!booking.rejectionReason && (
                                                        <p className="text-sm text-red-500 mt-1">
                                                            No specific reason provided.
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ✅ Approved Message */}
                                    {(booking.bookingStatus === 'approved' || booking.bookingStatus === 'confirmed') && (
                                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-green-700">
                                                        Booking Approved! ✅
                                                    </p>
                                                    <p className="text-sm text-green-600 mt-1">
                                                        Your booking has been confirmed. Move-in date: {formatDate(booking.moveInDate)}
                                                    </p>
                                                    {booking.approvedAt && (
                                                        <p className="text-xs text-green-400 mt-1">
                                                            Approved on: {formatDate(booking.approvedAt)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ✅ Pending Message */}
                                    {booking.bookingStatus === 'pending' && (
                                        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <FaClock className="text-yellow-500 mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-semibold text-yellow-700">
                                                        Awaiting Approval ⏳
                                                    </p>
                                                    <p className="text-sm text-yellow-600 mt-1">
                                                        Your booking is pending owner approval. We'll notify you once it's confirmed.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Booking Details */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Booking ID</p>
                                                <p className="font-medium text-gray-700 truncate">
                                                    #{booking._id?.slice(-6) || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Contact</p>
                                                <p className="font-medium text-gray-700 flex items-center gap-1">
                                                    <FaPhone className="text-gray-400 text-xs" />
                                                    {booking.contactNumber || 'N/A'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Payment</p>
                                                <p className="font-medium text-gray-700">
                                                    {booking.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Booked On</p>
                                                <p className="font-medium text-gray-700">{formatDate(booking.createdAt)}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Tenant</p>
                                                <p className="font-medium text-gray-700 truncate flex items-center gap-1">
                                                    <FaUser className="text-gray-400 text-xs" />
                                                    {booking.tenantInfo?.name || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Additional Notes */}
                                        {booking.additionalNotes && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-sm text-gray-500">Additional Notes:</p>
                                                <p className="text-sm text-gray-700 mt-1">{booking.additionalNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                                <div className="text-sm text-gray-500">
                                    Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                                    {pagination.totalItems} bookings
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={pagination.currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        <FaChevronLeft className="text-sm" />
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                                        {pagination.currentPage}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={pagination.currentPage === pagination.totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        Next
                                        <FaChevronRight className="text-sm" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;