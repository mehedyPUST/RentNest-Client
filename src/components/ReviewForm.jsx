// components/ReviewForm.jsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';

const ReviewForm = ({ propertyId, tenantId, tenantName, tenantEmail, onReviewAdded }) => {
    const { data: session } = useSession();
    const user = session?.user;

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        if (!comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId,
                    tenantId,
                    tenantName: tenantName || user?.name || 'Anonymous',
                    tenantEmail: tenantEmail || user?.email || '',
                    rating,
                    comment
                    // ✅ tenantPhoto পাঠানোর প্রয়োজন নেই, backend user collection থেকে নেবে
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit review');
            }

            toast.success('Review submitted successfully! 🎉');
            setRating(0);
            setComment('');
            setShowForm(false);

            if (onReviewAdded) {
                onReviewAdded(data.review);
            }

        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error(error.message || 'Failed to submit review');
        } finally {
            setLoading(false);
        }
    };

    // Star Rating Component
    const StarRating = ({ rating, hoverRating, onMouseEnter, onMouseLeave, onClick }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            let starIcon;
            if (i <= (hoverRating || rating)) {
                starIcon = <FaStar className="text-yellow-400" />;
            } else if (i - 0.5 <= (hoverRating || rating)) {
                starIcon = <FaStarHalfAlt className="text-yellow-400" />;
            } else {
                starIcon = <FaRegStar className="text-gray-300" />;
            }
            stars.push(
                <button
                    key={i}
                    type="button"
                    className="text-2xl sm:text-3xl transition-transform hover:scale-110"
                    onMouseEnter={() => onMouseEnter(i)}
                    onMouseLeave={onMouseLeave}
                    onClick={() => onClick(i)}
                >
                    {starIcon}
                </button>
            );
        }
        return <div className="flex gap-1">{stars}</div>;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {!showForm ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowForm(true)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    Write a Review
                </motion.button>
            ) : (
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Rating *
                        </label>
                        <StarRating
                            rating={rating}
                            hoverRating={hoverRating}
                            onMouseEnter={setHoverRating}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={setRating}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {rating > 0 ? `Selected: ${rating} star${rating > 1 ? 's' : ''}` : 'Select a rating'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            placeholder="Share your experience with this property..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                    </div>
                </motion.form>
            )}
        </div>
    );
};

export default ReviewForm;