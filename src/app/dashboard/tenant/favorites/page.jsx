'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FaHeart, FaMapMarkerAlt, FaBed, FaBath, FaTrash, FaArrowLeft } from 'react-icons/fa';
import { Loader2, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const TenantsFavoritesPage = () => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const userId = user?.id;

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removingId, setRemovingId] = useState(null);
    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
    // ফেবারিট ডেটা লোড করুন
    useEffect(() => {
        if (userId) {
            fetchFavorites();
        } else if (!isPending && !userId) {
            setLoading(false);
        }
    }, [userId, isPending]);

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(
                `${API_URL}/api/favorites/my-favorites?tenantId=${userId}&page=1&limit=50`
            );

            if (!res.ok) {
                throw new Error('Failed to fetch favorites');
            }

            const data = await res.json();

            if (data.success) {
                setFavorites(data.favorites || []);
            } else {
                throw new Error(data.message || 'Failed to fetch favorites');
            }

        } catch (err) {
            console.error('Error fetching favorites:', err);
            setError(err.message);
            setFavorites([]);
        } finally {
            setLoading(false);
        }
    };

    // ফেবারিট রিমুভ করুন
    const removeFavorite = async (propertyId) => {
        if (!userId) {
            toast.error('Please login first');
            return;
        }

        setRemovingId(propertyId);
        try {
            const res = await fetch(
                `http://localhost:5000/api/favorites/${propertyId}?tenantId=${userId}`,
                { method: 'DELETE' }
            );

            const data = await res.json();

            if (res.ok) {
                // লিস্ট থেকে রিমুভ করুন
                setFavorites(favorites.filter(fav => fav.propertyId !== propertyId));
                toast.success('Removed from favorites');
            } else {
                toast.error(data.message || 'Failed to remove');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            toast.error('Something went wrong');
        } finally {
            setRemovingId(null);
        }
    };

    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString()}`;
    };

    const handleViewDetails = (propertyId) => {
        router.push(`/all-properties/${propertyId}`);
    };

    // Loading State
    if (isPending || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading your favorites...</p>
                </div>
            </div>
        );
    }

    // Not Logged In
    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="text-6xl mb-4">❤️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h1>
                    <p className="text-gray-600 mb-6">
                        Please login to view and manage your favorite properties.
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <FaHeart className="w-8 h-8 text-red-500" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                My Favorites
                            </h1>
                            <p className="text-sm text-gray-500">
                                {favorites.length} properties in your wishlist
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/all-properties"
                        className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Browse Properties
                    </Link>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5" />
                            <p>{error}</p>
                            <button
                                onClick={fetchFavorites}
                                className="ml-auto text-sm bg-red-100 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {favorites.length === 0 && !error && (
                    <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                        <div className="text-6xl mb-4">🏠</div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            No Favorites Yet
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-md mx-auto">
                            Start exploring properties and click the heart icon to add your favorites here.
                        </p>
                        <Link
                            href="/all-properties"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30"
                        >
                            <Home className="w-4 h-4" />
                            Browse Properties
                        </Link>
                    </div>
                )}

                {/* Favorites Grid */}
                {favorites.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((favorite, index) => {
                            const property = favorite.propertyData || {};
                            const propertyId = favorite.propertyId;
                            const image = property.images?.[0] || 'https://via.placeholder.com/800x600/CCCCCC/FFFFFF?text=No+Image';

                            return (
                                <motion.div
                                    key={favorite._id || index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                                >
                                    {/* Image */}
                                    <div
                                        onClick={() => handleViewDetails(propertyId)}
                                        className="relative cursor-pointer overflow-hidden aspect-[4/3]"
                                    >
                                        <img
                                            src={image}
                                            alt={property.title || 'Property'}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />

                                        {/* Remove Button Overlay */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeFavorite(propertyId);
                                            }}
                                            disabled={removingId === propertyId}
                                            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                                            aria-label="Remove from favorites"
                                        >
                                            {removingId === propertyId ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                            ) : (
                                                <FaTrash className="w-4 h-4 text-red-500 hover:text-red-700" />
                                            )}
                                        </button>

                                        {/* Price Badge */}
                                        <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                                            <span className="text-white font-bold">
                                                {formatPrice(property.price)}
                                            </span>
                                        </div>

                                        {/* Property Type Badge */}
                                        {property.propertyType && (
                                            <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                                                <span className="text-white text-xs font-medium capitalize">
                                                    {property.propertyType}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3
                                            onClick={() => handleViewDetails(propertyId)}
                                            className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-1"
                                        >
                                            {property.title || 'Untitled Property'}
                                        </h3>

                                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                            <FaMapMarkerAlt className="text-red-400" />
                                            <span className="line-clamp-1">{property.location || 'Location N/A'}</span>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <FaBed className="text-blue-500" /> {property.specifications?.bedrooms || 0}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaBath className="text-blue-500" /> {property.specifications?.bathrooms || 0}
                                            </span>
                                            {property.specifications?.size && (
                                                <span className="flex items-center gap-1">
                                                    <span className="text-gray-400">|</span>
                                                    {property.specifications.size} sqft
                                                </span>
                                            )}
                                        </div>

                                        {/* Added Date */}
                                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-xs text-gray-400">
                                                Added: {new Date(favorite.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <button
                                                onClick={() => handleViewDetails(propertyId)}
                                                className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                            >
                                                View Details →
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantsFavoritesPage;