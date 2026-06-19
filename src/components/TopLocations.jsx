'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBuilding, FaHome, FaCity } from 'react-icons/fa';
import { Sparkles, ArrowRight, Users, TrendingUp } from 'lucide-react';

const TopLocations = () => {
    const locations = [
        {
            id: 1,
            name: "New York City",
            state: "NY",
            properties: 1247,
            image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            avgPrice: "$850,000",
            growth: "+12.5%",
            icon: FaBuilding
        },
        {
            id: 2,
            name: "Los Angeles",
            state: "CA",
            properties: 983,
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            avgPrice: "$725,000",
            growth: "+8.3%",
            icon: FaHome
        },
        {
            id: 3,
            name: "Miami",
            state: "FL",
            properties: 756,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            avgPrice: "$620,000",
            growth: "+15.7%",
            icon: FaCity
        },
        {
            id: 4,
            name: "Austin",
            state: "TX",
            properties: 689,
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            avgPrice: "$550,000",
            growth: "+18.2%",
            icon: FaBuilding
        },
        {
            id: 5,
            name: "Chicago",
            state: "IL",
            properties: 542,
            image: "https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            avgPrice: "$480,000",
            growth: "+6.8%",
            icon: FaHome
        },
        {
            id: 6,
            name: "Denver",
            state: "CO",
            properties: 478,
            image: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            avgPrice: "$520,000",
            growth: "+10.4%",
            icon: FaCity
        }
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

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

    const locationVariants = {
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
                duration: 0.6,
                ease: "easeOut",
            },
        },
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const imageVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const contentVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.3,
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    const growthBadgeVariants = {
        initial: { scale: 0, rotate: -180 },
        animate: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.4,
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
    };

    const arrowVariants = {
        initial: { x: 0 },
        hover: {
            x: 5,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
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
                duration: 0.1,
            },
        },
    };

    return (
        <section className="py-20 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
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
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <FaMapMarkerAlt className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Locations</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Popular <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Cities</span>
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
                        Discover the most sought-after locations with the highest property demand and growth potential.
                    </p>
                </motion.div>

                {/* Locations Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {locations.map((location) => (
                        <motion.div
                            key={location.id}
                            variants={locationVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                        >
                            <Link
                                href={`/properties?location=${location.name}`}
                                className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 block"
                            >
                                {/* Image */}
                                <motion.div
                                    className="aspect-[4/3] overflow-hidden"
                                    variants={imageVariants}
                                    initial="initial"
                                    whileHover="hover"
                                >
                                    <img
                                        src={location.image}
                                        alt={location.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                </motion.div>

                                {/* Content */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 p-6 text-white"
                                    variants={contentVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <motion.h3
                                                className="text-xl font-bold"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                                {location.name}
                                            </motion.h3>
                                            <p className="text-sm text-white/80">{location.state}</p>
                                        </div>
                                        <motion.div
                                            className="flex items-center gap-1 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full"
                                            variants={growthBadgeVariants}
                                            initial="initial"
                                            whileInView="animate"
                                            whileHover="hover"
                                            viewport={{ once: true }}
                                        >
                                            <motion.span
                                                animate={{
                                                    scale: [1, 1.2, 1],
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut",
                                                }}
                                            >
                                                <TrendingUp className="w-3 h-3 text-green-400" />
                                            </motion.span>
                                            <span className="text-xs font-semibold text-green-400">{location.growth}</span>
                                        </motion.div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-white/80">
                                        <div className="flex items-center gap-1.5">
                                            <FaBuilding className="w-3.5 h-3.5" />
                                            <span>{location.properties.toLocaleString()} properties</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-white/50">|</span>
                                            <span>{location.avgPrice}</span>
                                        </div>
                                    </div>

                                    {/* Explore Button */}
                                    <motion.div
                                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-white/90 group-hover:text-white transition-colors"
                                        variants={arrowVariants}
                                        initial="initial"
                                        whileHover="hover"
                                    >
                                        Explore properties
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.div>
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View All Locations */}
                <motion.div
                    className="text-center mt-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <motion.div
                        variants={buttonVariants}
                        initial="initial"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Link
                            href="/properties"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-gray-900 border-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 dark:hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                            <motion.span
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <FaMapMarkerAlt className="w-4 h-4" />
                            </motion.span>
                            View All Locations
                            <motion.span
                                animate={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default TopLocations;