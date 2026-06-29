// app/all-reviews/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

const AllReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews?limit=50`,
                    { cache: 'no-store' }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }

                const data = await response.json();

                if (data.success) {
                    setReviews(data.reviews || []);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setError(error.message);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAllReviews();
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FaStar
                    key={i}
                    className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
            );
        }
        return stars;
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // ✅ Avatar Component with proper fallback (same as CustomerReviews)
    const renderAvatar = (review) => {
        if (review.tenantPhoto) {
            return (
                <img
                    src={review.tenantPhoto}
                    alt={review.tenantName || 'User'}
                    className="w-full h-full object-cover rounded-full"
                    crossOrigin="anonymous"
                    onError={(e) => {
                        // ✅ Fallback to initials
                        e.target.style.display = 'none';
                        const parent = e.target.parentElement;
                        parent.innerHTML = review.tenantName?.charAt(0) || 'U';
                        parent.className = 'w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0';
                    }}
                />
            );
        }
        return review.tenantName?.charAt(0) || 'U';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-6"
                >
                    <FaArrowLeft />
                    <span>Back to Home</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-4"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-gray-700">All Reviews</span>
                    </motion.div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        What Our <span className="text-emerald-600">Customers</span> Say
                    </h1>
                    <p className="text-gray-500">
                        {reviews.length} reviews from our valued customers
                    </p>
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-gray-500">No reviews yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
                            >
                                <div className="flex items-start gap-4">
                                    {/* ✅ Avatar with image support */}
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 overflow-hidden">
                                        {renderAvatar(review)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-semibold text-gray-900">
                                                    {review.tenantName || 'Anonymous'}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex gap-0.5">
                                                        {renderStars(review.rating)}
                                                    </div>
                                                    <span className="text-xs text-gray-400">
                                                        {review.rating}.0
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">
                                                <FaCalendarAlt className="w-3 h-3" />
                                                {formatDate(review.createdAt)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                            {review.comment}
                                        </p>
                                        {review.propertyTitle && (
                                            <div className="mt-2 text-xs text-gray-400 flex items-center gap-1">
                                                <span>🏠</span>
                                                <span>{review.propertyTitle}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllReviewsPage;