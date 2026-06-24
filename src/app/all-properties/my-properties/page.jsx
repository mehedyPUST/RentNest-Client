'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import {
    FaBed,
    FaBath,
    FaMapMarkerAlt,
    FaTag,
} from 'react-icons/fa';

const MyProperties = () => {
    const { data: session } = useSession();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyProperties = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties`,
                    { cache: 'no-store' }
                );

                const data = await res.json();

                // filter by logged-in user email
                const myData = data.filter(
                    (item) => item.owner?.email === session?.user?.email
                );

                setProperties(myData);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session?.user?.email) {
            fetchMyProperties();
        }
    }, [session]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <p className="text-gray-500">Loading your properties...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-2xl font-bold mb-6">
                My Properties ({properties.length})
            </h1>

            {properties.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                    You haven’t added any properties yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div
                            key={property._id?.$oid || property._id}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={property.images?.[0]}
                                    alt={property.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />

                                {/* Status badge */}
                                <span
                                    className={`absolute top-3 left-3 px-3 py-1 text-xs rounded-full text-white ${property.status === 'approved'
                                            ? 'bg-green-500'
                                            : property.status === 'pending'
                                                ? 'bg-yellow-500'
                                                : 'bg-red-500'
                                        }`}
                                >
                                    {property.status}
                                </span>

                                {/* Price */}
                                <span className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 text-sm rounded">
                                    ৳ {property.price}/{property.rentType}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="p-4 space-y-2">
                                <h2 className="text-lg font-semibold">
                                    {property.title}
                                </h2>

                                <p className="text-gray-500 text-sm flex items-center gap-1">
                                    <FaMapMarkerAlt /> {property.location}
                                </p>

                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                    <span className="flex items-center gap-1">
                                        <FaBed /> {property.specifications?.bedrooms}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaBath /> {property.specifications?.bathrooms}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaTag /> {property.propertyType}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {property.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProperties;