'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import BookingModal from '@/components/BookingModal';
import ReviewSection from '@/components/ReviewSection';
import EditPropertyModal from '@/components/EditPropertyModal';
import {
    FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt,
    FaCalendarAlt, FaUser, FaEnvelope, FaTag,
    FaArrowLeft, FaHeart, FaRegHeart, FaShare, FaPrint,
    FaWifi, FaParking, FaSwimmingPool, FaDumbbell,
    FaShieldAlt, FaFire, FaSnowflake, FaTv,
    FaCalendarCheck, FaEdit, FaTrash, FaEye
} from 'react-icons/fa';
import { MdVerified, MdPending, MdCancel, MdCheckCircle } from 'react-icons/md';
import { GiFlowerPot, GiFruitTree } from 'react-icons/gi';
import toast from 'react-hot-toast';

const PropertyDetailsPage = ({ params }) => {
    const router = useRouter();
    const { data: session, isPending } = authClient.useSession();
    const user = session?.user;
    const userId = user?.id;

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    // ✅ Edit Modal State
    const [editModalOpen, setEditModalOpen] = useState(false);

    // ✅ Check if current user is owner
    const isOwner = () => {
        if (!user || !property) return false;
        const ownerId = property.ownerId || property.owner?.id;
        return userId === ownerId;
    };

    // ✅ Check if current user is admin
    const isAdmin = () => {
        return user?.role?.toLowerCase() === 'admin';
    };

    // প্রপার্টি ডেটা লোড করুন
    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const { id } = await params;

                // ✅ Single property fetch
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${id}`,
                    { cache: 'no-store' },


                );

                if (!res.ok) throw new Error('Failed to fetch property');

                const data = await res.json();
                const foundProperty = data;

                if (!foundProperty) {
                    throw new Error('Property not found');
                }

                setProperty(foundProperty);

                // ইউজার লগইন থাকলে ফেবারিট ও বুকিং স্ট্যাটাস চেক করুন
                if (userId) {
                    try {
                        await checkFavoriteStatus(id);
                    } catch (err) {
                        console.error('Favorite check failed:', err);
                    }

                    try {
                        await checkBookingStatus(id);
                    } catch (err) {
                        console.error('Booking check failed:', err);
                        setIsBooked(false);
                    }
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
    }, [userId]);

    // ✅ ফেবারিট স্ট্যাটাস চেক করুন
    const checkFavoriteStatus = async (propertyId) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorites/check/${propertyId}?tenantId=${userId}`
            );

            if (!res.ok) {
                setIsFavorited(false);
                return;
            }

            const data = await res.json();
            setIsFavorited(data.isFavorited || false);
        } catch (error) {
            console.error('Error checking favorite:', error);
            setIsFavorited(false);
        }
    };

    // ✅ বুকিং স্ট্যাটাস চেক করুন
    const checkBookingStatus = async (propertyId) => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/check/${propertyId}?tenantId=${userId}`
            );

            if (!res.ok) {
                setIsBooked(false);
                return;
            }

            const data = await res.json();
            setIsBooked(data.isBooked || false);
        } catch (error) {
            console.error('Error checking booking:', error);
            setIsBooked(false);
        }
    };

    // ✅ ফেবারিট টগল করুন
    const toggleFavorite = async () => {
        if (!userId) {
            toast.error('Please login to add favorites');
            router.push('/login');
            return;
        }

        setFavoriteLoading(true);
        try {
            const propertyId = property._id?.$oid || property._id || property.id;

            if (isFavorited) {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/favorites/${propertyId}?tenantId=${userId}`,
                    { method: 'DELETE' }
                );

                const data = await res.json();

                if (res.ok) {
                    setIsFavorited(false);
                    toast.success('Removed from favorites');
                } else {
                    toast.error(data.message || 'Failed to remove');
                }
            } else {
                const propertyData = {
                    title: property.title,
                    price: property.price,
                    location: property.location,
                    images: property.images,
                    description: property.description,
                    propertyType: property.propertyType,
                    specifications: property.specifications,
                    amenities: property.amenities,
                    extraFeatures: property.extraFeatures
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/favorites`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tenantId: userId,
                        propertyId: propertyId,
                        propertyData: propertyData
                    })
                });

                const data = await res.json();

                if (res.ok) {
                    setIsFavorited(true);
                    toast.success('Added to favorites ❤️');
                } else {
                    toast.error(data.message || 'Failed to add');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            toast.error('Something went wrong');
        } finally {
            setFavoriteLoading(false);
        }
    };

    // ✅ Book Now Handler
    const handleBookNow = () => {
        if (!userId) {
            toast.error('Please login to book this property');
            router.push('/login');
            return;
        }

        if (isBooked) {
            toast.error('You have already booked this property');
            return;
        }

        setShowBookingModal(true);
    };

    // ✅ Booking Confirm Handler
    const handleBookingConfirm = (booking) => {
        setIsBooked(true);
        toast.success('Booking created successfully!');
        router.push(`/payment/${booking._id}`);
    };

    // ✅ Edit Property Handler - Open Modal
    const handleEdit = () => {
        setEditModalOpen(true);
    };

    // ✅ Handle Property Update
    const handlePropertyUpdate = (updatedProperty) => {
        setProperty(updatedProperty);
        toast.success('Property updated successfully!');
        setEditModalOpen(false);
    };

    // ✅ Delete Property Handler
    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return;
        }

        try {
            const propertyId = property._id?.$oid || property._id || property.id;
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success('Property deleted successfully');
                router.push('/all-properties');
            } else {
                toast.error(data.message || 'Failed to delete property');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Failed to delete property');
        }
    };

    // Helper functions
    const formatPrice = (price) => {
        if (!price) return 'N/A';
        if (price >= 1000000) {
            return `$${(price / 1000000).toFixed(1)}M`;
        }
        return `$${price.toLocaleString()}`;
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'featured':
                return <MdVerified className="text-green-500" />;
            case 'pending':
                return <MdPending className="text-yellow-500" />;
            case 'rejected':
                return <MdCancel className="text-red-500" />;
            default:
                return <MdCheckCircle className="text-blue-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
            case 'featured':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getAmenityIcon = (amenity) => {
        const amenityLower = amenity?.toLowerCase() || '';
        if (amenityLower.includes('wifi') || amenityLower.includes('internet')) return <FaWifi />;
        if (amenityLower.includes('parking') || amenityLower.includes('garage')) return <FaParking />;
        if (amenityLower.includes('pool') || amenityLower.includes('swimming')) return <FaSwimmingPool />;
        if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return <FaDumbbell />;
        if (amenityLower.includes('security') || amenityLower.includes('guard')) return <FaShieldAlt />;
        if (amenityLower.includes('fireplace')) return <FaFire />;
        if (amenityLower.includes('ac') || amenityLower.includes('air conditioning')) return <FaSnowflake />;
        if (amenityLower.includes('tv') || amenityLower.includes('cable')) return <FaTv />;
        if (amenityLower.includes('garden') || amenityLower.includes('yard')) return <GiFlowerPot />;
        if (amenityLower.includes('fruit') || amenityLower.includes('tree')) return <GiFruitTree />;
        return <FaTag />;
    };

    // ✅ Role-based action buttons
    const renderActionButtons = () => {
        const isOwnerUser = isOwner();
        const isAdminUser = isAdmin();

        // ✅ Owner Actions
        if (isOwnerUser) {
            return (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleEdit}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        <FaEdit className="w-4 h-4" />
                        Edit Property
                    </button>

                    <button
                        onClick={handleDelete}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/30 flex items-center justify-center gap-2"
                    >
                        <FaTrash className="w-4 h-4" />
                        Delete Property
                    </button>
                </div>
            );
        }

        // ✅ Admin Actions
        if (isAdminUser) {
            return (
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={handleEdit}
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                        <FaEdit className="w-4 h-4" />
                        Edit Property
                    </button>

                    <button
                        onClick={handleDelete}
                        className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/30 flex items-center justify-center gap-2"
                    >
                        <FaTrash className="w-4 h-4" />
                        Delete Property
                    </button>

                    <Link
                        href="/dashboard/admin/all-properties"
                        className="w-full py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 block text-center"
                    >
                        <FaArrowLeft className="w-4 h-4" />
                        Back to Admin Panel
                    </Link>
                </div>
            );
        }

        // ✅ Tenant Actions (Default)
        return (
            <div className="space-y-3 pt-4">
                <button
                    onClick={handleBookNow}
                    disabled={isBooked}
                    className={`w-full py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${isBooked
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-blue-500/30'
                        }`}
                >
                    <FaCalendarCheck className="w-5 h-5" />
                    {isBooked ? 'Already Booked' : 'Book Now'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                    {/* Favorite Button */}
                    <button
                        onClick={toggleFavorite}
                        disabled={favoriteLoading}
                        className={`py-3 font-semibold rounded-lg transition-all flex items-center justify-center gap-2 border-2 ${isFavorited
                            ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-500'
                            }`}
                    >
                        {favoriteLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        ) : (
                            <>
                                {isFavorited ? (
                                    <FaHeart className="w-5 h-5 text-red-500" />
                                ) : (
                                    <FaRegHeart className="w-5 h-5" />
                                )}
                                <span className="text-sm">{isFavorited ? 'Favorited' : 'Favorite'}</span>
                            </>
                        )}
                    </button>

                    {/* Contact Owner Button */}
                    <button
                        onClick={() => {
                            const ownerEmail = property.owner?.email;
                            if (ownerEmail) {
                                window.location.href = `mailto:${ownerEmail}?subject=Inquiry about ${property.title}`;
                            } else {
                                toast.info('Owner contact information not available');
                            }
                        }}
                        className="py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <FaUser className="w-4 h-4" />
                        <span className="text-sm">Contact</span>
                    </button>
                </div>

                {/* Booked Status Message */}
                {isBooked && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700">
                            ✅ You have already booked this property.
                            <Link href="/dashboard/tenant/my-bookings" className="font-medium underline ml-1">
                                View My Bookings
                            </Link>
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // ✅ Guest Actions
    const renderGuestActions = () => {
        return (
            <div className="space-y-3 pt-4 border-t border-gray-100">
                <Link
                    href="/login"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 block text-center"
                >
                    <FaUser className="w-4 h-4" />
                    Login to Book
                </Link>
                <p className="text-sm text-gray-500 text-center">
                    Please login to book, favorite, or contact the owner.
                </p>
            </div>
        );
    };

    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (error || !property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h1>
                    <p className="text-gray-600 mb-6">{error || "The property you're looking for doesn't exist."}</p>
                    <Link
                        href={'/all-properties'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to Properties
                    </Link>
                </div>
            </div>
        );
    }

    const propertyId = property._id?.$oid || property._id || property.id;
    const mainImage = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://via.placeholder.com/1200x600/CCCCCC/FFFFFF?text=No+Image';

    const galleryImages = property.images?.slice(1) || [];

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Top Navigation */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link
                                href={isAdmin() ? '/dashboard/admin/all-properties' : '/all-properties'}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <FaArrowLeft />
                                <span className="font-medium">
                                    {isAdmin() ? 'Back to Admin Panel' : 'Back to Properties'}
                                </span>
                            </Link>
                            <div className="flex items-center gap-3">
                                {user && !isOwner() && !isAdmin() && (
                                    <button
                                        onClick={toggleFavorite}
                                        disabled={favoriteLoading}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        {favoriteLoading ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                        ) : (
                                            isFavorited ? (
                                                <FaHeart className="w-5 h-5 text-red-500" />
                                            ) : (
                                                <FaRegHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                                            )
                                        )}
                                    </button>
                                )}
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <FaShare className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                                </button>
                                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <FaPrint className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Property Header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                    {property.title || 'Untitled Property'}
                                </h1>
                                <div className="flex flex-wrap items-center gap-3 text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <FaMapMarkerAlt className="text-red-500" />
                                        {property.location || 'Location not specified'}
                                    </span>
                                    <span className="text-gray-300">|</span>
                                    <span className="capitalize">{property.propertyType || 'Property'}</span>
                                    {property.status && (
                                        <>
                                            <span className="text-gray-300">|</span>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                                                {getStatusIcon(property.status)}
                                                {property.status}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatPrice(property.price)}
                                </div>
                                <div className="text-sm text-gray-500 capitalize">
                                    {property.rentType || 'N/A'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Image */}
                    <div className="relative rounded-xl overflow-hidden shadow-lg mb-6 bg-gray-200">
                        <img
                            src={mainImage}
                            alt={property.title || 'Property'}
                            className="w-full h-[400px] sm:h-[500px] object-cover"
                        />
                        {user && !isOwner() && !isAdmin() && (
                            <div className="absolute top-4 right-4">
                                <button
                                    onClick={toggleFavorite}
                                    disabled={favoriteLoading}
                                    className="bg-white shadow-lg hover:shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-110"
                                >
                                    {favoriteLoading ? (
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    ) : (
                                        isFavorited ? (
                                            <FaHeart className="w-6 h-6 text-red-500" />
                                        ) : (
                                            <FaRegHeart className="w-6 h-6 text-gray-600 hover:text-red-500" />
                                        )
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Gallery Thumbnails */}
                    {galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-8">
                            {galleryImages.slice(0, 5).map((img, index) => (
                                <div key={index} className="relative rounded-lg overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity">
                                    <img
                                        src={img}
                                        alt={`Property ${index + 2}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                            {galleryImages.length > 5 && (
                                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-800 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                                    <span className="text-white text-xl font-bold">
                                        +{galleryImages.length - 5}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {property.description || 'No description provided.'}
                                </p>
                            </div>

                            {/* Specifications */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Specifications</h2>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <FaBed className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {property.specifications?.bedrooms || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">Bedrooms</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <FaBath className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {property.specifications?.bathrooms || 0}
                                        </div>
                                        <div className="text-sm text-gray-500">Bathrooms</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                                        <FaRulerCombined className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                        <div className="text-2xl font-bold text-gray-900">
                                            {property.specifications?.size || 'N/A'}
                                        </div>
                                        <div className="text-sm text-gray-500">Size (sqft)</div>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {property.amenities.map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium"
                                            >
                                                {getAmenityIcon(amenity)}
                                                {amenity}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Extra Features */}
                            {property.extraFeatures && property.extraFeatures.length > 0 && (
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Extra Features</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {property.extraFeatures.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium"
                                            >
                                                <FaTag className="w-4 h-4" />
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Property Details</h3>

                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <FaTag className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Type</div>
                                            <div className="font-medium capitalize text-gray-900">
                                                {property.propertyType || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Location</div>
                                            <div className="font-medium text-gray-900">
                                                {property.location || 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <FaCalendarAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <div className="text-sm text-gray-500">Listed On</div>
                                            <div className="font-medium text-gray-900">
                                                {property.createdAt ? new Date(property.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                }) : 'N/A'}
                                            </div>
                                        </div>
                                    </div>

                                    {property.owner && (
                                        <div className="border-t border-gray-100 pt-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Owner Information</h4>
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                                    {property.owner.name?.charAt(0) || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                                        {property.owner.name || 'Unknown Owner'}
                                                        <MdVerified className="text-blue-500" />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                        <FaEnvelope className="w-3 h-3" />
                                                        {property.owner.email || 'No email'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ✅ Role-Based Action Buttons */}
                                    {user ? renderActionButtons() : renderGuestActions()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ✅ Reviews Section */}
                    <div className="mt-12 border-t border-gray-200 pt-8">
                        <ReviewSection propertyId={propertyId} />
                    </div>
                </div>

                {/* ✅ Booking Modal */}
                {showBookingModal && (
                    <BookingModal
                        isOpen={showBookingModal}
                        onClose={() => setShowBookingModal(false)}
                        property={property}
                        user={user}
                        onBookingConfirm={handleBookingConfirm}
                    />
                )}
            </div>

            {/* ✅ Edit Property Modal */}
            <EditPropertyModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                }}
                property={property}
                onUpdate={handlePropertyUpdate}
            />
        </>
    );
};

export default PropertyDetailsPage;