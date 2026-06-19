'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { Building2, Sparkles, Eye, Home } from 'lucide-react';

const FeaturedProperties = () => {
    // Static data - replace with MongoDB data later
    const properties = [
        {
            id: 1,
            title: "Luxury Villa with Ocean View",
            location: "Malibu, California",
            price: 1250000,
            bedrooms: 5,
            bathrooms: 4,
            sqft: 3500,
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Villa",
            status: "For Sale",
            featured: true,
            yearBuilt: 2020
        },
        {
            id: 2,
            title: "Modern Downtown Apartment",
            location: "New York, NY",
            price: 850000,
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1800,
            image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Apartment",
            status: "For Rent",
            featured: true,
            yearBuilt: 2018
        },
        {
            id: 3,
            title: "Spacious Family House",
            location: "Austin, Texas",
            price: 620000,
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2800,
            image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "House",
            status: "For Sale",
            featured: true,
            yearBuilt: 2022
        },
        {
            id: 4,
            title: "Penthouse with City Views",
            location: "Chicago, Illinois",
            price: 2100000,
            bedrooms: 4,
            bathrooms: 3.5,
            sqft: 4200,
            image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Penthouse",
            status: "For Sale",
            featured: true,
            yearBuilt: 2019
        },
        {
            id: 5,
            title: "Cozy Suburban Home",
            location: "Portland, Oregon",
            price: 450000,
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1600,
            image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "House",
            status: "For Sale",
            featured: true,
            yearBuilt: 2015
        },
        {
            id: 6,
            title: "Waterfront Condo",
            location: "Miami, Florida",
            price: 950000,
            bedrooms: 2,
            bathrooms: 2,
            sqft: 1500,
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Condo",
            status: "For Rent",
            featured: true,
            yearBuilt: 2021
        }
    ];

    const formatPrice = (price) => {
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString()}`;
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

    const badgeVariants = {
        hidden: { x: -50, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                delay: 0.3,
                duration: 0.4,
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

    return (
        <section className="py-20 bg-gradient-to-b from-white via-slate-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Featured Properties</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Handpicked <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Properties</span>
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        ></motion.div>
                        <motion.div
                            className="w-2 h-2 bg-blue-600 rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                        ></motion.div>
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
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

                {/* Properties Grid */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {properties.map((property) => (
                        <motion.div
                            key={property.id}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300 border border-gray-200/50 dark:border-gray-800/50"
                        >
                            {/* Image Container */}
                            <motion.div
                                className="relative overflow-hidden aspect-[4/3]"
                                variants={imageVariants}
                                initial="initial"
                                whileHover="hover"
                            >
                                <img
                                    src={property.image}
                                    alt={property.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Status Badge */}
                                <motion.span
                                    className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider shadow-lg ${property.status === 'For Sale'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-green-600 text-white'
                                        }`}
                                    variants={badgeVariants}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {property.status}
                                </motion.span>

                                {/* Property Type Badge */}
                                <motion.span
                                    className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-xs font-medium shadow-lg"
                                    initial={{ x: 50, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    viewport={{ once: true }}
                                >
                                    {property.type}
                                </motion.span>

                                {/* Favorite Button */}
                                <motion.button
                                    className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-200 shadow-lg"
                                    variants={favoriteButtonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                    onClick={() => console.log('Favorite clicked')}
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
                                        <span>254 views</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                    {property.title}
                                </h3>

                                {/* Location */}
                                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    <FaMapMarkerAlt className="w-3.5 h-3.5" />
                                    <span>{property.location}</span>
                                </div>

                                {/* Features */}
                                <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <motion.div
                                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <FaBed className="w-4 h-4" />
                                        <span>{property.bedrooms}</span>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <FaBath className="w-4 h-4" />
                                        <span>{property.bathrooms}</span>
                                    </motion.div>
                                    <motion.div
                                        className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <FaRulerCombined className="w-4 h-4" />
                                        <span>{property.sqft.toLocaleString()} sqft</span>
                                    </motion.div>
                                </div>

                                {/* View Details Button */}
                                <motion.div
                                    variants={buttonVariants}
                                    initial="initial"
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Link
                                        href={`/properties/${property.id}`}
                                        className="mt-4 w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40"
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
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
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
                            href="/properties"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-blue-600 hover:bg-blue-600 text-blue-600 hover:text-white dark:text-blue-400 dark:hover:text-white font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
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