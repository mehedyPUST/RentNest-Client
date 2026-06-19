'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaQuoteLeft } from 'react-icons/fa';
import { Sparkles, ChevronLeft, ChevronRight, User, Calendar } from 'lucide-react';

const CustomerReviews = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    // Static review data - replace with MongoDB data later
    const reviews = [
        {
            id: 1,
            name: "Sarah Johnson",
            location: "New York, NY",
            rating: 5,
            date: "March 2024",
            review: "RentNest made finding my dream apartment incredibly easy! The platform's search filters were spot-on, and within a week, I found the perfect place. The virtual tour feature saved me so much time. Highly recommend!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            property: "Luxury Villa in Malibu",
            verified: true
        },
        {
            id: 2,
            name: "Michael Chen",
            location: "San Francisco, CA",
            rating: 5,
            date: "February 2024",
            review: "As a first-time renter, I was nervous about the process. The RentNest team guided me through every step. The property listings are accurate, and the landlord communication was seamless. Found my dream home in just 3 days!",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            property: "Modern Apartment in SF",
            verified: true
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            location: "Austin, TX",
            rating: 5,
            date: "January 2024",
            review: "The best property search experience I've ever had! RentNest's verified listings gave me peace of mind. The agents were professional and responsive. I found a beautiful home for my family within our budget. Absolutely thrilled!",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            property: "Family House in Austin",
            verified: true
        },
        {
            id: 4,
            name: "David Thompson",
            location: "Miami, FL",
            rating: 5,
            date: "December 2023",
            review: "RentNest exceeded all my expectations! The platform is intuitive, the property photos are high-quality, and the booking process was hassle-free. I found a stunning waterfront condo in record time. Couldn't be happier!",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
            property: "Waterfront Condo in Miami",
            verified: true
        }
    ];

    const totalReviews = reviews.length;

    const nextReview = () => {
        setDirection(1);
        setCurrentIndex((prev) => (prev + 1) % totalReviews);
    };

    const prevReview = () => {
        setDirection(-1);
        setCurrentIndex((prev) => (prev - 1 + totalReviews) % totalReviews);
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 fill-current" />);
        }

        if (hasHalfStar) {
            stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 fill-current" />);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
        }

        return stars;
    };

    // Animation Variants
    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const reviewVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95,
        }),
        center: {
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
        exit: (direction) => ({
            x: direction > 0 ? -100 : 100,
            opacity: 0,
            scale: 0.95,
            transition: {
                duration: 0.3,
                ease: "easeIn",
            },
        }),
    };

    const statsVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const statItemVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 300,
            },
        },
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
        tap: {
            scale: 0.9,
            transition: {
                duration: 0.1,
            },
        },
    };

    const dotVariants = {
        inactive: {
            scale: 1,
            transition: { duration: 0.3 }
        },
        active: {
            scale: 1.2,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15
            }
        }
    };

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/50 dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    className="text-center mb-12"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer Reviews</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm">4.9/5</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        What Our <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Tenants Say</span>
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
                        Real stories from real tenants who found their dream homes through RentNest.
                    </p>
                </motion.div>

                {/* Reviews Display */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Main Review Card */}
                    <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-8 md:p-10 overflow-hidden">
                        {/* Quote Icon */}
                        <motion.div
                            className="absolute -top-4 -left-4 opacity-10"
                            initial={{ rotate: -15, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <FaQuoteLeft className="w-16 h-16 text-blue-600 dark:text-blue-400" />
                        </motion.div>

                        {/* Floating background decoration */}
                        <motion.div
                            className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.5, 0.3]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />

                        {/* Review Content with Animation */}
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentIndex}
                                custom={direction}
                                variants={reviewVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                className="relative z-10"
                            >
                                {/* Stars */}
                                <motion.div
                                    className="flex items-center gap-1 mb-4"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {renderStars(reviews[currentIndex].rating)}
                                    <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        {reviews[currentIndex].rating}/5
                                    </span>
                                </motion.div>

                                {/* Review Text */}
                                <motion.p
                                    className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.15 }}
                                >
                                    "{reviews[currentIndex].review}"
                                </motion.p>

                                {/* Reviewer Info */}
                                <motion.div
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-6 gap-4 sm:gap-0"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <motion.div
                                            className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-blue-500/20"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <img
                                                src={reviews[currentIndex].avatar}
                                                alt={reviews[currentIndex].name}
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {reviews[currentIndex].name}
                                            </h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <User className="w-3.5 h-3.5" />
                                                <span>{reviews[currentIndex].location}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{reviews[currentIndex].date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <motion.div
                                        className="text-right"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                            <motion.span
                                                className="w-1.5 h-1.5 rounded-full bg-green-500"
                                                animate={{ scale: [1, 1.5, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                            Verified Tenant
                                        </span>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {reviews[currentIndex].property}
                                        </p>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-4 mt-8">
                        <motion.button
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={prevReview}
                            className="p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                            aria-label="Previous review"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                        <motion.button
                            variants={buttonVariants}
                            initial="initial"
                            whileHover="hover"
                            whileTap="tap"
                            onClick={nextReview}
                            className="p-3 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
                            aria-label="Next review"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </motion.button>
                    </div>

                    {/* Dot Indicators */}
                    <div className="flex justify-center gap-2 mt-6">
                        {reviews.map((_, index) => (
                            <motion.button
                                key={index}
                                variants={dotVariants}
                                initial="inactive"
                                animate={index === currentIndex ? "active" : "inactive"}
                                onClick={() => {
                                    setDirection(index > currentIndex ? 1 : -1);
                                    setCurrentIndex(index);
                                }}
                                className={`transition-all duration-300 rounded-full ${index === currentIndex
                                    ? 'w-8 h-2.5 bg-gradient-to-r from-blue-600 to-indigo-600'
                                    : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                                    }`}
                                aria-label={`Go to review ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats Bar */}
                <motion.div
                    className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                    variants={statsVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {[
                        { value: "4.9", label: "Average Rating" },
                        { value: "1.2K+", label: "Total Reviews" },
                        { value: "98%", label: "Satisfaction Rate" },
                        { value: "5K+", label: "Happy Tenants" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={statItemVariants}
                            whileHover="hover"
                            className="text-center p-4 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-800/50 cursor-default"
                        >
                            <motion.div
                                className="text-2xl font-bold text-gray-900 dark:text-white"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {stat.value}
                            </motion.div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default CustomerReviews;