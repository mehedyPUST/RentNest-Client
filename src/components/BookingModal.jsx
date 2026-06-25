// components/BookingModal.jsx
'use client';

import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaPhone, FaUser, FaStickyNote, FaHome, FaMapMarkerAlt, FaDollarSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// ✅ আর stripePromise দরকার নেই, কারণ আমরা window.location.href use করবো
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const BookingModal = ({ isOpen, onClose, property, user }) => {
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

    // ✅ এখানে main change - handleSubmit function
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

            // ✅ Booking Data
            const bookingData = {
                propertyId: propertyId,
                propertyTitle: property.title,
                propertyPrice: Number(property.price),
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

            console.log('📤 Booking Data:', bookingData);

            // ✅ Create Stripe Checkout Session
            const response = await fetch('/api/checkout_sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId: propertyId,
                    propertyTitle: property.title,
                    propertyPrice: Number(property.price),
                    bookingData: bookingData
                })
            });

            const sessionData = await response.json();

            if (!response.ok) {
                throw new Error(sessionData.error || 'Failed to create payment session');
            }

            // ✅ নতুন পদ্ধতি: window.location.href ব্যবহার করে redirect
            if (sessionData.url) {
                console.log('🔗 Redirecting to:', sessionData.url);
                // Modal বন্ধ করুন
                onClose();
                // Redirect to Stripe Checkout
                window.location.href = sessionData.url;
            } else {
                throw new Error('No checkout URL received');
            }

        } catch (error) {
            console.error('❌ Error:', error);
            toast.error(error.message || 'Something went wrong. Please try again.');
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
                                <button
                                    onClick={onClose}
                                    className="text-white/80 hover:text-white transition-colors"
                                    disabled={loading}
                                >
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
                                />
                            </div>

                            {/* Payment Info */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <FaDollarSign className="text-yellow-600 mt-0.5" />
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-medium">Note:</span> You will be redirected to secure payment page.
                                    </p>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaHome className="w-4 h-4" />
                                            Pay & Book
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