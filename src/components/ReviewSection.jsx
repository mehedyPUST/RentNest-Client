// components/ReviewSection.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';
import { motion } from 'framer-motion';
import { Star, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ReviewSection = ({ propertyId }) => {
    const { data: session } = useSession();
    const user = session?.user;
    const [canReview, setCanReview] = useState(false);
    const [alreadyReviewed, setAlreadyReviewed] = useState(false);
    const [checking, setChecking] = useState(true);
    const [refreshKey, setRefreshKey] = useState(0);

    // ✅ Check if user can review
    useEffect(() => {
        const checkReviewStatus = async () => {
            if (!user || !propertyId) {
                setChecking(false);
                return;
            }

            try {
                const tenantId = user.id || user._id;
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reviews/check/${propertyId}/${tenantId}`
                );
                const data = await response.json();

                if (data.success) {
                    setCanReview(data.canReview);
                    setAlreadyReviewed(data.alreadyReviewed);
                }
            } catch (error) {
                console.error('Error checking review status:', error);
            } finally {
                setChecking(false);
            }
        };

        checkReviewStatus();
    }, [propertyId, user]);

    const handleReviewAdded = () => {
        setRefreshKey(prev => prev + 1);
        setCanReview(false);
        setAlreadyReviewed(true);
        toast.success('Review submitted successfully!');
    };

    return (
        <div className="mt-12 border-t border-gray-200 pt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Reviews & Ratings
                </h2>
            </div>

            {/* ✅ Review Form - শুধু booked tenant দেখতে পাবে */}
            {user && !checking && canReview && (
                <div className="mb-8">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <p className="text-green-700 flex items-center gap-2">
                            <span className="text-lg">✅</span>
                            You can review this property because you have booked it!
                        </p>
                    </div>
                    <ReviewForm
                        propertyId={propertyId}
                        tenantId={user.id || user._id}
                        tenantName={user.name}
                        tenantEmail={user.email}
                        onReviewAdded={handleReviewAdded}
                    />
                </div>
            )}

            {/* ✅ Already Reviewed Message */}
            {user && !checking && alreadyReviewed && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <p className="text-blue-700 flex items-center gap-2">
                        <span className="text-lg">📝</span>
                        You have already reviewed this property. Thank you for your feedback!
                    </p>
                </div>
            )}

            {/* ✅ Not booked message */}
            {user && !checking && !canReview && !alreadyReviewed && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                    <p className="text-yellow-700 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        You can only review properties you have booked and completed.
                    </p>
                </div>
            )}

            {/* ✅ Not logged in message */}
            {!user && (
                <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
                    <p className="text-gray-600">
                        <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => router.push('/login')}
                        >
                            Login
                        </span>
                        {' '}to write a review
                    </p>
                </div>
            )}

            {/* ✅ Review List */}
            <ReviewList key={refreshKey} propertyId={propertyId} />
        </div>
    );
};

export default ReviewSection;