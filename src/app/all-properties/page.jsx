'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaMapMarkerAlt } from 'react-icons/fa';
import { Home, Loader2, Eye, AlertCircle } from 'lucide-react';

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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        All Properties
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Showing {properties.length} approved properties
                    </p>
                </div>

                {/* No Properties Found */}
                {properties.length === 0 && (
                    <div className="text-center py-20">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            No Approved Properties
                        </h2>
                        <p className="text-gray-500 mt-2">
                            There are no approved properties available at the moment.
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