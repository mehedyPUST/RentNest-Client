'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
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

        router.push(`/all-properties?${params.toString()}`);
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

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const floatVariants = {
        animate: {
            y: [0, -20, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden w-full">
            {/* High-Quality Background Image */}
            <div className="absolute inset-0 z-0 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70 z-10" />
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-full bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')`,
                    }}
                />
            </div>

            {/* Floating Property Icons */}
            <motion.div
                className="absolute top-20 left-10 hidden lg:block z-10"
                variants={floatVariants}
                animate="animate"
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <Building2 className="w-8 h-8 text-emerald-600" />
                </div>
            </motion.div>

            <motion.div
                className="absolute bottom-20 right-10 hidden lg:block z-10"
                variants={floatVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <MapPin className="w-8 h-8 text-emerald-600" />
                </div>
            </motion.div>

            <motion.div
                className="absolute top-1/3 right-20 hidden lg:block z-10"
                variants={floatVariants}
                animate="animate"
                transition={{ delay: 1 }}
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                    <Users className="w-6 h-6 text-emerald-600" />
                </div>
            </motion.div>

            <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 py-20">
                <motion.div
                    className="max-w-4xl mx-auto text-center space-y-8"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Welcome Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white/90 text-sm font-medium"
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </motion.span>
                        Premium Real Estate Platform
                    </motion.div>

                    {/* Compelling Title */}
                    <motion.h1
                        variants={itemVariants}
                        className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tighter leading-none text-white"
                    >
                        Find Your{" "}
                        <motion.span
                            className="bg-gradient-to-r from-amber-300 to-white bg-clip-text text-transparent"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            Dream Home
                        </motion.span>
                    </motion.h1>

                    {/* Engaging Description */}
                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Discover exceptional properties for rent and sale. From luxurious villas to modern apartments,
                        we connect you with the perfect space to call home.
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-8 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.3 }}
                    >
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                            {/* Location */}
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <input
                                    name="location"
                                    type="text"
                                    placeholder="📍 Location, City or ZIP"
                                    value={searchParams.location}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                />
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4 pointer-events-none" />
                            </motion.div>

                            {/* Property Type - ✅ Add Property Form এর সাথে মিল */}
                            <motion.div
                                className="relative"
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <select
                                    name="propertyType"
                                    value={searchParams.propertyType}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 pr-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                >
                                    <option value="" className="text-gray-900">🏠 Property Type</option>
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
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <select
                                    name="minPrice"
                                    value={searchParams.minPrice}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 pr-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                >
                                    <option value="" className="text-gray-900">💰 Min Price</option>
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
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <select
                                    name="maxPrice"
                                    value={searchParams.maxPrice}
                                    onChange={handleInputChange}
                                    className="w-full h-12 px-4 pl-12 pr-10 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white placeholder:text-white/50 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                                >
                                    <option value="" className="text-gray-900">💰 Max Price</option>
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
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    type="submit"
                                    size="lg"
                                    className="w-full h-14 bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-black font-semibold text-lg rounded-2xl shadow-xl shadow-amber-500/30 transition-all"
                                    startContent={<FaSearch className="w-4 h-4" />}
                                >
                                    Search Properties
                                </Button>
                            </motion.div>
                        </form>

                        {/* Quick Filters */}
                        <motion.div
                            className="flex flex-wrap gap-2 mt-4 justify-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            {quickFilters.map((filter) => (
                                <motion.button
                                    key={filter.key}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 border border-white/10 transition-all text-sm"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleQuickFilter(filter.action, filter.key)}
                                >
                                    <filter.icon className="w-3 h-3" />
                                    {filter.label}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        className="flex flex-wrap justify-center gap-8 pt-4 text-white/70 text-sm"
                        variants={itemVariants}
                    >
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span className="text-green-400 text-lg">✓</span> Verified Listings
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span className="text-green-400 text-lg">✓</span> 5,000+ Properties
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span className="text-green-400 text-lg">✓</span> Expert Agents
                        </motion.div>
                        <motion.div
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <span className="text-green-400 text-lg">✓</span> 24/7 Support
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Banner;