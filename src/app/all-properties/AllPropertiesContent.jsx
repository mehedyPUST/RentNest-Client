// app/all-properties/AllPropertiesContent.jsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBed, FaBath, FaMapMarkerAlt, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { Home, Loader2, Eye, AlertCircle, Building2, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

const AllPropertiesContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // State
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState('');

    // Pagination State
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 21
    });

    // Filters
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
        page: parseInt(searchParams.get('page')) || 1,
    });

    const propertyTypes = ['Apartment', 'House', 'Villa', 'Commercial Space'];

    // Fetch properties with pagination
    const fetchProperties = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            setFilters(prev => ({ ...prev, page }));

            const queryParams = new URLSearchParams();

            Object.entries({ ...filters, page }).forEach(([key, value]) => {
                if (value && value.toString().trim() !== '') {
                    if (key === 'sortBy' && value === 'createdAt') return;
                    if (key === 'sortOrder' && value === 'desc') return;
                    queryParams.append(key, value);
                }
            });

            queryParams.append('limit', pagination.itemsPerPage);

            const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties?${queryParams.toString()}`;
            console.log('📤 Fetching:', url);

            const res = await fetch(url, { cache: 'no-store' });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to fetch properties');
            }

            const data = await res.json();

            let props = Array.isArray(data) ? data : data?.properties || [];
            const approvedProps = props.filter(p => p.status?.toLowerCase() === 'approved');

            setProperties(approvedProps);

            if (data.pagination) {
                setPagination({
                    currentPage: data.pagination.currentPage || page,
                    totalPages: data.pagination.totalPages || 1,
                    totalItems: data.pagination.totalItems || 0,
                    itemsPerPage: data.pagination.itemsPerPage || 20
                });
            }

            const newQueryString = queryParams.toString();
            const newUrl = newQueryString
                ? `/all-properties?${newQueryString}`
                : '/all-properties';

            if (window.location.pathname + window.location.search !== newUrl) {
                router.replace(newUrl, { scroll: false });
            }

        } catch (err) {
            console.error('❌ Error fetching properties:', err);
            setError(err.message);
            setProperties([]);
        } finally {
            setLoading(false);
        }
    }, [filters, router, pagination.itemsPerPage]);

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            fetchProperties(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    // Apply filters
    const applyFilters = () => {
        fetchProperties(1);
        setShowFilters(false);
    };

    // Reset filters
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
            page: 1
        });
        setSearchInput('');
        setShowFilters(false);
        fetchProperties(1);
    };

    // ✅ Search handler with Enter key
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
        fetchProperties(1);
    };

    // ✅ Clear search
    const clearSearch = () => {
        setSearchInput('');
        setFilters(prev => ({ ...prev, search: '', page: 1 }));
        fetchProperties(1);
    };

    // ✅ Auto fetch when filter changes (except search)
    useEffect(() => {
        if (filters.search !== searchInput) {
            return;
        }
        fetchProperties(filters.page || 1);
    }, [
        filters.propertyType,
        filters.minPrice,
        filters.maxPrice,
        filters.bedrooms,
        filters.bathrooms,
        filters.sortBy,
        filters.sortOrder,
        filters.location
    ]);

    // Format price
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
        return `$${price.toLocaleString()}`;
    };

    const capitalizeFirst = (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.search) count++;
        if (filters.propertyType) count++;
        if (filters.minPrice) count++;
        if (filters.maxPrice) count++;
        if (filters.bedrooms) count++;
        if (filters.bathrooms) count++;
        if (filters.location) count++;
        if (filters.sortBy !== 'createdAt') count++;
        if (filters.sortOrder !== 'desc') count++;
        return count;
    };

    const handleViewDetails = (id) => {
        router.push(`/all-properties/${id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-red-500 text-lg">{error}</p>
                <button
                    onClick={() => fetchProperties(1)}
                    className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white dark:from-gray-950 dark:to-gray-900 py-8 px-4 md:px-6 w-full">
            <div className="w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Premium Properties</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Explore <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Verified</span> Properties
                    </h1>

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
                        Discover our curated collection of premium verified properties. Each listing is carefully selected for quality, location, and value.
                    </p>

                    {properties.length > 0 && (
                        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full">
                            <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                                {pagination.totalItems} Verified Properties Available
                            </span>
                        </div>
                    )}
                </div>

                {/* ✅ Search and Filter Bar - New Layout */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Search Input + Filter Button + Search Button - Inline */}
                        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by location, title, or description..."
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                {searchInput && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>

                            {/* ✅ Filter Button - Immediately right of search input */}
                            <button
                                type="button"
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition flex items-center gap-2 relative flex-shrink-0"
                            >
                                <FaFilter className="text-gray-600 dark:text-gray-400" />
                                <span className="hidden sm:inline text-gray-700 dark:text-gray-300">Filters</span>
                                {getActiveFilterCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-600 text-white text-xs rounded-full flex items-center justify-center">
                                        {getActiveFilterCount()}
                                    </span>
                                )}
                            </button>

                            {/* ✅ Search Button */}
                            <button
                                type="submit"
                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium flex-shrink-0"
                            >
                                <FaSearch className="inline mr-2" />
                                Search
                            </button>
                        </form>

                        {/* Sort By Dropdown - Moved to right side */}
                        <div className="flex-shrink-0">
                            <select
                                name="sortBy"
                                value={filters.sortBy}
                                onChange={handleFilterChange}
                                className="w-full md:w-auto px-5 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
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
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                                    {capitalizeFirst(filters.propertyType)}
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, propertyType: '' }))}
                                        className="hover:text-emerald-900"
                                    >
                                        <FaTimes className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.location && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                    📍 {filters.location}
                                    <button
                                        onClick={() => setFilters(prev => ({ ...prev, location: '' }))}
                                        className="hover:text-blue-900"
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
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                                        className="flex-1 px-6 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg hover:opacity-90 transition"
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
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}

                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties.map((property) => {
                        const id = property._id?.$oid || property._id || property.id;
                        const image = property.images?.[0] || 'https://via.placeholder.com/800x600?text=No+Image';
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
                                            e.target.src = 'https://via.placeholder.com/800x600/CCCCCC/FFFFFF?text=No+Image';
                                        }}
                                    />
                                    <span className="absolute top-3 left-3 px-3 py-1 text-xs bg-green-600 text-white rounded-full flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        Verified
                                    </span>
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
                                        className="mt-5 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white py-3 rounded-xl hover:opacity-90 transition"
                                    >
                                        <Home className="w-4 h-4" />
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination Section */}
                {pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                            {pagination.totalItems} properties
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="flex gap-1">
                                {(() => {
                                    const pages = [];
                                    const total = pagination.totalPages;
                                    const current = pagination.currentPage;

                                    if (total <= 7) {
                                        for (let i = 1; i <= total; i++) {
                                            pages.push(i);
                                        }
                                    } else {
                                        pages.push(1);

                                        if (current > 3) {
                                            pages.push('...');
                                        }

                                        for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
                                            pages.push(i);
                                        }

                                        if (current < total - 2) {
                                            pages.push('...');
                                        }

                                        pages.push(total);
                                    }

                                    return pages.map((page, index) => (
                                        <button
                                            key={index}
                                            onClick={() => typeof page === 'number' && handlePageChange(page)}
                                            disabled={page === '...' || page === pagination.currentPage}
                                            className={`w-10 h-10 rounded-lg transition ${page === pagination.currentPage
                                                ? 'bg-emerald-600 text-white'
                                                : page === '...'
                                                    ? 'cursor-default'
                                                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ));
                                })()}
                            </div>

                            <button
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="flex items-center gap-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPropertiesContent;