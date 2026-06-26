// components/PaymentSuccessContent.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccessContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const [booking, setBooking] = useState(null);

    // ✅ URL থেকে সরাসরি প্যারামিটার নিন
    const bookingId = searchParams?.get('bookingId');
    const sessionId = searchParams?.get('session_id');

    console.log('📊 PaymentSuccessContent - URL params:', { bookingId, sessionId });

    useEffect(() => {
        const confirmPaymentAndCreateBooking = async () => {
            // ✅ bookingId চেক করুন
            if (!bookingId) {
                console.error('❌ Incomplete booking data: No bookingId found in URL');
                setError('No booking ID found in URL');
                setLoading(false);
                return;
            }

            try {
                console.log('📤 Confirming payment for booking:', bookingId);

                // ✅ প্রথমে payment status আপডেট করুন
                const paymentResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}/payment`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentStatus: 'paid',
                        sessionId: sessionId || null
                    })
                });

                const paymentData = await paymentResponse.json();

                if (!paymentResponse.ok) {
                    throw new Error(paymentData.message || 'Failed to update payment status');
                }

                console.log('✅ Payment status updated:', paymentData);

                // ✅ booking ডেটা fetch করুন
                const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`);
                const bookingData = await bookingResponse.json();

                if (bookingResponse.ok) {
                    setBooking(bookingData.booking || bookingData);
                }

                setSuccess(true);
                toast.success('Payment confirmed! Booking is pending owner approval.');

            } catch (error) {
                console.error('❌ Error confirming payment:', error);
                setError(error.message || 'Something went wrong');
                toast.error(error.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        confirmPaymentAndCreateBooking();
    }, [bookingId, sessionId]);

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Confirming your payment...</p>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmation Failed</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={() => router.push('/dashboard/tenant/bookings')}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            View My Bookings
                        </button>
                        <button
                            onClick={() => router.push('/all-properties')}
                            className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                        >
                            Browse Properties
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Success State
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <div className="flex justify-center mb-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
                <p className="text-gray-600 mb-4">
                    Your payment has been confirmed. Your booking is now pending owner approval.
                </p>

                {booking && (
                    <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Booking Details</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <p><span className="font-medium">Property:</span> {booking.propertyInfo?.title || 'N/A'}</p>
                            <p><span className="font-medium">Location:</span> {booking.propertyInfo?.location || 'N/A'}</p>
                            <p><span className="font-medium">Move-in:</span> {booking.moveInDate ? new Date(booking.moveInDate).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-700">
                        ⏳ Your booking is currently <strong>pending</strong>.
                        The owner will review and approve it shortly.
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/dashboard/tenant/my-bookings')}
                        className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        View My Bookings
                    </button>
                    <button
                        onClick={() => router.push('/all-properties')}
                        className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                    >
                        Browse More Properties
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessContent;