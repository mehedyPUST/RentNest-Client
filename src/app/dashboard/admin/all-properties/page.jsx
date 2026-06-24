'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Pencil,
    Trash2,
    CheckCircle,
    XCircle,
    RefreshCw,
    Search
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

// API Service
const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

const propertyApi = {
    // Get all properties
    getAll: async () => {
        const res = await fetch(`${API_BASE}/api/properties`, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        return Array.isArray(data) ? data : data?.properties || [];
    },

    // Approve property
    approve: async (id) => {
        const res = await fetch(`${API_BASE}/api/properties/${id}/approve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'approved' })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to approve');
        return data;
    },

    // Reject property
    reject: async (id, reason) => {
        const res = await fetch(`${API_BASE}/api/properties/${id}/reject`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'rejected',
                rejectionReason: reason || 'No reason provided'
            })
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to reject');
        return data;
    },

    // Delete property
    delete: async (id) => {
        const res = await fetch(`${API_BASE}/api/properties/${id}`, {
            method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Failed to delete');
        return data;
    }
};

// Status Badge Component
const StatusBadge = ({ status }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        sold: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
        rented: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    };
    const statusKey = status?.toLowerCase() || 'pending';

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[statusKey]}`}>
            {statusKey}
        </span>
    );
};

// Price Formatter
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
};

// Main Component
const AllPropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [processingId, setProcessingId] = useState(null);

    // Fetch all properties
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const props = await propertyApi.getAll();
            setProperties(props);
        } catch (err) {
            setError(err.message);
            setProperties([]);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Approve property
    const handleApprove = async (propertyId, title) => {
        if (!confirm(`Are you sure you want to approve "${title}"?`)) return;

        setProcessingId(propertyId);
        try {
            await propertyApi.approve(propertyId);
            toast.success(`✅ "${title}" approved successfully`);
            await fetchData();
        } catch (error) {
            toast.error(`❌ ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    // Reject property
    const handleReject = async (propertyId, title) => {
        const reason = prompt(`Why are you rejecting "${title}"?`, '');
        if (reason === null) return;

        setProcessingId(propertyId);
        try {
            await propertyApi.reject(propertyId, reason);
            toast.success(`✅ "${title}" rejected`);
            await fetchData();
        } catch (error) {
            toast.error(`❌ ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    // Delete property
    const handleDelete = async (propertyId, title) => {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

        setProcessingId(propertyId);
        try {
            await propertyApi.delete(propertyId);
            toast.success(`✅ "${title}" deleted successfully`);
            await fetchData();
        } catch (error) {
            toast.error(`❌ ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    // Filter properties
    const filteredProperties = properties.filter(property => {
        const matchesSearch =
            property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || property.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Loading State
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="p-4 md:p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                    <button
                        onClick={fetchData}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Properties
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total Properties: {filteredProperties.length}
                    </p>
                </div>
                <button
                    onClick={fetchData}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by title, location, or owner..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                        />
                    </div>
                </div>
                <div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="sold">Sold</option>
                        <option value="rented">Rented</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Property
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredProperties.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="text-sm font-medium">No properties found</p>
                                            <p className="text-xs">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredProperties.map((property, index) => {
                                    const propertyId = property._id?.$oid || property._id || '';
                                    const isProcessing = processingId === propertyId;
                                    const status = property.status?.toLowerCase() || 'pending';

                                    return (
                                        <tr
                                            key={propertyId || index}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            {/* Property */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {property.images && property.images[0] ? (
                                                        <img
                                                            src={property.images[0]}
                                                            alt={property.title}
                                                            className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                            {property.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {property.specifications?.bedrooms || 0} bed · {property.specifications?.bathrooms || 0} bath · {property.specifications?.size || 'N/A'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Owner */}
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {property.owner?.name || 'Unknown'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {property.owner?.email || 'No email'}
                                                </p>
                                            </td>

                                            {/* Location */}
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                                    {property.location}
                                                </p>
                                            </td>

                                            {/* Price */}
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                    ৳{formatPrice(property.price)}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                    {property.rentType}
                                                </p>
                                            </td>

                                            {/* Type */}
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize">
                                                    {property.propertyType}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <StatusBadge status={status} />
                                            </td>

                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap items-center justify-center gap-1">
                                                    {/* Approve Button */}
                                                    <button
                                                        onClick={() => handleApprove(propertyId, property.title)}
                                                        disabled={isProcessing || status === 'approved' || status === 'rejected'}
                                                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${status === 'approved' || status === 'rejected'
                                                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                                : 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20'
                                                            }`}
                                                        title={status === 'approved' ? 'Already Approved' : status === 'rejected' ? 'Rejected' : 'Approve Property'}
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>

                                                    {/* Reject Button */}
                                                    <button
                                                        onClick={() => handleReject(propertyId, property.title)}
                                                        disabled={isProcessing || status === 'approved' || status === 'rejected'}
                                                        className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${status === 'approved' || status === 'rejected'
                                                                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                                : 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20'
                                                            }`}
                                                        title={status === 'rejected' ? 'Already Rejected' : status === 'approved' ? 'Approved' : 'Reject Property'}
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>

                                                    {/* Edit Button */}
                                                    <Link
                                                        href={`/dashboard/admin/properties/edit/${propertyId}`}
                                                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                        title="Edit Property"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>

                                                    {/* Delete Button */}
                                                    <button
                                                        onClick={() => handleDelete(propertyId, property.title)}
                                                        disabled={isProcessing}
                                                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        title="Delete Property"
                                                    >
                                                        {isProcessing ? (
                                                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                {filteredProperties.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span className="font-medium">{filteredProperties.length}</span> of <span className="font-medium">{properties.length}</span> properties
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                                Pending: {properties.filter(p => p.status === 'pending').length}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Approved: {properties.filter(p => p.status === 'approved').length}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Rejected: {properties.filter(p => p.status === 'rejected').length}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllPropertiesPage;