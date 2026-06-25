// app/payment/success/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCheckCircle } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);
    const [error, setError] = useState(null);

    const sessionId = searchParams.get('session_id');
    const bookingId = searchParams.get('booking_id');

    useEffect(() => {
        if (sessionId && bookingId) {
            // ✅ 2 সেকেন্ড Delay যোগ করুন - Payment Process Complete হওয়ার জন্য
            const timer = setTimeout(() => {
                verifyPayment();
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setError('Missing payment information');
            setLoading(false);
        }
    }, [sessionId, bookingId]);

    const verifyPayment = async () => {
        try {
            console.log('🔍 Verifying payment...', { sessionId, bookingId });

            const res = await fetch(`/api/verify-payment?session_id=${sessionId}&booking_id=${bookingId}`);
            const data = await res.json();

            console.log('📥 Verify Response:', data);

            if (data.success) {
                setBooking(data.booking);
                // ✅ এখানে সঠিকভাবে Payment Success Toast দেখান
                toast.success('Payment successful! Your booking is confirmed.');
            } else {
                setError(data.message || 'Payment verification failed');
                toast.error('Payment verification failed. Please contact support.');
            }
        } catch (error) {
            console.error('Error verifying payment:', error);
            setError('Failed to verify payment');
            toast.error('Failed to verify payment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Verifying your payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Payment Verification Failed
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="space-y-3">
                        <Link
                            href="/my-bookings"
                            className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            View My Bookings
                        </Link>
                        <Link
                            href="/all-properties"
                            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Browse More Properties
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <FaCheckCircle className="w-20 h-20 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Successful! 🎉
                </h1>
                <p className="text-gray-600 mb-6">
                    Your booking has been confirmed. The owner will review and approve your booking soon.
                </p>

                {booking && (
                    <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                        <p className="text-sm text-gray-500">Booking ID</p>
                        <p className="font-medium text-gray-900">{booking._id}</p>

                        <p className="text-sm text-gray-500 mt-2">Property</p>
                        <p className="font-medium text-gray-900">{booking.propertyInfo?.title}</p>

                        <p className="text-sm text-gray-500 mt-2">Move-in Date</p>
                        <p className="font-medium text-gray-900">
                            {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'N/A'}
                        </p>

                        <p className="text-sm text-gray-500 mt-2">Status</p>
                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {booking.bookingStatus || 'Pending'}
                        </span>
                    </div>
                )}

                <div className="space-y-3">
                    <Link
                        href="/my-bookings"
                        className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View My Bookings
                    </Link>
                    <Link
                        href="/all-properties"
                        className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Browse More Properties
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;