// app/dashboard/owner/properties/[id]/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt,
    FaCalendarAlt, FaUser, FaEnvelope, FaTag,
    FaArrowLeft, FaHeart, FaShare, FaPrint,
    FaWifi, FaParking, FaSwimmingPool, FaDumbbell,
    FaShieldAlt, FaFire, FaSnowflake, FaTv, FaEdit, FaEye, FaTrash
} from 'react-icons/fa';
import { MdVerified, MdPending, MdCancel, MdCheckCircle, MdWarning, MdInfo } from 'react-icons/md';
import { GiFlowerPot, GiFruitTree } from 'react-icons/gi';
import toast from 'react-hot-toast';
import { useSession } from '@/lib/auth-client';
import EditPropertyModal from '@/components/EditPropertyModal';

const OwnerPropertyDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const id = params?.id;

    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${id}`, {
                    cache: 'no-store'
                });

                if (!res.ok) throw new Error('Failed to fetch property');

                const data = await res.json();
                const found = data;

                if (!found) {
                    setError('Property not found');
                } else {
                    setProperty(found);
                    // Check if current user is the owner
                    const userId = session?.user?.id || session?.user?._id;
                    const ownerId = found.ownerId || found.owner?.id;
                    setIsOwner(userId === ownerId);
                }
            } catch (err) {
                console.error('Error fetching property:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProperty();
        }
    }, [id, session]);

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

    const getStatusBg = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return 'bg-green-50 border-green-200';
            case 'pending':
                return 'bg-yellow-50 border-yellow-200';
            case 'rejected':
                return 'bg-red-50 border-red-200';
            default:
                return 'bg-gray-50 border-gray-200';
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

    // Handle share button
    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: property?.title || 'Property',
                text: `Check out this property: ${property?.title}`,
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    // Handle print
    const handlePrint = () => {
        window.print();
    };

    // Handle view live property
    const handleViewLive = () => {
        router.push(`/all-properties/${id}`);
    };

    // Handle Edit & Resubmit - Open Modal
    const handleEditResubmit = () => {
        setEditModalOpen(true);
    };

    // Handle Update
    const handlePropertyUpdate = (updatedProperty) => {
        setProperty(updatedProperty);
        toast.success('Property updated successfully!');
        setTimeout(() => {
            router.push('/dashboard/owner/my-properties');
        }, 1500);
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
                router.push('/dashboard/owner/my-properties');
            } else {
                toast.error(data.message || 'Failed to delete property');
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Failed to delete property');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
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
                    <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href={'/dashboard/owner/my-properties'}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <FaArrowLeft />
                        Back to My Properties
                    </Link>
                </div>
            </div>
        );
    }

    // Get the first image or use placeholder
    const mainImage = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://via.placeholder.com/1200x600/CCCCCC/FFFFFF?text=No+Image';

    const galleryImages = property.images?.slice(1) || [];

    // Check status
    const isRejected = property.status?.toLowerCase() === 'rejected';
    const isApproved = property.status?.toLowerCase() === 'approved';
    const isPending = property.status?.toLowerCase() === 'pending';

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Top Navigation */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <Link
                                href={"/dashboard/owner/my-properties"}
                                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <FaArrowLeft />
                                <span className="font-medium">Back to My Properties</span>
                            </Link>
                            <div className="flex items-center gap-3">
                                {isApproved && (
                                    <button
                                        onClick={handleViewLive}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                    >
                                        <FaEye className="w-4 h-4" />
                                        View Live
                                    </button>
                                )}
                                <button
                                    onClick={handleShare}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FaShare className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FaPrint className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* 🔴 Rejection Alert Banner */}
                    {isRejected && property.rejectionReason && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <MdCancel className="w-7 h-7 text-red-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
                                        Property Rejected
                                        <span className="text-sm font-normal text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                            {property.rejectedAt ? new Date(property.rejectedAt).toLocaleDateString() : ''}
                                        </span>
                                    </h3>
                                    <p className="text-red-700 mt-1 font-medium">
                                        Reason: {property.rejectionReason}
                                    </p>
                                    <p className="text-sm text-red-600 mt-2 bg-red-100/50 p-3 rounded-lg">
                                        <span className="font-semibold">💡 Suggestion:</span> Please review the rejection reason and make necessary changes before submitting again.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <button
                                            onClick={handleEditResubmit}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                        >
                                            <FaEdit className="w-4 h-4" />
                                            Edit & Resubmit
                                        </button>
                                        <Link
                                            href="/dashboard/owner/my-properties"
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                        >
                                            View All Properties
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ⏳ Pending Alert Banner */}
                    {isPending && (
                        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <MdPending className="w-7 h-7 text-yellow-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-yellow-800 flex items-center gap-2">
                                        Pending Approval
                                        <span className="text-sm font-normal text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                                            Under Review
                                        </span>
                                    </h3>
                                    <p className="text-yellow-700 mt-1">
                                        Your property is currently being reviewed by our admin team.
                                    </p>
                                    <p className="text-sm text-yellow-600 mt-2 bg-yellow-100/50 p-3 rounded-lg">
                                        ⏳ This process usually takes 24-48 hours. You will be notified once a decision is made.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ✅ Approved Alert Banner */}
                    {isApproved && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <MdVerified className="w-7 h-7 text-green-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                                        Property Approved! 🎉
                                        <span className="text-sm font-normal text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                            {property.approvedAt ? new Date(property.approvedAt).toLocaleDateString() : ''}
                                        </span>
                                    </h3>
                                    <p className="text-green-700 mt-1">
                                        Your property has been approved and is now live on RentNest.
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-3">
                                        <button
                                            onClick={handleViewLive}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            <FaEye className="w-4 h-4" />
                                            View Live Property
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
                    <div className={`relative rounded-xl overflow-hidden shadow-lg mb-6 bg-gray-200 ${isRejected ? 'opacity-75' : ''}`}>
                        <img
                            src={mainImage}
                            alt={property.title || 'Property'}
                            className="w-full h-[400px] sm:h-[500px] object-cover"
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/1200x600/CCCCCC/FFFFFF?text=No+Image';
                            }}
                        />
                        {isRejected && (
                            <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                                <div className="bg-red-600/90 text-white px-8 py-4 rounded-xl text-2xl font-bold transform -rotate-12 shadow-xl">
                                    REJECTED
                                </div>
                            </div>
                        )}
                        {isPending && (
                            <div className="absolute inset-0 bg-yellow-900/10 flex items-center justify-center">
                                <div className="bg-yellow-600/90 text-white px-8 py-4 rounded-xl text-2xl font-bold transform -rotate-12 shadow-xl">
                                    PENDING
                                </div>
                            </div>
                        )}
                        {isApproved && (
                            <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                                <MdVerified className="w-5 h-5" />
                                <span className="font-bold">VERIFIED</span>
                            </div>
                        )}
                    </div>

                    {/* Gallery Thumbnails */}
                    {galleryImages.length > 0 && (
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-8">
                            {galleryImages.slice(0, 5).map((img, index) => (
                                <div key={index} className={`relative rounded-lg overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-80 transition-opacity ${isRejected ? 'opacity-60' : ''}`}>
                                    <img
                                        src={img}
                                        alt={`Property ${index + 2}`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=No+Image';
                                        }}
                                    />
                                </div>
                            ))}
                            {galleryImages.length > 5 && (
                                <div className={`relative rounded-lg overflow-hidden aspect-square bg-gray-800 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity ${isRejected ? 'opacity-60' : ''}`}>
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
                            <div className={`bg-white rounded-xl shadow-sm p-6 border ${getStatusBg(property.status)}`}>
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
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${isRejected ? 'bg-gray-100 text-gray-500' : 'bg-blue-50 text-blue-700'}`}
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
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${isRejected ? 'bg-gray-100 text-gray-500' : 'bg-purple-50 text-purple-700'}`}
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
                            {/* Property Info Card */}
                            <div className={`bg-white rounded-xl shadow-sm p-6 border ${getStatusBg(property.status)} sticky top-24`}>
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

                                    {isRejected && property.rejectionReason && (
                                        <div className="border-t border-red-200 pt-4">
                                            <div className="bg-red-50 rounded-lg p-4">
                                                <div className="flex items-center gap-2 text-red-700">
                                                    <MdWarning className="w-5 h-5" />
                                                    <span className="font-semibold">Rejection Reason</span>
                                                </div>
                                                <p className="text-red-600 text-sm mt-1">{property.rejectionReason}</p>
                                            </div>
                                        </div>
                                    )}

                                    {property.owner && (
                                        <>
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
                                        </>
                                    )}

                                    {/* ✅ Action Buttons - শুধু Edit & Delete */}
                                    <div className="space-y-3 pt-4 border-t border-gray-100">
                                        {isRejected ? (
                                            <>
                                                <button
                                                    onClick={handleEditResubmit}
                                                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/30 flex items-center justify-center gap-2"
                                                >
                                                    <FaEdit className="w-4 h-4" />
                                                    Edit & Resubmit
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md shadow-red-500/30 flex items-center justify-center gap-2"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                    Delete Property
                                                </button>
                                            </>
                                        ) : isPending ? (
                                            <>
                                                <button
                                                    onClick={handleEditResubmit}
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
                                            </>
                                        ) : (
                                            // ✅ Approved
                                            <>
                                                <button
                                                    onClick={handleEditResubmit}
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
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default OwnerPropertyDetailsPage;