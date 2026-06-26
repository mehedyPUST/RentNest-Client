// app/dashboard/admin/all-bookings/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import {
    Calendar,
    Search,
    RefreshCw,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    Home,
    User,
    DollarSign
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const AllBookingsPageAdmin = () => {
    const { data: session, status } = useSession();
    const user = session?.user;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // Fetch bookings
    const fetchBookings = async (page = 1, status = 'all', search = '') => {
        if (!user) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // ✅ Admin এর জন্য isAdmin=true পাঠান
            let url = `${API_URL}/api/bookings?isAdmin=true&page=${page}&limit=${itemsPerPage}`;

            if (status && status !== 'all' && status !== 'undefined') {
                url += `&status=${status}`;
            }
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            console.log('📤 Fetching bookings:', url);

            const response = await fetch(url, {
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch bookings');
            }

            const data = await response.json();

            if (data.success) {
                setBookings(data.bookings || []);
                setTotalItems(data.totalItems || data.bookings?.length || 0);
            } else {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError(error.message);
            setBookings([]);
            toast.error(error.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchBookings(currentPage, filterStatus, searchTerm);
        }
    }, [user]);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchBookings(1, filterStatus, searchTerm);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        fetchBookings(1, filterStatus, '');
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchBookings(newPage, filterStatus, searchTerm);
        }
    };

    // Handle filter change
    const handleFilterChange = (newStatus) => {
        setFilterStatus(newStatus);
        setCurrentPage(1);
        fetchBookings(1, newStatus, searchTerm);
    };

    // View booking details
    const viewBookingDetails = (booking) => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending', icon: <Clock className="w-3 h-3" /> },
            'confirmed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed', icon: <CheckCircle className="w-3 h-3" /> },
            'approved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved', icon: <CheckCircle className="w-3 h-3" /> },
            'rejected': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected', icon: <XCircle className="w-3 h-3" /> },
            'cancelled': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Cancelled', icon: <XCircle className="w-3 h-3" /> }
        };
        const info = statusMap[status] || statusMap['pending'];
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${info.bg} ${info.text}`}>
                {info.icon}
                {info.label}
            </span>
        );
    };

    // Get payment status badge
    const getPaymentBadge = (status) => {
        const statusMap = {
            'paid': 'bg-green-100 text-green-800',
            'pending': 'bg-yellow-100 text-yellow-800',
            'failed': 'bg-red-100 text-red-800',
            'refunded': 'bg-gray-100 text-gray-800'
        };
        const bg = statusMap[status] || statusMap['pending'];
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg}`}>
                {status || 'pending'}
            </span>
        );
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    // Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading bookings...</p>
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
                    <p className="text-gray-600">You need to be logged in to view bookings.</p>
                    <Link href="/login" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Check if user is admin
    if (user.role?.toLowerCase() !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-6xl mb-4">⛔</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You do not have permission to view bookings.</p>
                    <Link href="/dashboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage all bookings across the platform
                        </p>
                    </div>
                    <button
                        onClick={() => fetchBookings(currentPage, filterStatus, searchTerm)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {bookings.filter(b => b.bookingStatus === 'pending').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Confirmed</p>
                        <p className="text-2xl font-bold text-green-600">
                            {bookings.filter(b => b.bookingStatus === 'confirmed' || b.bookingStatus === 'approved').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Rejected/Cancelled</p>
                        <p className="text-2xl font-bold text-red-600">
                            {bookings.filter(b => b.bookingStatus === 'rejected' || b.bookingStatus === 'cancelled').length}
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by property, tenant, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-4 h-4" />
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

                        <select
                            value={filterStatus}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Property
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tenant
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Payment
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <Calendar className="w-12 h-12 text-gray-300" />
                                                <p className="text-sm font-medium">No bookings found</p>
                                                <p className="text-xs">Try adjusting your search or filter</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => {
                                        const bookingId = booking._id?.$oid || booking._id;
                                        const propertyInfo = booking.propertyInfo || {};
                                        const tenantInfo = booking.tenantInfo || {};

                                        return (
                                            <tr
                                                key={bookingId}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-4 py-3">
                                                    <p className="font-medium text-gray-900 line-clamp-1">
                                                        {propertyInfo.title || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-gray-900">{tenantInfo.name || 'N/A'}</p>
                                                    <p className="text-xs text-gray-500">{tenantInfo.email || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                        {propertyInfo.location || 'N/A'}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="font-semibold text-gray-900">
                                                        {formatCurrency(propertyInfo.price)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(booking.bookingStatus)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getPaymentBadge(booking.paymentStatus)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-600">
                                                        {formatDate(booking.createdAt)}
                                                    </p>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => viewBookingDetails(booking)}
                                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} bookings
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                    {currentPage}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Booking Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Booking ID</p>
                                    <p className="font-mono text-sm font-medium">
                                        #{selectedBooking._id?.slice(-8) || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Status</p>
                                    <div>{getPaymentBadge(selectedBooking.paymentStatus)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatCurrency(selectedBooking.propertyInfo?.price)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Move-in Date</p>
                                    <p className="text-sm">{formatDate(selectedBooking.moveInDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Booked On</p>
                                    <p className="text-sm">{formatDate(selectedBooking.createdAt)}</p>
                                </div>
                            </div>

                            {/* Property Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Home className="w-4 h-4 text-blue-600" />
                                    Property Information
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                    <p><span className="text-sm text-gray-500">Title:</span> {selectedBooking.propertyInfo?.title || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Location:</span> {selectedBooking.propertyInfo?.location || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Price:</span> {formatCurrency(selectedBooking.propertyInfo?.price)}</p>
                                </div>
                            </div>

                            {/* Tenant Information */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Tenant Information
                                </h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                    <p><span className="text-sm text-gray-500">Name:</span> {selectedBooking.tenantInfo?.name || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Email:</span> {selectedBooking.tenantInfo?.email || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Phone:</span> {selectedBooking.tenantInfo?.phone || selectedBooking.contactNumber || 'N/A'}</p>
                                </div>
                            </div>

                            {/* Additional Notes */}
                            {selectedBooking.additionalNotes && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                                    <p className="text-sm text-gray-600">{selectedBooking.additionalNotes}</p>
                                </div>
                            )}

                            {/* Rejection Reason */}
                            {selectedBooking.rejectionReason && (
                                <div className="border-t border-red-200 pt-4">
                                    <div className="bg-red-50 rounded-lg p-3">
                                        <p className="text-sm font-semibold text-red-700">Rejection Reason</p>
                                        <p className="text-sm text-red-600">{selectedBooking.rejectionReason}</p>
                                    </div>
                                </div>
                            )}

                            {/* Close Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllBookingsPageAdmin;