import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    FaBed, FaBath, FaRulerCombined, FaMapMarkerAlt,
    FaCalendarAlt, FaUser, FaEnvelope, FaTag,
    FaArrowLeft, FaHeart, FaShare, FaPrint,
    FaWifi, FaParking, FaSwimmingPool, FaDumbbell,
    FaShieldAlt, FaFire, FaSnowflake, FaTv
} from 'react-icons/fa';
import { MdVerified, MdPending, MdCancel, MdCheckCircle } from 'react-icons/md';
import { GiFlowerPot, GiFruitTree } from 'react-icons/gi';

const PropertyDetailsPage = async ({ params }) => {
    const { id } = await params;

    // Fetch all properties and find the specific one
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`, {
        cache: 'no-store'
    });

    const data = await res.json();
    const properties = Array.isArray(data) ? data : data?.properties || [];
    const property = properties.find(p => {
        const propertyId = p._id?.$oid || p._id || p.id;
        return propertyId == id;
    });

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Property Not Found</h1>
                    <p className="text-gray-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
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

    // Get the first image or use placeholder
    const mainImage = property.images && property.images.length > 0
        ? property.images[0]
        : 'https://via.placeholder.com/1200x600/CCCCCC/FFFFFF?text=No+Image';

    const galleryImages = property.images?.slice(1) || [];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Navigation */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            href="/all-properties"
                            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <FaArrowLeft />
                            <span className="font-medium">Back to Properties</span>
                        </Link>
                        <div className="flex items-center gap-3">
                            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                                <FaHeart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                            </button>
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
                        {/* Property Info Card */}
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

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4">
                                    <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30">
                                        Contact Owner
                                    </button>
                                    <button className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                                        Schedule Viewing
                                    </button>
                                </div>
                                <div className="space-y-3 pt-4">
                                    <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/30">
                                        Add To Favorites
                                    </button>
                                    <button className="w-full py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsPage;