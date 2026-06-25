// app/payment/cancelled/page.jsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function PaymentCancelled() {
    const router = useRouter();

    useEffect(() => {
        toast.error('Payment was cancelled. Please try again.');
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                <div className="text-red-500 text-6xl mb-4">✕</div>
                <h1 className="text-2xl font-bold text-gray-900">Payment Cancelled</h1>
                <p className="text-gray-600 mt-2">You cancelled the payment process.</p>
                <div className="mt-6 space-x-3">
                    <button
                        onClick={() => router.push('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Browse Properties
                    </button>
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}