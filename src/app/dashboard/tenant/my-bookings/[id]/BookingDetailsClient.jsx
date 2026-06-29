// app/dashboard/tenant/my-bookings/[id]/BookingDetailsClient.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied';
import { motion } from 'framer-motion';
import {
    FaArrowLeft,
    FaHome,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaDollarSign,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaPrint,
} from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

const BookingDetailsClient = ({ bookingId }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            if (!user || !bookingId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`,
                    { cache: 'no-store' }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch booking details');
                }

                const data = await response.json();

                if (data.success) {
                    setBooking(data.booking);
                } else {
                    throw new Error(data.message || 'Booking not found');
                }

            } catch (error) {
                console.error('Error fetching booking:', error);
                setError(error.message);
                toast.error('Failed to load booking details');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId, user]);

    const handleCancelBooking = async () => {
        if (!confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        try {
            const tenantId = user?.id || user?._id;
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}?tenantId=${tenantId}`,
                { method: 'DELETE' }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel booking');
            }

            toast.success('Booking cancelled successfully');
            router.push('/dashboard/tenant/my-bookings');

        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast.error(error.message || 'Failed to cancel booking');
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateTime = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'pending': {
                icon: <FaClock className="mr-1" />,
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                label: 'Pending',
                description: 'Your booking is awaiting owner approval.'
            },
            'confirmed': {
                icon: <FaCheckCircle className="mr-1" />,
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Confirmed',
                description: 'Your booking has been confirmed!'
            },
            'approved': {
                icon: <FaCheckCircle className="mr-1" />,
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Approved',
                description: 'Your booking has been approved!'
            },
            'rejected': {
                icon: <FaTimesCircle className="mr-1" />,
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                label: 'Rejected',
                description: 'Your booking was rejected.'
            },
            'cancelled': {
                icon: <FaTimesCircle className="mr-1" />,
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-300',
                label: 'Cancelled',
                description: 'Your booking has been cancelled.'
            }
        };

        const info = statusMap[status] || statusMap['pending'];
        return {
            badge: (
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${info.bg} ${info.text} ${info.border}`}>
                    {info.icon}
                    {info.label}
                </span>
            ),
            description: info.description,
            icon: info.icon
        };
    };

    const getPaymentBadge = (status) => {
        const statusMap = {
            'paid': {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-300',
                label: 'Paid ✓',
                icon: <FaCheckCircle className="w-4 h-4 text-green-500" />
            },
            'pending': {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                label: 'Pending',
                icon: <FaClock className="w-4 h-4 text-yellow-500" />
            },
            'failed': {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                label: 'Failed ✗',
                icon: <FaTimesCircle className="w-4 h-4 text-red-500" />
            }
        };

        const info = statusMap[status] || statusMap['pending'];
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${info.bg} ${info.text} ${info.border}`}>
                {info.icon}
                {info.label}
            </span>
        );
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view booking details.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (user.role?.toLowerCase() !== 'tenant') {
        return <AccessDenied role="tenant" />;
    }

    if (error || !booking) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Booking Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400">{error || "The booking you're looking for doesn't exist."}</p>
                    <Link
                        href="/dashboard/tenant/my-bookings"
                        className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                        <FaArrowLeft />
                        Back to My Bookings
                    </Link>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusBadge(booking.bookingStatus);
    const propertyInfo = booking.propertyInfo || {};
    const tenantInfo = booking.tenantInfo || {};

    const propertyImage = propertyInfo.images && propertyInfo.images.length > 0
        ? propertyInfo.images[0]
        : null;

    return (
        <div className="p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/dashboard/tenant/my-bookings"
                    className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-6"
                >
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Back to My Bookings</span>
                </Link>

                {/* Booking Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                >
                    {/* Header with Status */}
                    <div className={`p-6 border-b ${booking.bookingStatus === 'rejected' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                        booking.bookingStatus === 'pending' ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' :
                            booking.bookingStatus === 'approved' || booking.bookingStatus === 'confirmed' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                                'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                        }`}>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    Booking Details
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Booking ID: #{booking._id?.slice(-8) || 'N/A'}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                {statusInfo.badge}
                                {booking.paymentStatus && getPaymentBadge(booking.paymentStatus)}
                            </div>
                        </div>
                    </div>

                    {/* Status Description */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-lg">{statusInfo.icon}</span>
                            <span>{statusInfo.description}</span>
                        </div>
                        {booking.bookingStatus === 'rejected' && booking.rejectionReason && (
                            <div className="mt-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-700 dark:text-red-400">
                                    <span className="font-semibold">Rejection Reason:</span>
                                    <br />
                                    {booking.rejectionReason}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Property Info */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaHome className="text-emerald-600" />
                            Property Information
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-48 h-48 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                                {propertyImage ? (
                                    <img
                                        src={propertyImage}
                                        alt={propertyInfo.title || 'Property'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FaHome className="w-16 h-16" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {propertyInfo.title || 'Property'}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-red-500" />
                                    {propertyInfo.location || 'Location not specified'}
                                </p>
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    {formatCurrency(propertyInfo.price)}
                                </p>
                                <Link
                                    href={`/all-properties/${booking.propertyId}`}
                                    className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 text-sm font-medium"
                                >
                                    View Property Details →
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details Grid */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-emerald-600" />
                            Booking Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Move-in Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">{formatDate(booking.moveInDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Booking Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">{formatDateTime(booking.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <FaPhone className="text-gray-400 text-sm" />
                                    {booking.contactNumber || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                                <div>{getPaymentBadge(booking.paymentStatus)}</div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Session ID</p>
                                <p className="font-medium text-gray-900 dark:text-white text-xs truncate max-w-[200px]">
                                    {booking.paymentSessionId || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {booking.paymentDate ? formatDateTime(booking.paymentDate) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {booking.additionalNotes && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Additional Notes</p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{booking.additionalNotes}</p>
                            </div>
                        )}
                    </div>

                    {/* Tenant Information */}
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <FaUser className="text-emerald-600" />
                            Tenant Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                                <p className="font-medium text-gray-900 dark:text-white">{tenantInfo.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <FaEnvelope className="text-gray-400 text-sm" />
                                    {tenantInfo.email || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                    <FaPhone className="text-gray-400 text-sm" />
                                    {tenantInfo.phone || booking.contactNumber || 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-3">
                            {booking.bookingStatus === 'pending' && (
                                <button
                                    onClick={handleCancelBooking}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                >
                                    <FaTimesCircle className="w-4 h-4" />
                                    Cancel Booking
                                </button>
                            )}
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                            >
                                <FaPrint className="w-4 h-4" />
                                Print
                            </button>
                        </div>
                        <Link
                            href="/all-properties"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <FaHome className="w-4 h-4" />
                            Browse More Properties
                        </Link>
                    </div>
                </motion.div>

                {/* Booking Timeline */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-800 p-6"
                >
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <FaClock className="text-emerald-600" />
                        Booking Timeline
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-600 mt-1.5 flex-shrink-0"></div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Booking Created</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(booking.createdAt)}</p>
                            </div>
                        </div>

                        {booking.paymentStatus === 'paid' && booking.paymentDate && (
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Payment Completed</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(booking.paymentDate)}</p>
                                </div>
                            </div>
                        )}

                        {booking.bookingStatus === 'approved' && booking.approvedAt && (
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-green-600 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Booking Approved</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(booking.approvedAt)}</p>
                                </div>
                            </div>
                        )}

                        {booking.bookingStatus === 'rejected' && booking.rejectedAt && (
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-600 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Booking Rejected</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(booking.rejectedAt)}</p>
                                </div>
                            </div>
                        )}

                        {booking.bookingStatus === 'cancelled' && booking.cancelledAt && (
                            <div className="flex items-start gap-3">
                                <div className="w-3 h-3 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Booking Cancelled</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatDateTime(booking.cancelledAt)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BookingDetailsClient;