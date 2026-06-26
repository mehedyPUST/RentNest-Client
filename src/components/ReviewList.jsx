// components/ReviewList.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUser, FaCalendarAlt } from 'react-icons/fa';

const ReviewList = ({ propertyId, limit }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const url = propertyId
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/${propertyId}`
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews?limit=${limit || 4}`;

                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Failed to fetch reviews');
                }

                const data = await response.json();

                if (data.success) {
                    setReviews(data.reviews || []);
                    if (data.averageRating) {
                        setAverageRating(data.averageRating);
                        setTotalReviews(data.totalReviews);
                    }
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
                setReviews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [propertyId, limit]);

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

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

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet</p>
                <p className="text-sm text-gray-400">Be the first to review this property!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Average Rating */}
            {propertyId && averageRating > 0 && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl font-bold text-gray-900">
                            {averageRating}
                        </div>
                        <div>
                            <div className="flex gap-1">
                                {renderStars(Math.round(averageRating))}
                            </div>
                            <p className="text-sm text-gray-500">
                                Based on {totalReviews} review{totalReviews > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Cards */}
            {reviews.map((review, index) => (
                <motion.div
                    key={review._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            {/* ✅ User Photo বা Avatar */}
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                {review.tenantPhoto ? (
                                    <img
                                        src={review.tenantPhoto}
                                        alt={review.tenantName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '';
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <FaUser className="w-5 h-5 text-blue-600" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-900">
                                    {review.tenantName || 'Anonymous'}
                                </h4>
                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                    <FaCalendarAlt className="w-3 h-3" />
                                    {formatDate(review.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {renderStars(review.rating)}
                        </div>
                    </div>
                    <p className="text-gray-600 mt-3 leading-relaxed">
                        {review.comment}
                    </p>
                </motion.div>
            ))}
        </div>
    );
};

export default ReviewList;