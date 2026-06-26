// app/dashboard/admin/all-properties/page.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    Pencil,
    Trash2,
    CheckCircle,
    XCircle,
    RefreshCw,
    Search,
    Eye,
    Loader2,
    RotateCcw,
    AlertTriangle,
    Info
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import EditPropertyModal from '@/components/EditPropertyModal';

// API Service
const API_BASE = process.env.NEXT_PUBLIC_BASE_URL;

const propertyApi = {
    getAll: async () => {
        const res = await fetch(`${API_BASE}/api/properties?isAdmin=true&limit=100`, {
            cache: 'no-store'
        });
        if (!res.ok) throw new Error('Failed to fetch properties');
        const data = await res.json();
        if (Array.isArray(data)) return data;
        if (data?.properties && Array.isArray(data.properties)) return data.properties;
        return [];
    },
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
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${styles[statusKey] || styles.pending}`}>
            {statusKey}
        </span>
    );
};

const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('en-US').format(price);
};

const AllPropertiesPageAdminView = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [processingId, setProcessingId] = useState(null);

    // ✅ Reject Modal
    const [rejectModal, setRejectModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        property: null
    });
    const [rejectReason, setRejectReason] = useState('');

    // ✅ Confirmation Modal
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        id: null,
        title: '',
        action: '', // 'approve', 'reject', 'delete'
        message: '',
        confirmText: '',
        confirmColor: '',
        property: null
    });

    // ✅ Edit Modal
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

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

    // ✅ Open Confirmation Modal
    const openConfirmModal = (property, action, message, confirmText, confirmColor) => {
        setConfirmModal({
            isOpen: true,
            id: property._id,
            title: property.title || 'Untitled',
            action: action,
            message: message,
            confirmText: confirmText,
            confirmColor: confirmColor,
            property: property
        });
    };

    // ✅ Close Confirmation Modal
    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            id: null,
            title: '',
            action: '',
            message: '',
            confirmText: '',
            confirmColor: '',
            property: null
        });
    };

    // ✅ Handle Confirm Action
    const handleConfirmAction = async () => {
        const { id, title, action, property } = confirmModal;
        if (!id) return;

        setProcessingId(id);

        try {
            if (action === 'approve') {
                await propertyApi.approve(id);
                toast.success(`✅ "${title}" approved successfully`);
            } else if (action === 'reject') {
                // এখানে reject modal খুলবে
                closeConfirmModal();
                openRejectModal(property);
                return;
            } else if (action === 'delete') {
                await propertyApi.delete(id);
                toast.success(`✅ "${title}" deleted successfully`);
            }

            await fetchData();
            closeConfirmModal();
        } catch (error) {
            toast.error(`❌ ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    // ✅ Open Reject Modal
    const openRejectModal = (property) => {
        setRejectModal({
            isOpen: true,
            id: property._id,
            title: property.title || 'Untitled',
            property: property
        });
        setRejectReason('');
    };

    // ✅ Close Reject Modal
    const closeRejectModal = () => {
        setRejectModal({
            isOpen: false,
            id: null,
            title: '',
            property: null
        });
        setRejectReason('');
    };

    // ✅ Handle Reject Submit
    const handleRejectSubmit = async () => {
        const { id, title } = rejectModal;
        if (!id) return;

        setProcessingId(id);

        try {
            await propertyApi.reject(id, rejectReason || 'No reason provided');
            toast.success(`✅ "${title}" rejected`);
            await fetchData();
            closeRejectModal();
        } catch (error) {
            toast.error(`❌ ${error.message}`);
        } finally {
            setProcessingId(null);
        }
    };

    const handleEditClick = (property) => {
        setSelectedProperty(property);
        setEditModalOpen(true);
    };

    const handlePropertyUpdate = (updatedProperty) => {
        setProperties(prev => prev.map(p => {
            const pId = p._id?.$oid || p._id;
            const uId = updatedProperty._id?.$oid || updatedProperty._id;
            return pId === uId ? updatedProperty : p;
        }));
        // toast.success('Property updated successfully!');
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch =
            property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.owner?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getPropertyId = (property) => {
        return property._id?.$oid || property._id || property.id || '';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading properties...</p>
                </div>
            </div>
        );
    }

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
        <>
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
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Property</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Location</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">Actions</th>
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
                                        const propertyId = getPropertyId(property);
                                        const isProcessing = processingId === propertyId;
                                        const status = property.status?.toLowerCase() || 'pending';
                                        const isApproved = status === 'approved';
                                        const isRejected = status === 'rejected';
                                        const isPending = status === 'pending';

                                        return (
                                            <tr key={propertyId || index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {property.images && property.images[0] ? (
                                                            <img src={property.images[0]} alt={property.title} className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-700" onError={(e) => { e.target.src = 'https://via.placeholder.com/48x48/CCCCCC/FFFFFF?text=No+Image'; }} />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{property.title || 'Untitled'}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{property.specifications?.bedrooms || 0} bed · {property.specifications?.bathrooms || 0} bath · {property.specifications?.size || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{property.owner?.name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">{property.owner?.email || 'No email'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">{property.location || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">৳{formatPrice(property.price)}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{property.rentType || 'N/A'}</p>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize">{property.propertyType || 'N/A'}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <StatusBadge status={status} />
                                                    {isRejected && property.rejectionReason && (
                                                        <p className="text-xs text-red-500 mt-1 truncate max-w-[100px]">{property.rejectionReason}</p>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-wrap items-center justify-center gap-1">
                                                        {/* View */}
                                                        <Link href={`/all-properties/${propertyId}`} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View Property">
                                                            <Eye className="w-4 h-4" />
                                                        </Link>

                                                        {/* Edit */}
                                                        <button onClick={() => handleEditClick(property)} className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Edit Property">
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        {/* ✅ Approve - Pending & Rejected */}
                                                        {(isPending || isRejected) && (
                                                            <button
                                                                onClick={() => openConfirmModal(
                                                                    property,
                                                                    'approve',
                                                                    `Are you sure you want to ${isRejected ? 're-approve' : 'approve'} "${property.title}"?`,
                                                                    isRejected ? 'Re-Approve' : 'Approve',
                                                                    'bg-green-600 hover:bg-green-700'
                                                                )}
                                                                disabled={isProcessing}
                                                                className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title={isRejected ? "Re-Approve Property" : "Approve Property"}
                                                            >
                                                                {isProcessing && processingId === propertyId ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <CheckCircle className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}

                                                        {/* ✅ Reject - Pending & Approved */}
                                                        {(isPending || isApproved) && (
                                                            <button
                                                                onClick={() => openRejectModal(property)}
                                                                disabled={isProcessing}
                                                                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                title={isApproved ? "Reject Approved Property" : "Reject Property"}
                                                            >
                                                                {isProcessing && processingId === propertyId ? (
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                ) : (
                                                                    <XCircle className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                        )}

                                                        {/* Delete */}
                                                        <button
                                                            onClick={() => openConfirmModal(
                                                                property,
                                                                'delete',
                                                                `Are you sure you want to delete "${property.title}"? This action cannot be undone.`,
                                                                'Delete',
                                                                'bg-red-600 hover:bg-red-700'
                                                            )}
                                                            disabled={isProcessing}
                                                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Delete Property"
                                                        >
                                                            {isProcessing && processingId === propertyId ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
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

                    {filteredProperties.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400">Showing <span className="font-medium">{filteredProperties.length}</span> of <span className="font-medium">{properties.length}</span> properties</p>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Pending: {properties.filter(p => p.status === 'pending').length}</span>
                                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Approved: {properties.filter(p => p.status === 'approved').length}</span>
                                <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Rejected: {properties.filter(p => p.status === 'rejected').length}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ✅ Edit Property Modal */}
            <EditPropertyModal
                isOpen={editModalOpen}
                onClose={() => { setEditModalOpen(false); setSelectedProperty(null); }}
                property={selectedProperty}
                onUpdate={handlePropertyUpdate}
            />

            {/* ✅ Confirmation Modal (Approve / Delete) */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-2 rounded-full ${confirmModal.action === 'delete' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                                {confirmModal.action === 'delete' ? (
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                ) : (
                                    <Info className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                )}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {confirmModal.action === 'approve' ? 'Approve Property' : 'Delete Property'}
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {confirmModal.message}
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={closeConfirmModal}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmAction}
                                disabled={processingId === confirmModal.id}
                                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${confirmModal.confirmColor}`}
                            >
                                {processingId === confirmModal.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    confirmModal.confirmText
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ✅ Reject Modal */}
            {rejectModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Reject Property
                            </h2>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-2">
                            Please provide a reason for rejecting <strong>"{rejectModal.title}"</strong>
                        </p>

                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors min-h-[100px] resize-none"
                            autoFocus
                        />

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={closeRejectModal}
                                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={processingId === rejectModal.id}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processingId === rejectModal.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Reject'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AllPropertiesPageAdminView;