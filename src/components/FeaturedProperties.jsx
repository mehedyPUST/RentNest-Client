'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { Building2, Sparkles, Eye, Home, Loader2 } from 'lucide-react';

const FeaturedProperties = () => {
    const router = useRouter();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?status=approved&limit=6&sortBy=createdAt`,
                    { cache: 'no-store' }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch properties: ${res.status}`);
                }

                const data = await res.json();
                console.log('📥 Featured Properties Response:', data);

                let featuredProps = [];
                if (data.success && data.properties) {
                    featuredProps = data.properties;
                } else if (Array.isArray(data)) {
                    featuredProps = data;
                } else {
                    featuredProps = [];
                }

                setProperties(featuredProps);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err.message);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleViewDetails = (propertyId) => {
        console.log('Viewing property:', propertyId);
        router.push(`/all-properties/${propertyId}`);
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString()}`;
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
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

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95
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
                damping: 20
            }
        }
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

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1
            }
        }
    };

    const imageVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const favoriteButtonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.15,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15
            }
        },
        tap: {
            scale: 0.9,
            transition: {
                duration: 0.1
            }
        }
    };

    // Loading State
    if (loading) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="inline-block"
                        >
                            <Loader2 className="w-12 h-12 text-emerald-600" />
                        </motion.div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading properties...</p>
                    </div>
                </div>
            </section>
        );
    }

    // Error State
    if (error) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🏠</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            Unable to load properties
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
    if (properties.length === 0) {
        return (
            <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                            No Featured Properties
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Check back later for new approved listings
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
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
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Properties</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Handpicked <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Properties</span>
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        ></motion.div>
                        <motion.div
                            className="w-2 h-2 bg-emerald-600 rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                        ></motion.div>
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        ></motion.div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Discover our curated selection of premium properties. Each home is handpicked for quality, location, and value.
                    </p>
                </motion.div>

                {/* Properties Grid - 3 Columns */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {properties.map((property) => {
                        const imageUrl = property.images && property.images.length > 0
                            ? property.images[0]
                            : 'https://via.placeholder.com/800x600/CCCCCC/FFFFFF?text=No+Image';

                        const bedrooms = property.specifications?.bedrooms || 0;
                        const bathrooms = property.specifications?.bathrooms || 0;
                        const sqft = property.specifications?.size || 'N/A';
                        const propertyId = property._id?.$oid || property._id || property.id;

                        return (
                            <motion.div
                                key={propertyId}
                                variants={cardVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true }}
                                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200/50 dark:border-gray-800/50"
                            >
                                {/* Image Container */}
                                <motion.div
                                    className="relative overflow-hidden aspect-[4/3] cursor-pointer"
                                    variants={imageVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    onClick={() => handleViewDetails(propertyId)}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={property.title || 'Property'}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x600/CCCCCC/FFFFFF?text=No+Image';
                                        }}
                                    />

                                    {/* Property Type Badge - Capitalized */}
                                    <motion.span
                                        className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-medium shadow-lg capitalize"
                                        initial={{ x: 50, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.4 }}
                                        viewport={{ once: true }}
                                    >
                                        {capitalizeFirst(property.propertyType)}
                                    </motion.span>

                                    {/* Favorite Button */}
                                    <motion.button
                                        className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg"
                                        variants={favoriteButtonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log('Favorite clicked', propertyId);
                                        }}
                                    >
                                        <FaHeart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
                                    </motion.button>
                                </motion.div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-3">
                                        <motion.div
                                            className="text-2xl font-bold text-gray-900 dark:text-white"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            {formatPrice(property.price)}
                                        </motion.div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                            <Eye className="w-4 h-4" />
                                            <span>{property.rentType || 'N/A'}</span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                        {property.title || 'Untitled Property'}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                        <FaMapMarkerAlt className="w-3.5 h-3.5" />
                                        <span>{property.location || 'Location not specified'}</span>
                                    </div>

                                    {/* Features */}
                                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <motion.div
                                            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FaBed className="w-4 h-4" />
                                            <span>{bedrooms}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FaBath className="w-4 h-4" />
                                            <span>{bathrooms}</span>
                                        </motion.div>
                                        <motion.div
                                            className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                        >
                                            <FaRulerCombined className="w-4 h-4" />
                                            <span>{typeof sqft === 'number' ? sqft.toLocaleString() : sqft} sqft</span>
                                        </motion.div>
                                    </div>

                                    {/* View Details Button */}
                                    <motion.div
                                        variants={buttonVariants}
                                        initial="initial"
                                        whileHover="hover"
                                        whileTap="tap"
                                        className="mt-4"
                                    >
                                        <button
                                            onClick={() => handleViewDetails(propertyId)}
                                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/40"
                                        >
                                            <Home className="w-4 h-4" />
                                            View Details
                                            <motion.svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                animate={{ x: 0 }}
                                                whileHover={{ x: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </motion.svg>
                                        </button>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* View All Properties Button */}
                <motion.div
                    className="text-center mt-12"
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
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-emerald-600 hover:bg-emerald-600 text-emerald-600 hover:text-white dark:text-emerald-400 dark:hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/20"
                        >
                            <Building2 className="w-5 h-5" />
                            View All Properties
                            <motion.svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                animate={{ x: 0 }}
                                whileHover={{ x: 5 }}
                                transition={{ duration: 0.2 }}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </motion.svg>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default FeaturedProperties;