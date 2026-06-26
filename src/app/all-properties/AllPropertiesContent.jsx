// app/all-properties/AllPropertiesContent.jsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaMapMarkerAlt, FaSearch, FaFilter, FaSort, FaTimes } from 'react-icons/fa';
import { Home, Loader2, Eye, AlertCircle, Building2, Sparkles } from 'lucide-react';

const AllPropertiesContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State for properties and loading
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for filters
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        propertyType: searchParams.get('propertyType') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        bedrooms: searchParams.get('bedrooms') || '',
        bathrooms: searchParams.get('bathrooms') || '',
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'desc',
        location: searchParams.get('location') || '',
    });

    // State for filter UI
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search);

    // Available property types from your data
    const propertyTypes = ['Apartment', 'House', 'Condo', 'Villa', 'Townhouse', 'Land'];

    // Fetch properties with filters
    const fetchProperties = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query string
            const queryParams = new URLSearchParams();

            // Only add non-empty values
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.trim() !== '') {
                    queryParams.append(key, value);
                }
            });

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?${queryParams.toString()}`;

            const res = await fetch(url, { cache: 'no-store' });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch properties');
            }

            const data = await res.json();

            // Handle different response formats
            let props = Array.isArray(data) ? data : data?.properties || [];

            // Filter only approved properties (backend should handle this, but double-check)
            const approvedProps = props.filter(
                (property) => property.status?.toLowerCase() === 'approved'
            );

            setProperties(approvedProps);

            // Update URL with current filters
            const newQueryString = queryParams.toString();
            const newUrl = newQueryString
                ? `/all-properties?${newQueryString}`
                : '/all-properties';

            // Only update URL if different from current
            if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== newUrl) {
                router.replace(newUrl, { scroll: false });
            }

        } catch (err) {
            setError(err.message);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [filters, router]);

    // Fetch on mount and filter changes
    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]);

    // Handle search input with debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchInput !== filters.search) {
                setFilters(prev => ({ ...prev, search: searchInput }));
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput, filters.search]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Apply filters
    const applyFilters = () => {
        fetchProperties();
        setShowFilters(false);
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            search: '',
            propertyType: '',
            minPrice: '',
            maxPrice: '',
            bedrooms: '',
            bathrooms: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
            location: '',
        });
        setSearchInput('');
        setShowFilters(false);
    };

    // Handle view details
    const handleViewDetails = (id) => {
        router.push(`/all-properties/${id}`);
    };

    // Format price
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

    // Count active filters
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.propertyType) count++;
        if (filters.minPrice) count++;
        if (filters.maxPrice) count++;
        if (filters.bedrooms) count++;
        if (filters.bathrooms) count++;
        if (filters.location) count++;
        if (filters.sortBy !== 'createdAt' || filters.sortOrder !== 'desc') count++;
        return count;
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
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={fetchProperties}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
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


                {/* hffhfh */}

                {/* Search and Filter Bar */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by location, title, or description..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {searchInput && (
                                <button
                                    onClick={() => {
                                        setSearchInput('');
                                        setFilters(prev => ({ ...prev, search: '' }));
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes />
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 relative"
                            >
                                <FaFilter />
                                <span>Filters</span>
                                {getActiveFilterCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                                        {getActiveFilterCount()}
                                    </span>
                                )}
                            </button>

                            <select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                            >
                                <option value="createdAt">Latest First</option>
                                <option value="price">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                                <option value="title">Title A-Z</option>
                                <option value="bedrooms">Bedrooms</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Tags */}
                    {getActiveFilterCount() > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {filters.propertyType && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    {capitalizeFirst(filters.propertyType)}
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))}
                                        className="hover:text-blue-900"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.location && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
                                    📍 {filters.location}
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                                        className="hover:text-green-900"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {(filters.minPrice || filters.maxPrice) && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                                    ${filters.minPrice || '0'} - ${filters.maxPrice || '∞'}
                                    <button
                                        onClick={() => {
                                            setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                                        }}
                                        className="hover:text-purple-900"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.bedrooms && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm">
                                    🛏 {filters.bedrooms} Beds
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, bedrooms: '' }))}
                                        className="hover:text-orange-900"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.bathrooms && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-sm">
                                    🛁 {filters.bathrooms} Baths
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, bathrooms: '' }))}
                                        className="hover:text-pink-900"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            <button
                                onClick={resetFilters}
                                className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Clear All
                            </button>
                        </div>
                    )}

                    {/* Filter Panel */}
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Property Type
                                    </label>
                                    <select
                                        name="propertyType"
                                        value={filters.propertyType}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">All Types</option>
                                        {propertyTypes.map(type => (
                                            <option key={type} value={type.toLowerCase()}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        placeholder="City, State, or ZIP"
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Min Price
                                    </label>
                                    <input
                                        type="number"
                                        name="minPrice"
                                        value={filters.minPrice}
                                        onChange={handleFilterChange}
                                        placeholder="$0"
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Max Price
                                    </label>
                                    <input
                                        type="number"
                                        name="maxPrice"
                                        value={filters.maxPrice}
                                        onChange={handleFilterChange}
                                        placeholder="$1,000,000+"
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bedrooms
                                    </label>
                                    <select
                                        name="bedrooms"
                                        value={filters.bedrooms}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Any</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                            <option key={num} value={num}>{num}+</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Bathrooms
                                    </label>
                                    <select
                                        name="bathrooms"
                                        value={filters.bathrooms}
                                        onChange={handleFilterChange}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Any</option>
                                        {[1, 2, 3, 4, 5, 6].map(num => (
                                            <option key={num} value={num}>{num}+</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2 flex items-end gap-3">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={resetFilters}
                                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* No Properties Found */}
                {properties.length === 0 && (
                    <div className="text-center py-20">
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
                            No Properties Found
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your filters or search criteria
                        </p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Clear Filters
                        </button>
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
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/800x600?text=No+Image';
                                        }}
                                    />

                                    {/* Verified Badge */}
                                    <span className="absolute top-3 left-3 px-3 py-1 text-xs bg-green-600 text-white rounded-full flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>

                                    {/* Type */}
                                    <span className="absolute top-3 right-3 px-3 py-1 text-xs bg-black/70 text-white rounded-full capitalize">
                                        {capitalizeFirst(property.propertyType)}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {formatPrice(property.price)}
                                        </h2>
                                        <div className="flex items-center text-sm text-gray-500 gap-1">
                                            <Eye className="w-4 h-4" />
                                            {property.rentType || 'For Sale'}
                                        </div>
                                    </div>

                                    <h3 className="font-semibold text-gray-800 dark:text-white line-clamp-1">
                                        {property.title}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <FaMapMarkerAlt />
                                        {property.location}
                                    </div>

                                    <div className="flex gap-4 mt-4 text-sm text-gray-600 dark:text-gray-300">
                                        <span className="flex items-center gap-1">
                                            <FaBed /> {bedrooms}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaBath /> {bathrooms}
                                        </span>
                                    </div>

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

export default AllPropertiesContent;