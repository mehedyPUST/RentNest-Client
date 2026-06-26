// components/PaymentSuccessContent.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentSuccessContent = ({ bookingId, sessionId }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const confirmPaymentAndCreateBooking = async () => {
            if (!bookingId) {
                console.error('❌ Incomplete booking data: No bookingId');
                setError('No booking ID found');
                setLoading(false);
                return;
            }

            try {
                console.log('📤 Confirming payment for booking:', bookingId);

                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}/payment`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        paymentStatus: 'paid',
                        sessionId: sessionId || null
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    setSuccess(true);
                    toast.success('Payment confirmed! Booking is pending owner approval.');
                } else {
                    setError(data.message || 'Failed to update payment status');
                    toast.error(data.message || 'Failed to update payment status');
                }
            } catch (error) {
                console.error('❌ Error confirming payment:', error);
                setError(error.message || 'Something went wrong');
                toast.error('Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        confirmPaymentAndCreateBooking();
    }, [bookingId, sessionId]);

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

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmation Failed</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/tenant/bookings')}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
                <p className="text-gray-600 mb-4">
                    Your payment has been confirmed. Your booking is now pending owner approval.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-700">
                        ⏳ The owner will review your booking request and approve it shortly.
                    </p>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => router.push('/dashboard/tenant/bookings')}
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