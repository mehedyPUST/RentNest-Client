'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@heroui/react";
import { FaSearch } from 'react-icons/fa';
import { Building2, MapPin, DollarSign, Bed, Bath, Square, Sparkles, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Banner = () => {
    const router = useRouter();
    const [searchParams, setSearchParams] = useState({
        location: '',
        propertyType: '',
        minPrice: '',
        maxPrice: '',
    });
    const [isVisible, setIsVisible] = useState(false);
    const [activeFilter, setActiveFilter] = useState(null);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // ✅ Add Property Form এর সাথে মিল রেখে Property Types
    const propertyTypes = [
        { key: "apartment", label: "Apartment" },
        { key: "house", label: "House" },
        { key: "villa", label: "Villa" },
        { key: "commercial space", label: "Commercial Space" },
    ];

    const priceRanges = [
        { key: "0", label: "$0" },
        { key: "500", label: "$500" },
        { key: "1000", label: "$1,000" },
        { key: "2000", label: "$2,000" },
        { key: "3000", label: "$3,000" },
        { key: "5000", label: "$5,000" },
        { key: "10000", label: "$10,000" },
        { key: "20000", label: "$20,000" },
        { key: "50000", label: "$50,000" },
    ];

    const handleSearch = (e) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (searchParams.location) {
            params.append('location', searchParams.location);
        }
        if (searchParams.propertyType) {
            params.append('propertyType', searchParams.propertyType);
        }
        if (searchParams.minPrice) {
            params.append('minPrice', searchParams.minPrice);
        }
        if (searchParams.maxPrice) {
            params.append('maxPrice', searchParams.maxPrice);
        }

        const queryString = params.toString();
        const url = queryString ? `/all-properties?${queryString}` : '/all-properties';

        router.push(url);
    };

    const handleQuickFilter = (filterType, value) => {
        setActiveFilter(value);
        const params = new URLSearchParams();

        switch (filterType) {
            case 'beds':
                params.append('bedrooms', '2');
                break;
            case 'baths':
                params.append('bathrooms', '2');
                break;
            case 'sqft':
                params.append('minPrice', '1000');
                break;
            case 'petFriendly':
                params.append('petFriendly', 'true');
                break;
            default:
                break;
        }

        setTimeout(() => {
            router.push(`/all-properties?${params.toString()}`);
        }, 300);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({ ...prev, [name]: value }));
    };

    const quickFilters = [
        { key: 'beds', label: '2+ Beds', icon: Bed, action: 'beds' },
        { key: 'baths', label: '2+ Baths', icon: Bath, action: 'baths' },
        { key: 'sqft', label: '1000+ sqft', icon: Square, action: 'sqft' },
        { key: 'petFriendly', label: 'Pet Friendly', icon: FaSearch, action: 'petFriendly' },
    ];

    // Advanced Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
                ease: "easeOut",
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8,
            },
        },
    };

    const floatVariants = {
        animate: {
            y: [0, -25, 0],
            transition: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const floatVariants2 = {
        animate: {
            y: [0, -30, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
            },
        },
    };

    const floatVariants3 = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
            },
        },
    };

    const titleVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 150,
                damping: 12,
                duration: 1,
            },
        },
    };

    const gradientTextVariants = {
        hidden: { opacity: 0, x: -30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 120,
                damping: 15,
                delay: 0.3,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const badgeVariants = {
        hidden: { opacity: 0, y: -20, scale: 0.8 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
    };

    const searchBarVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 20,
                delay: 0.4,
                duration: 0.8,
            },
        },
        hover: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const inputVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.03,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
        focus: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
        tap: {
            scale: 0.95,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const filterVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 10 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.5,
            },
        },
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
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const trustVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.6 + (i * 0.1),
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        }),
        hover: {
            scale: 1.1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
    };

    const pulseVariants = {
        animate: {
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden w-full">
            {/* High-Quality Background Image with Reduced Gradient Opacity */}
            <div className="absolute inset-0 z-0 w-full h-full">
                {/* ✅ Gradient opacity কমানো হয়েছে */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-emerald-800/40 to-emerald-900/50 z-10" />
                <motion.div
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
                    }}
                />
                {/* ✅ Gradient overlay opacity কমানো হয়েছে */}
                <motion.div
                    className="absolute inset-0 z-10 bg-gradient-to-t from-emerald-900/30 via-transparent to-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                />
            </div>

            {/* Floating Property Icons with Advanced Animations */}
            <motion.div
                className="absolute top-20 left-10 hidden xl:block z-10"
                variants={floatVariants}
                animate="animate"
            >
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border border-emerald-200/50 dark:border-emerald-700/50"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Building2 className="w-10 h-10 text-emerald-600" />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-28 right-10 hidden xl:block z-10"
                variants={floatVariants2}
                animate="animate"
            >
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border border-emerald-200/50 dark:border-emerald-700/50"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <MapPin className="w-10 h-10 text-emerald-600" />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute top-1/3 right-16 hidden xl:block z-10"
                variants={floatVariants3}
                animate="animate"
            >
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-emerald-200/50 dark:border-emerald-700/50"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <Users className="w-8 h-8 text-emerald-600" />
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    className="max-w-5xl mx-auto text-center space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "hidden"}
                >
                    {/* Welcome Badge */}
                    <motion.div
                        variants={badgeVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium shadow-lg shadow-emerald-500/10"
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-emerald-400" />
                        </motion.span>
                        Premium Real Estate Platform
                    </motion.div>

                    {/* Compelling Title */}
                    <motion.h1
                        variants={titleVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tighter leading-none text-white"
                    >
                        Find Your{" "}
                        <motion.span
                            variants={gradientTextVariants}
                            initial="hidden"
                            animate="visible"
                            whileHover="hover"
                            className="bg-gradient-to-r from-emerald-300 via-emerald-200 to-emerald-100 bg-clip-text text-transparent inline-block"
                        >
                            Dream Home
                        </motion.span>
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Discover exceptional properties for rent and sale. From luxurious villas to modern apartments,
                        we connect you with the perfect space to call home.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        variants={searchBarVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-500/10"
                    >
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Location Input */}
                            <motion.div
                                className="relative"
                                variants={inputVariants}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="focus"
                            >
                                <input
                                    name="location"
                                    type="text"
                                    placeholder="Location, City or ZIP"
                                    value={searchParams.location}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                                />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
                            </motion.div>

                            {/* Property Type */}
                            <motion.div
                                className="relative"
                                variants={inputVariants}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="focus"
                            >
                                <select
                                    name="propertyType"
                                    value={searchParams.propertyType}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 pr-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                                >
                                    <option value="" className="text-gray-900">Property Type</option>
                                    {propertyTypes.map((type) => (
                                        <option key={type.key} value={type.key} className="text-gray-900">
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Min Price */}
                            <motion.div
                                className="relative"
                                variants={inputVariants}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="focus"
                            >
                                <select
                                    name="minPrice"
                                    value={searchParams.minPrice}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 pr-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                                >
                                    <option value="" className="text-gray-900">Min Price</option>
                                    {priceRanges.map((price) => (
                                        <option key={price.key} value={price.key} className="text-gray-900">
                                            {price.label}
                                        </option>
                                    ))}
                                </select>
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Max Price */}
                            <motion.div
                                className="relative"
                                variants={inputVariants}
                                initial="initial"
                                whileHover="hover"
                                whileFocus="focus"
                            >
                                <select
                                    name="maxPrice"
                                    value={searchParams.maxPrice}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 pr-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300"
                                >
                                    <option value="" className="text-gray-900">Max Price</option>
                                    {priceRanges.map((price) => (
                                        <option key={price.key} value={price.key} className="text-gray-900">
                                            {price.label}
                                        </option>
                                    ))}
                                </select>
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </motion.div>

                            {/* Search Button */}
                            <motion.div
                                className="lg:col-span-4 mt-2"
                                variants={buttonVariants}
                                initial="initial"
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-lg rounded-2xl shadow-xl shadow-emerald-500/30 transition-all duration-300"
                                    startContent={<FaSearch className="w-4 h-4" />}
                                >
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.05, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                    >
                                        Search Properties
                                    </motion.span>
                                </Button>
                            </motion.div>
                        </form>

                        {/* Quick Filters */}
                        <motion.div
                            className="flex flex-wrap gap-2 mt-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.6 }}
                        >
                            {quickFilters.map((filter, index) => (
                                <motion.button
                                    key={filter.key}
                                    variants={filterVariants}
                                    initial="hidden"
                                    animate="visible"
                                    whileHover="hover"
                                    whileTap="tap"
                                    custom={index}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 border border-white/10 transition-all duration-300 text-sm"
                                    onClick={() => handleQuickFilter(filter.action, filter.key)}
                                >
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.2, 1],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                            delay: index * 0.2,
                                        }}
                                    >
                                        <filter.icon className="w-3 h-3" />
                                    </motion.span>
                                    {filter.label}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-8 pt-4 text-white/70 text-sm"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {[
                            "✓ Verified Listings",
                            "✓ 5,000+ Properties",
                            "✓ Expert Agents",
                            "✓ 24/7 Support"
                        ].map((text, index) => (
                            <motion.div
                                key={index}
                                custom={index}
                                variants={trustVariants}
                                initial="hidden"
                                animate="visible"
                                whileHover="hover"
                                className="flex items-center gap-2 cursor-default"
                            >
                                <motion.span
                                    variants={pulseVariants}
                                    animate="animate"
                                    className="text-emerald-400 text-lg"
                                >
                                    ✓
                                </motion.span>
                                <span>{text}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative floating particles */}
            <AnimatePresence>
                {isVisible && (
                    <>
                        <motion.div
                            className="absolute top-1/4 left-[5%] w-2 h-2 rounded-full bg-emerald-400/30"
                            animate={{
                                y: [0, -100, 0],
                                x: [0, 50, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1,
                            }}
                        />
                        <motion.div
                            className="absolute bottom-1/3 right-[8%] w-3 h-3 rounded-full bg-emerald-300/20"
                            animate={{
                                y: [0, -80, 0],
                                x: [0, -40, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 2,
                            }}
                        />
                        <motion.div
                            className="absolute top-2/3 left-[15%] w-1.5 h-1.5 rounded-full bg-white/20"
                            animate={{
                                y: [0, -60, 0],
                                x: [0, 30, 0],
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 0.5,
                            }}
                        />
                    </>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Banner;