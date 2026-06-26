// app/payment/cancelled/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function PaymentCancelled() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const bookingId = searchParams.get('bookingId');

    useEffect(() => {
        // Cancel the booking if payment was cancelled
        const cancelBooking = async () => {
            if (bookingId) {
                try {
                    console.log('📤 Cancelling booking:', bookingId);

                    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        toast.error('Payment cancelled. Booking has been removed.');
                    }
                } catch (error) {
                    console.error('Error cancelling booking:', error);
                }
            }
            setLoading(false);
        };

        cancelBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Processing...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <div className="flex justify-center mb-4">
                    <XCircle className="w-16 h-16 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-6">
                    Your payment was cancelled. No charges were made.
                </p>
                <Link
                    href="/all-properties"
                    className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Browse Properties
                </Link>
            </div>
        </div>
    );
}