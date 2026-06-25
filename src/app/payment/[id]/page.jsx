// app/payment/[id]/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCreditCard, FaLock } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentPage = () => {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}`);
            const data = await res.json();
            if (data.success) {
                setBooking(data.booking);
            }
        } catch (error) {
            console.error('Error fetching booking:', error);
            toast.error('Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        setProcessing(true);
        try {
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: booking.propertyId,
                    propertyTitle: booking.propertyInfo?.title || 'Rent Payment',
                    propertyPrice: booking.propertyInfo?.price || 0,
                    bookingId: bookingId
                })
            });

            const data = await response.json();
            console.log('Stripe Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create payment session');
            }

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error) {
            console.error('Payment error:', error);
            toast.error(error.message || 'Failed to initiate payment');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Booking Not Found</h1>
                    <Link href="/my-bookings" className="text-blue-600 hover:underline">
                        Go to My Bookings
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/my-bookings"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
                >
                    <FaArrowLeft />
                    Back to Bookings
                </Link>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h1 className="text-xl font-bold text-white">Complete Your Payment</h1>
                        <p className="text-blue-100 text-sm">Secure payment via Stripe</p>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Property</span>
                                    <span className="font-medium">{booking.propertyInfo?.title}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Location</span>
                                    <span className="font-medium">{booking.propertyInfo?.location}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Move-in Date</span>
                                    <span className="font-medium">
                                        {new Date(booking.moveInDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="border-t pt-2 mt-2 flex justify-between">
                                    <span className="text-gray-600 font-semibold">Total Amount</span>
                                    <span className="text-xl font-bold text-blue-600">
                                        ${booking.propertyInfo?.price?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <FaLock className="text-yellow-600 mt-0.5" />
                                <p className="text-sm text-yellow-800">
                                    Your payment is secure and encrypted. You will be redirected to Stripe's secure payment page.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <FaCreditCard className="w-5 h-5" />
                                    Pay with Stripe
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;