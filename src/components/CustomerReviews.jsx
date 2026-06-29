// components/CustomerReviews.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { FaStar, FaUser, FaCalendarAlt, FaQuoteLeft } from 'react-icons/fa';
import { Sparkles, Loader2 } from 'lucide-react';

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.3,
        }
    }
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 50,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
            duration: 0.6,
        }
    },
    hover: {
        y: -8,
        scale: 1.02,
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
        }
    },
    tap: {
        scale: 0.98,
        transition: {
            duration: 0.1,
        }
    }
};

const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            duration: 0.8,
        }
    }
};

const starVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
        opacity: 1,
        scale: 1,
        transition: {
            delay: i * 0.08,
            type: "spring",
            stiffness: 200,
            damping: 10,
        }
    }),
    hover: {
        scale: 1.3,
        rotate: [0, -10, 10, -10, 0],
        transition: {
            duration: 0.5,
        }
    }
};

const CustomerReviews = () => {
    const router = useRouter();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hoveredCard, setHoveredCard] = useState(null);

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
                <motion.span
                    key={i}
                    custom={i}
                    variants={starVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                >
                    <FaStar
                        className={`w-4 h-4 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                </motion.span>
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

    const handleViewAllReviews = () => {
        router.push('/all-reviews');
    };

    // Loading Animation
    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            duration: 0.5,
                            type: "spring",
                            stiffness: 200,
                        }}
                    >
                        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="mt-4 text-gray-600 dark:text-gray-400"
                        >
                            Loading reviews...
                        </motion.p>
                    </motion.div>
                </div>
            </section>
        );
    }

    // Empty State
    if (error || reviews.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            className="text-6xl mb-4"
                        >
                            📝
                        </motion.div>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            No reviews yet. Be the first to review!
                        </p>
                    </motion.div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 overflow-hidden w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            What Our Clients Say
                        </span>
                    </motion.div>

                    <motion.h2
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Customer <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Reviews</span>
                    </motion.h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-emerald-600 rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                    </div>

                    <motion.p
                        className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        Real experiences from real tenants. Discover why thousands trust RentNest for their property needs.
                    </motion.p>
                </motion.div>

                {/* Reviews Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <AnimatePresence mode="wait">
                        {reviews.map((review, index) => (
                            <motion.div
                                key={review._id || index}
                                variants={cardVariants}
                                whileHover="hover"
                                whileTap="tap"
                                onHoverStart={() => setHoveredCard(index)}
                                onHoverEnd={() => setHoveredCard(null)}
                                className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 relative overflow-hidden cursor-pointer"
                            >
                                {/* Background gradient on hover */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                                    transition={{ duration: 0.3 }}
                                />

                                {/* Content */}
                                <div className="relative z-10">
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <motion.div
                                            className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-700 flex items-center justify-center flex-shrink-0"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {review.tenantPhoto ? (
                                                <motion.img
                                                    src={review.tenantPhoto}
                                                    alt={review.tenantName || 'User'}
                                                    className="w-full h-full object-cover"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ duration: 0.3 }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.parentElement.innerHTML = review.tenantName?.charAt(0) || 'U';
                                                        e.target.parentElement.className = 'w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0';
                                                    }}
                                                />
                                            ) : (
                                                <motion.span
                                                    className="text-white font-bold text-lg"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 200 }}
                                                >
                                                    {review.tenantName?.charAt(0) || 'U'}
                                                </motion.span>
                                            )}
                                        </motion.div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <motion.h4
                                                        className="font-semibold text-gray-900 dark:text-white"
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                    >
                                                        {review.tenantName || 'Anonymous'}
                                                    </motion.h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <div className="flex gap-0.5">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                        <motion.span
                                                            className="text-xs text-gray-400"
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            transition={{ delay: 0.3 }}
                                                        >
                                                            {review.rating}.0
                                                        </motion.span>
                                                    </div>
                                                </div>
                                                <motion.span
                                                    className="text-xs text-gray-400 flex items-center gap-1 flex-shrink-0"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    <FaCalendarAlt className="w-3 h-3" />
                                                    {formatDate(review.createdAt)}
                                                </motion.span>
                                            </div>

                                            {/* Review Comment */}
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                                                <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm leading-relaxed line-clamp-3">
                                                    <FaQuoteLeft className="w-3 h-3 text-emerald-400 inline mr-1" />
                                                    {review.comment}
                                                </p>
                                            </motion.div>

                                            {/* Property Info */}
                                            {review.propertyTitle && (
                                                <motion.div
                                                    className="mt-2 text-xs text-gray-400 flex items-center gap-1"
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.3 }}
                                                >
                                                    <span>🏠</span>
                                                    <span>{review.propertyTitle}</span>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* View All Reviews Button - ✅ Functional */}
                {reviews.length > 0 && (
                    <motion.div
                        className="text-center mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.button
                            onClick={handleViewAllReviews}
                            className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-500"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)",
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            View All Reviews
                            <motion.span
                                className="inline-block ml-2"
                                animate={{ x: [0, 5, 0] }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                }}
                            >
                                →
                            </motion.span>
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default CustomerReviews;