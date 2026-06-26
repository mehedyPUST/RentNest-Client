// app/dashboard/owner/booking-requests/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    DollarSign,
    Home,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    MessageSquare,
    RotateCcw,
    Info
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const BookingRequestsPage = () => {
    const { data: session } = useSession();
    const user = session?.user;

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 10
    });
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectBookingId, setRejectBookingId] = useState(null);

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        action: '', // 'approve', 'reject', 'reject_modal'
        message: '',
        confirmText: '',
        confirmColor: '',
        booking: null
    });

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

    // Fetch booking requests
    const fetchBookings = async (page = 1, status = 'all', search = '') => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            const ownerId = user.id || user._id;
            let url = `${API_URL}/api/bookings/owner/${ownerId}?page=${page}&limit=10`;

            if (status !== 'all') {
                url += `&status=${status}`;
            }
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

            if (data.success) {
                setBookings(data.bookings || []);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            } else {
                throw new Error(data.message || 'Failed to fetch bookings');
            }

        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError(error.message);
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Open Confirmation Modal
    const openConfirmModal = (booking, action, message, confirmText, confirmColor) => {
        setConfirmModal({
            isOpen: true,
            id: booking._id,
            title: booking.propertyInfo?.title || 'Booking',
            action: action,
            message: message,
            confirmText: confirmText,
            confirmColor: confirmColor,
            booking: booking
        });
    };

    // ✅ Close Confirmation Modal
    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            id: null,
            title: '',
            action: '',
            message: '',
            confirmText: '',
            confirmColor: '',
            booking: null
        });
    };

    // ✅ Handle Approve (works for pending and rejected)
    const handleApprove = async (bookingId) => {
        setProcessingId(bookingId);
        try {
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'approved' })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to approve booking');
            }

            toast.success('Booking approved successfully! ✅');
            fetchBookings(pagination.currentPage, filter, searchTerm);
            closeConfirmModal();
        } catch (error) {
            console.error('Error approving booking:', error);
            toast.error(error.message || 'Failed to approve booking');
        } finally {
            setProcessingId(null);
        }
    };

    // ✅ Handle Reject (works for pending and approved)
    const handleReject = async (bookingId, reason) => {
        setProcessingId(bookingId);
        try {
            const response = await fetch(`${API_URL}/api/bookings/${bookingId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'rejected',
                    rejectionReason: reason || 'No reason provided'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reject booking');
            }

            toast.success('Booking rejected successfully ❌');
            fetchBookings(pagination.currentPage, filter, searchTerm);
        } catch (error) {
            console.error('Error rejecting booking:', error);
            toast.error(error.message || 'Failed to reject booking');
        } finally {
            setProcessingId(null);
            setShowRejectModal(false);
            setRejectBookingId(null);
            setRejectionReason('');
            closeConfirmModal();
        }
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
            day: 'numeric'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': {
                icon: <Clock className="w-3 h-3" />,
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                label: 'Pending'
            },
            'approved': {
                icon: <CheckCircle className="w-3 h-3" />,
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Approved'
            },
            'confirmed': {
                icon: <CheckCircle className="w-3 h-3" />,
                bg: 'bg-green-100',
                text: 'text-green-800',
                label: 'Confirmed'
            },
            'rejected': {
                icon: <XCircle className="w-3 h-3" />,
                bg: 'bg-red-100',
                text: 'text-red-800',
                label: 'Rejected'
            },
            'cancelled': {
                icon: <XCircle className="w-3 h-3" />,
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                label: 'Cancelled'
            }
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
            'failed': 'bg-red-100 text-red-800'
        };
        const bg = statusMap[status] || statusMap['pending'];
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${bg}`}>
                {status || 'pending'}
            </span>
        );
    };

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading booking requests...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
                    <p className="text-gray-600 mt-2">{error}</p>
                    <button
                        onClick={() => fetchBookings()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Booking Requests
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Manage all booking requests for your properties
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {bookings.filter(b => b.bookingStatus === 'pending').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                        {bookings.filter(b => b.bookingStatus === 'approved' || b.bookingStatus === 'confirmed').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                    <p className="text-sm text-gray-500">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">
                        {bookings.filter(b => b.bookingStatus === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search by property name or tenant..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && fetchBookings(1, filter, searchTerm)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-gray-900"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => {
                                setFilter(e.target.value);
                                fetchBookings(1, e.target.value, searchTerm);
                            }}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                            onClick={() => fetchBookings(1, filter, searchTerm)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No booking requests</h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        You don't have any booking requests yet.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const isPending = booking.bookingStatus === 'pending';
                        const isApproved = booking.bookingStatus === 'approved' || booking.bookingStatus === 'confirmed';
                        const isRejected = booking.bookingStatus === 'rejected';

                        return (
                            <motion.div
                                key={booking._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Property Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start gap-4">
                                            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200 dark:bg-gray-800">
                                                {booking.propertyInfo?.images?.[0] ? (
                                                    <img
                                                        src={booking.propertyInfo.images[0]}
                                                        alt={booking.propertyInfo.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Home className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                                                    {booking.propertyInfo?.title || 'Property'}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    {booking.propertyInfo?.location || 'N/A'}
                                                </p>
                                                <div className="flex flex-wrap items-center gap-3 mt-1">
                                                    <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(booking.propertyInfo?.price)}
                                                    </span>
                                                    <span className="text-xs text-gray-400">|</span>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Move-in: {formatDate(booking.moveInDate)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tenant Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {booking.tenantInfo?.name || 'Unknown Tenant'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {booking.tenantInfo?.email || 'No email'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {booking.contactNumber || 'No phone'}
                                        </p>
                                    </div>

                                    {/* Status & Actions */}
                                    <div className="flex flex-col items-end gap-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {getStatusBadge(booking.bookingStatus)}
                                            {getPaymentBadge(booking.paymentStatus)}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => viewBookingDetails(booking)}
                                                className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>

                                            {/* ✅ Approve Button - Pending + Rejected */}
                                            {(isPending || isRejected) && (
                                                <button
                                                    onClick={() => openConfirmModal(
                                                        booking,
                                                        'approve',
                                                        `Are you sure you want to ${isRejected ? 're-approve' : 'approve'} "${booking.propertyInfo?.title}"?`,
                                                        isRejected ? 'Re-Approve' : 'Approve',
                                                        'bg-green-600 hover:bg-green-700'
                                                    )}
                                                    disabled={processingId === booking._id}
                                                    className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition disabled:opacity-50"
                                                    title={isRejected ? "Re-Approve" : "Approve"}
                                                >
                                                    {processingId === booking._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : isRejected ? (
                                                        <RotateCcw className="w-4 h-4" />
                                                    ) : (
                                                        <CheckCircle className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}

                                            {/* ✅ Reject Button - Pending + Approved */}
                                            {(isPending || isApproved) && (
                                                <button
                                                    onClick={() => {
                                                        setRejectBookingId(booking._id);
                                                        setShowRejectModal(true);
                                                    }}
                                                    disabled={processingId === booking._id}
                                                    className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition disabled:opacity-50"
                                                    title={isApproved ? "Reject Approved" : "Reject"}
                                                >
                                                    {processingId === booking._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4" />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Rejection Reason (if rejected) */}
                                {isRejected && booking.rejectionReason && (
                                    <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                        <p className="text-sm text-red-700 dark:text-red-400">
                                            <span className="font-semibold">Rejection Reason:</span>
                                            <br />
                                            {booking.rejectionReason}
                                        </p>
                                    </div>
                                )}

                                {/* Additional Info */}
                                {booking.additionalNotes && (
                                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            <MessageSquare className="w-3 h-3 inline mr-1" />
                                            {booking.additionalNotes}
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                const newPage = pagination.currentPage - 1;
                                if (newPage >= 1) {
                                    fetchBookings(newPage, filter, searchTerm);
                                }
                            }}
                            disabled={pagination.currentPage === 1}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                            {pagination.currentPage} / {pagination.totalPages}
                        </span>
                        <button
                            onClick={() => {
                                const newPage = pagination.currentPage + 1;
                                if (newPage <= pagination.totalPages) {
                                    fetchBookings(newPage, filter, searchTerm);
                                }
                            }}
                            disabled={pagination.currentPage === pagination.totalPages}
                            className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ✅ Confirmation Modal (Approve / Reject) */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full ${confirmModal.action === 'approve' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                {confirmModal.action === 'approve' ? (
                                    <Info className="w-6 h-6 text-green-600 dark:text-green-400" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {confirmModal.action === 'approve' ? 'Approve Booking' : 'Reject Booking'}
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {confirmModal.message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={closeConfirmModal}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (confirmModal.action === 'approve') {
                                        handleApprove(confirmModal.id);
                                    }
                                }}
                                disabled={processingId === confirmModal.id}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmModal.confirmColor}`}
                            >
                                {processingId === confirmModal.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    confirmModal.confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Booking Details
                            </h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Property */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {selectedBooking.propertyInfo?.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {selectedBooking.propertyInfo?.location}
                                </p>
                                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {formatCurrency(selectedBooking.propertyInfo?.price)}
                                </p>
                            </div>

                            {/* Tenant */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Tenant Name</p>
                                    <p className="font-medium">{selectedBooking.tenantInfo?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-medium">{selectedBooking.tenantInfo?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium">{selectedBooking.contactNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Move-in Date</p>
                                    <p className="font-medium">{formatDate(selectedBooking.moveInDate)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Booking Status</p>
                                    <div>{getStatusBadge(selectedBooking.bookingStatus)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Status</p>
                                    <div>{getPaymentBadge(selectedBooking.paymentStatus)}</div>
                                </div>
                            </div>

                            {/* Rejection Reason (if any) */}
                            {selectedBooking.bookingStatus === 'rejected' && selectedBooking.rejectionReason && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">Rejection Reason</p>
                                    <p className="text-sm text-red-600 dark:text-red-300 mt-1">{selectedBooking.rejectionReason}</p>
                                </div>
                            )}

                            {/* Additional Notes */}
                            {selectedBooking.additionalNotes && (
                                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Additional Notes</p>
                                    <p className="mt-1">{selectedBooking.additionalNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Reject Booking
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Please provide a reason for rejecting <strong>"{rejectBookingId ? bookings.find(b => b._id === rejectBookingId)?.propertyInfo?.title || 'this booking' : 'this booking'}"</strong>
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white dark:bg-gray-900 min-h-[100px]"
                            autoFocus
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectBookingId(null);
                                    setRejectionReason('');
                                }}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(rejectBookingId, rejectionReason)}
                                disabled={processingId === rejectBookingId}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingId === rejectBookingId ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Reject'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingRequestsPage;