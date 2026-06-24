'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';
import { Home, Loader2, Eye, AlertCircle, Building2, Sparkles } from 'lucide-react';

const AllPropertiesPage = () => {
    const router = useRouter();

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
                    { cache: 'no-store' }
                );

                if (!res.ok) throw new Error('Failed to fetch properties');

                const data = await res.json();
                const props = Array.isArray(data)
                    ? data
                    : data?.properties || [];

                // Filter only approved properties
                const approvedProps = props.filter(
                    (property) => property.status?.toLowerCase() === 'approved'
                );

                setProperties(approvedProps);
            } catch (err) {
                setError(err.message);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleViewDetails = (id) => {
        router.push(`/all-properties/${id}`);
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        return `$${price.toLocaleString()}`;
    };

    // Capitalize first letter
    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-12">
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
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium Properties</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Verified</span> Properties
                    </h1>

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
                        Discover our curated collection of premium verified properties. Each listing is carefully selected for quality, location, and value.
                    </p>

                    {properties.length > 0 && (
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                                {properties.length} Verified Properties Available
                            </span>
                        </div>
                    )}
                </div>

                {/* No Properties Found */}
                {properties.length === 0 && (
                    <div className="text-center py-20">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            No Verified Properties Yet
                        </h2>
                        <p className="text-gray-500 mt-2">
                            We're adding new properties daily. Check back soon!
                        </p>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {properties.map((property) => {
                        const id = property._id?.$oid || property._id || property.id;

                        const image =
                            property.images?.[0] ||
                            'https://via.placeholder.com/800x600?text=No+Image';

                        const bedrooms = property.specifications?.bedrooms || 0;
                        const bathrooms = property.specifications?.bathrooms || 0;

                        return (
                            <motion.div
                                key={id}
                                whileHover={{ y: -10, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-200/50 dark:border-gray-800"
                            >

                                {/* Image */}
                                <div
                                    onClick={() => handleViewDetails(id)}
                                    className="relative cursor-pointer overflow-hidden aspect-[4/3]"
                                >
                                    <img
                                        src={image}
                                        alt={property.title}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Verified Badge */}
                                    <span className="absolute top-3 left-3 px-3 py-1 text-xs bg-green-600 text-white rounded-full flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>

                                    {/* Type - Capitalized first letter */}
                                    <span className="absolute top-3 right-3 px-3 py-1 text-xs bg-black/70 text-white rounded-full capitalize">
                                        {capitalizeFirst(property.propertyType)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">

                                    {/* Price */}
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {formatPrice(property.price)}
                                        </h2>
                                        <div className="flex items-center text-sm text-gray-500 gap-1">
                                            <Eye className="w-4 h-4" />
                                            {property.rentType}
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                                        {property.title}
                                    </h3>

                                    {/* Location */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <FaMapMarkerAlt />
                                        {property.location}
                                    </div>

                                    {/* Specs */}
                                    <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="flex items-center gap-1">
                                            <FaBed /> {bedrooms}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaBath /> {bathrooms}
                                        </span>
                                    </div>

                                    {/* CTA */}
                                    <button
                                        onClick={() => handleViewDetails(id)}
                                        className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:opacity-90 transition"
                                    >
                                        <Home className="w-4 h-4" />
                                        View Details
                                    </button>

                                </div>
                            </motion.div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
};

export default AllPropertiesPage;