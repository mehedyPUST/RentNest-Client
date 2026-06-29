'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaBuilding, FaHome, FaCity } from 'react-icons/fa';
import { Sparkles, ArrowRight, Users, TrendingUp, Loader2 } from 'lucide-react';

const TopLocations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Location Icons mapping
    const locationIcons = [FaBuilding, FaHome, FaCity, FaBuilding, FaHome, FaCity];

    // Random growth data
    const growthData = ['+12.5%', '+8.3%', '+15.7%', '+18.2%', '+6.8%', '+10.4%'];
    const avgPriceData = ['$850,000', '$725,000', '$620,000', '$550,000', '$480,000', '$520,000'];

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch properties with location aggregation
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/locations?limit=6`,
                    { cache: 'no-store' }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch locations: ${res.status}`);
                }

                const data = await res.json();
                console.log('📥 Locations Response:', data);

                let locationData = [];

                if (data.success && data.locations) {
                    // Transform location data
                    locationData = data.locations.map((loc, index) => ({
                        id: index + 1,
                        name: loc.location || 'Unknown Location',
                        state: loc.location?.split(',')[1]?.trim() || 'N/A',
                        properties: loc.count || 0,
                        image: getRandomImage(index),
                        avgPrice: avgPriceData[index % avgPriceData.length],
                        growth: growthData[index % growthData.length],
                        icon: locationIcons[index % locationIcons.length]
                    }));
                } else {
                    // Fallback: Fetch properties and group by location
                    const propsRes = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?status=approved&limit=50`,
                        { cache: 'no-store' }
                    );

                    if (propsRes.ok) {
                        const propsData = await propsRes.json();
                        const properties = propsData.success ? propsData.properties : [];

                        // Group by location
                        const locationMap = {};
                        properties.forEach(prop => {
                            const loc = prop.location || 'Unknown';
                            if (locationMap[loc]) {
                                locationMap[loc]++;
                            } else {
                                locationMap[loc] = 1;
                            }
                        });

                        // Sort and take top 6
                        const sortedLocations = Object.entries(locationMap)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 6);

                        locationData = sortedLocations.map(([name, count], index) => ({
                            id: index + 1,
                            name: name,
                            state: name.split(',')[1]?.trim() || 'N/A',
                            properties: count,
                            image: getRandomImage(index),
                            avgPrice: avgPriceData[index % avgPriceData.length],
                            growth: growthData[index % growthData.length],
                            icon: locationIcons[index % locationIcons.length]
                        }));
                    }
                }

                // If still empty, use dummy data from database
                if (locationData.length === 0) {
                    const propsRes = await fetch(
                        `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?status=approved&limit=50`,
                        { cache: 'no-store' }
                    );

                    if (propsRes.ok) {
                        const propsData = await propsRes.json();
                        const properties = propsData.success ? propsData.properties : [];

                        const locationMap = {};
                        properties.forEach(prop => {
                            const loc = prop.location || 'Unknown';
                            if (locationMap[loc]) {
                                locationMap[loc]++;
                            } else {
                                locationMap[loc] = 1;
                            }
                        });

                        const sortedLocations = Object.entries(locationMap)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 6);

                        locationData = sortedLocations.map(([name, count], index) => ({
                            id: index + 1,
                            name: name,
                            state: name.split(',')[1]?.trim() || 'N/A',
                            properties: count,
                            image: getRandomImage(index),
                            avgPrice: avgPriceData[index % avgPriceData.length],
                            growth: growthData[index % growthData.length],
                            icon: locationIcons[index % locationIcons.length]
                        }));
                    }
                }

                setLocations(locationData);

            } catch (err) {
                console.error('Error fetching locations:', err);
                setError(err.message);
                setLocations([]);
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []);

    // Random images for locations
    const getRandomImage = (index) => {
        const images = [
            "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1494522358652-f30e61a60313?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ];
        return images[index % images.length];
    };

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

    // Loading State
    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                        >
                            <Loader2 className="w-12 h-12 text-emerald-600" />
                        </motion.div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading locations...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">📍</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            Unable to load locations
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {error}
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty State
    if (locations.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🌍</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            No Locations Found
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Check back later for new properties
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8">

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
                            <FaMapMarkerAlt className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Top Locations</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Popular <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Cities</span>
                    </h2>

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
                                href={`/all-properties?location=${encodeURIComponent(location.name)}`}
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
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x600/CCCCCC/FFFFFF?text=No+Image';
                                        }}
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

                {/* View All Locations - ✅ Redirect to /all-properties */}
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
                            href="/all-properties"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white dark:bg-gray-900 border-2 border-emerald-600 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
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