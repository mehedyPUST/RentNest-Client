// components/CustomerReviews.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';
import { Sparkles, Loader2 } from 'lucide-react';

const CustomerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews?limit=4`,
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

        fetchReviews();
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

    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading reviews...</p>
                </div>
            </section>
        );
    }

    if (error || reviews.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            What Our Clients Say
                        </span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Customer <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Reviews</span>
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-blue-600 rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Real experiences from real tenants. Discover why thousands trust RentNest for their property needs.
                    </p>
                </motion.div>

                {/* Reviews Grid - 2 Columns */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 hover:shadow-lg transition"
                        >
                            <div className="flex items-start gap-4">
                                {/* ✅ User Avatar - Photo Support */}
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                    {review.tenantPhoto ? (
                                        <img
                                            src={review.tenantPhoto}
                                            alt={review.tenantName || 'User'}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                // Image load না হলে fallback দেখাবে
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = review.tenantName?.charAt(0) || 'U';
                                                e.target.parentElement.className = 'w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0';
                                            }}
                                        />
                                    ) : (
                                        <span className="text-white font-bold text-lg">
                                            {review.tenantName?.charAt(0) || 'U'}
                                        </span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {review.tenantName || 'Anonymous'}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <div className="flex gap-0.5">
                                                    {renderStars(review.rating)}
                                                </div>
                                                <span className="text-xs text-gray-400">
                                                    {review.rating}.0
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0">
                                            <FaCalendarAlt className="w-3 h-3" />
                                            {formatDate(review.createdAt)}
                                        </span>
                                    </div>

                                    {/* Review Comment */}
                                    <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed line-clamp-3">
                                        <FaQuoteLeft className="w-3 h-3 text-blue-400 inline mr-1" />
                                        {review.comment}
                                    </p>

                                    {/* Property Info */}
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
                </motion.div>
            </div>
        </section>
    );
};

export default CustomerReviews;