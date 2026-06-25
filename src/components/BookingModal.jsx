// components/BookingModal.jsx
'use client';

import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaPhone, FaUser, FaStickyNote, FaHome, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const BookingModal = ({ isOpen, onClose, property, user, onBookingConfirm }) => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        moveInDate: '',
        contactNumber: '',
        additionalNotes: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const userId = user?.id || user?._id;
    const userPhone = user?.phone || user?.contactNumber || '';
    const userName = user?.name || '';
    const userEmail = user?.email || '';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.moveInDate) {
            newErrors.moveInDate = 'Move-in date is required';
        } else {
            const selectedDate = new Date(formData.moveInDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                newErrors.moveInDate = 'Move-in date must be in the future';
            }
        }

        if (!formData.contactNumber) {
            newErrors.contactNumber = 'Contact number is required';
        } else if (formData.contactNumber.length < 10) {
            newErrors.contactNumber = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        if (!userId) {
            toast.error('Please login to book this property');
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const propertyId = property._id?.$oid || property._id || property.id;

            // ✅ 1️⃣ Create Booking
            const bookingData = {
                propertyId: propertyId,
                moveInDate: formData.moveInDate,
                contactNumber: formData.contactNumber,
                additionalNotes: formData.additionalNotes || '',
                tenantInfo: {
                    id: userId,
                    name: userName || 'Unknown',
                    email: userEmail || 'No email',
                    phone: formData.contactNumber || userPhone || 'No phone'
                }
            };

            console.log('📤 1. Sending Booking Data:', bookingData);

            const bookingResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData)
            });

            const bookingResult = await bookingResponse.json();
            console.log('📥 2. Booking Response:', bookingResult);

            if (!bookingResponse.ok) {
                throw new Error(bookingResult.message || 'Failed to create booking');
            }

            const booking = bookingResult.booking;

            // ✅ শুধু বুকিং তৈরি হয়েছে জানান - Payment Success Toast নয়
            console.log('✅ Booking created:', booking._id);

            if (onBookingConfirm) {
                onBookingConfirm(booking);
            }
            onClose();

            // ✅ 2️⃣ Create Stripe Checkout Session
            console.log('💰 3. Creating Stripe Checkout Session...');
            console.log('💰 Property Price:', property.price);
            console.log('💰 Property Title:', property.title);
            console.log('💰 Booking ID:', booking._id);

            const stripeResponse = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: propertyId,
                    propertyTitle: property.title || 'Rent Payment',
                    propertyPrice: Number(property.price),
                    bookingId: booking._id
                })
            });

            console.log('💰 4. Stripe Response Status:', stripeResponse.status);

            let stripeData;
            try {
                stripeData = await stripeResponse.json();
            } catch (jsonError) {
                console.error('❌ Failed to parse JSON:', jsonError);
                throw new Error('Invalid response from payment server');
            }

            console.log('💰 5. Stripe Data:', stripeData);

            if (!stripeResponse.ok) {
                console.error('❌ 6. Stripe Error:', stripeData);
                toast.error(stripeData.error || 'Failed to create payment session');
                router.push(`/payment/${booking._id}`);
                return;
            }

            // ✅ 3️⃣ Redirect to Stripe Checkout
            if (stripeData.url) {
                console.log('🔗 7. Redirecting to Stripe:', stripeData.url);
                window.location.href = stripeData.url;
            } else {
                console.error('❌ 8. No checkout URL received');
                toast.error('No checkout URL received. Please try again.');
                router.push(`/payment/${booking._id}`);
            }

        } catch (error) {
            console.error('❌ Error:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
                <div className="flex items-center justify-center min-h-screen px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 sticky top-0 z-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-white">Book This Property</h2>
                                    <p className="text-blue-100 text-sm mt-1">
                                        {property?.title || 'Property Booking'}
                                    </p>
                                </div>
                                <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Property Info */}
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-200">
                                        <img
                                            src={property?.images?.[0] || '/placeholder.jpg'}
                                            alt={property?.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{property?.title}</p>
                                        <p className="text-sm text-gray-600 flex items-center gap-1">
                                            <FaMapMarkerAlt className="text-red-400 text-xs" />
                                            {property?.location}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600">
                                            ${property?.price?.toLocaleString()}/month
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Move-in Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaCalendarAlt className="inline mr-2 text-blue-500" />
                                    Move-in Date *
                                </label>
                                <input
                                    type="date"
                                    name="moveInDate"
                                    value={formData.moveInDate}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.moveInDate ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.moveInDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.moveInDate}</p>
                                )}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaPhone className="inline mr-2 text-blue-500" />
                                    Contact Number *
                                </label>
                                <input
                                    type="tel"
                                    name="contactNumber"
                                    placeholder="Enter your phone number"
                                    value={formData.contactNumber}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.contactNumber && (
                                    <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
                                )}
                            </div>

                            {/* User Info */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaUser className="inline mr-2 text-blue-500" />
                                    Your Information
                                </label>
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 space-y-1.5">
                                    <p className="text-sm flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Name:</span>
                                        <span className="text-gray-900">{userName || 'Not provided'}</span>
                                    </p>
                                    <p className="text-sm flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Email:</span>
                                        <span className="text-gray-900">{userEmail || 'Not provided'}</span>
                                    </p>
                                    <p className="text-sm flex items-center gap-2">
                                        <span className="font-medium text-gray-700">Phone:</span>
                                        <span className={userPhone ? 'text-gray-900' : 'text-yellow-600'}>
                                            {userPhone || '⚠️ No phone number found. Please add below.'}
                                        </span>
                                    </p>
                                </div>
                                {!userPhone && (
                                    <div className="mt-2 text-xs text-yellow-600 flex items-center gap-1">
                                        <span>⚠️</span>
                                        <span>Please enter your phone number in the field above.</span>
                                    </div>
                                )}
                            </div>

                            {/* Additional Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <FaStickyNote className="inline mr-2 text-blue-500" />
                                    Additional Notes
                                </label>
                                <textarea
                                    name="additionalNotes"
                                    rows="3"
                                    placeholder="Any special requirements or questions..."
                                    value={formData.additionalNotes}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                                />
                            </div>

                            {/* Payment Info */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <FaDollarSign className="text-yellow-600 mt-0.5" />
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-medium">Note:</span> You will be redirected to secure payment page after confirmation.
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <span className="inline-block animate-spin mr-2">⟳</span>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaHome className="w-4 h-4" />
                                            Confirm & Pay
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default BookingModal;