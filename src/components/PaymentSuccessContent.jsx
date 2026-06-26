// app/payment/success/PaymentSuccessContent.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FaCheckCircle, FaSpinner, FaTimesCircle } from 'react-icons/fa';

const PaymentSuccessContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('processing');
    const [errorMessage, setErrorMessage] = useState('');

    const sessionId = searchParams.get('session_id');

    // ✅ Backend API URL
    const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';

    useEffect(() => {
        const confirmPaymentAndCreateBooking = async () => {
            if (!sessionId) {
                toast.error('Invalid payment session');
                router.push('/');
                return;
            }

            console.log('🔍 Session ID:', sessionId);

            try {
                // ✅ 1️⃣ Verify Payment (Frontend API)
                console.log('🔍 Verifying payment...');
                const verifyResponse = await fetch('/api/stripe/verify-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ sessionId })
                });

                const verifyData = await verifyResponse.json();
                console.log('📥 Verify Response:', verifyData);

                if (!verifyResponse.ok) {
                    throw new Error(verifyData.error || 'Payment verification failed');
                }

                // ✅ 2️⃣ Get Booking Data
                let bookingData = verifyData.metadata?.bookingData;
                console.log('📥 Raw Booking Data:', bookingData);

                if (typeof bookingData === 'string') {
                    try {
                        bookingData = JSON.parse(bookingData);
                        console.log('📥 Parsed Booking Data:', bookingData);
                    } catch (parseError) {
                        console.error('❌ Failed to parse booking data:', parseError);
                        throw new Error('Invalid booking data format');
                    }
                } else if (typeof bookingData === 'object' && bookingData !== null) {
                    console.log('📥 Booking Data is already an object:', bookingData);
                } else {
                    throw new Error('No booking data found in payment session');
                }

                if (!bookingData || !bookingData.propertyId) {
                    throw new Error('Incomplete booking data');
                }

                // ✅ 3️⃣ Create Booking in Backend
                console.log('📤 Creating booking in backend...');
                const bookingResponse = await fetch(`${API_URL}/api/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        propertyId: bookingData.propertyId,
                        moveInDate: bookingData.moveInDate,
                        contactNumber: bookingData.contactNumber,
                        additionalNotes: bookingData.additionalNotes || '',
                        tenantInfo: bookingData.tenantInfo,
                        paymentStatus: 'paid',
                        paymentSessionId: sessionId,
                        bookingStatus: 'confirmed'
                    })
                });

                const bookingResult = await bookingResponse.json();
                console.log('📥 Booking Response:', bookingResult);

                if (!bookingResponse.ok) {
                    throw new Error(bookingResult.message || 'Failed to create booking');
                }

                setStatus('success');
                toast.success('Payment successful! Booking confirmed 🎉');

                // ✅ Redirect to Tenant Dashboard
                setTimeout(() => {
                    router.push('/dashboard/tenant/my-bookings');
                }, 3000);

            } catch (error) {
                console.error('❌ Error:', error);
                setErrorMessage(error.message);
                setStatus('error');
                toast.error(error.message || 'Payment confirmed but booking failed. Please contact support.');
            } finally {
                setLoading(false);
            }
        };

        confirmPaymentAndCreateBooking();
    }, [sessionId, router, API_URL]);

    // ✅ UI
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                {loading ? (
                    <>
                        <FaSpinner className="animate-spin text-blue-600 text-5xl mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700">Processing Payment...</h2>
                        <p className="text-gray-500 mt-2">Please wait while we confirm your payment</p>
                    </>
                ) : status === 'success' ? (
                    <>
                        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900">Payment Successful!</h1>
                        <p className="text-gray-600 mt-2">Your booking has been confirmed.</p>
                        <p className="text-gray-500 text-sm mt-4">Redirecting to your dashboard...</p>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-1.5">
                            <div className="bg-green-500 h-1.5 rounded-full animate-pulse w-full"></div>
                        </div>
                    </>
                ) : (
                    <>
                        <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-gray-900">Something Went Wrong</h1>
                        <p className="text-gray-600 mt-2">{errorMessage || 'Payment confirmed but booking failed.'}</p>
                        <div className="mt-6 space-x-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => router.push('/contact')}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Contact Support
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccessContent;