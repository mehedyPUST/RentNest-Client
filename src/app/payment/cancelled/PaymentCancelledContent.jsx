// app/payment/cancelled/PaymentCancelledContent.jsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { XCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PaymentCancelledContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const bookingId = searchParams?.get('bookingId');

    useEffect(() => {
        const cancelBooking = async () => {
            if (bookingId) {
                setLoading(true);
                try {
                    // আপনার ক্যান্সেল লজিক
                    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`, {
                        method: 'DELETE',
                    });
                    toast.error('Payment cancelled. Booking removed.');
                } catch (error) {
                    console.error('Error cancelling booking:', error);
                } finally {
                    setLoading(false);
                }
            }
        };
        cancelBooking();
    }, [bookingId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-600 mb-6">Your payment was cancelled. No charges were made.</p>
                <button onClick={() => router.push('/all-properties')} className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Browse Properties
                </button>
            </div>
        </div>
    );
}