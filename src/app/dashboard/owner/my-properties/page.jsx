// app/dashboard/owner/my-properties/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied';
import { Pencil, Trash2, Eye, Plus, Loader2, ChevronLeft, ChevronRight, AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import EditPropertyModal from '@/components/EditPropertyModal';

const MyProperties = () => {
    const { data: session, status } = useSession();
    const user = session?.user;
    const userId = user?.id || user?._id;

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);

    // Delete Modal states
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        propertyId: null,
        title: ''
    });

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const fetchMyProperties = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/user/${userId}?page=${currentPage}&limit=${itemsPerPage}`,
                    { cache: 'no-store' }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch: ${res.status}`);
                }

                const data = await res.json();
                const allProperties = data?.properties || (Array.isArray(data) ? data : []);
                setProperties(allProperties);
                setTotalItems(data?.pagination?.totalItems || allProperties.length);
                setTotalPages(data?.pagination?.totalPages || 1);

            } catch (error) {
                console.error('Error fetching properties:', error);
                toast.error('Failed to load properties');
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMyProperties();
    }, [userId, currentPage, itemsPerPage]);

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
    };

    // Open delete confirmation modal
    const openDeleteModal = (propertyId, title) => {
        setDeleteModal({
            isOpen: true,
            propertyId: propertyId,
            title: title
        });
    };

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setDeleteModal({
            isOpen: false,
            propertyId: null,
            title: ''
        });
    };

    // Handle delete
    const handleDelete = async () => {
        const { propertyId, title } = deleteModal;

        if (!propertyId) return;

        setDeletingId(propertyId);
        closeDeleteModal();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${propertyId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success(`Property "${title}" deleted successfully`);
                setProperties(prev => prev.filter(p => {
                    const id = p._id?.$oid || p._id;
                    return id !== propertyId;
                }));
                setTotalItems(prev => prev - 1);
                if (properties.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                }
            } else {
                toast.error(`${data.message || 'Failed to delete property'}`);
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            toast.error('Failed to delete property');
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
            approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
            sold: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
            rented: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
        };
        return styles[status?.toLowerCase()] || styles.pending;
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return new Intl.NumberFormat('en-US').format(price);
    };

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading your properties...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your properties.</p>
                    <Link
                        href="/login"
                        className="mt-4 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (user.role?.toLowerCase() !== 'owner') {
        return <AccessDenied role="owner" />;
    }

    return (
        <>
            <div className="p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            My Properties
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Total Properties: {totalItems}
                        </p>
                    </div>
                    <Link
                        href="/dashboard/owner/add-property"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add New Property
                    </Link>
                </div>

                {properties.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                                You haven't added any properties yet.
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                                Click the "Add New Property" button to list your first property.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center w-12">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                            Title
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
                                    {properties.map((property, index) => {
                                        const propertyId = property._id?.$oid || property._id || '';
                                        const isDeleting = deletingId === propertyId;
                                        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

                                        return (
                                            <tr
                                                key={propertyId || index}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-center">
                                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        {serialNumber}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {property.images && property.images[0] ? (
                                                            <img
                                                                src={property.images[0]}
                                                                alt={property.title}
                                                                className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/40x40/CCCCCC/FFFFFF?text=No+Image';
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                                {property.title || 'Untitled'}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {property.specifications?.bedrooms || 0} bed · {property.specifications?.bathrooms || 0} bath
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                                        {property.location || 'N/A'}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                        ৳{formatPrice(property.price)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                                        {property.rentType || 'N/A'}
                                                    </p>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 capitalize">
                                                        {property.propertyType || 'N/A'}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                                                        {property.status || 'pending'}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleEditClick(property)}
                                                            className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                            title="Edit Property"
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </button>

                                                        <button
                                                            onClick={() => openDeleteModal(propertyId, property.title)}
                                                            disabled={isDeleting}
                                                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Delete Property"
                                                        >
                                                            {isDeleting ? (
                                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                                            ) : (
                                                                <Trash2 className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                        <Link
                                                            href={`/dashboard/owner/my-properties/${propertyId}`}
                                                            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                            title="View Property"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Showing <span className="font-medium">{properties.length}</span> of <span className="font-medium">{totalItems}</span> properties
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

                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>

                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => goToPage(pageNum)}
                                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                                        ? 'bg-emerald-600 text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={goToNextPage}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Delete Property
                                    </h2>
                                    <button
                                        onClick={closeDeleteModal}
                                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{deleteModal.title}"</strong>?
                                </p>
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    ⚠️ This action cannot be undone. All data associated with this property will be permanently removed.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={closeDeleteModal}
                                className="flex-1 px-4 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Property
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <EditPropertyModal
                isOpen={editModalOpen}
                onClose={() => {
                    setEditModalOpen(false);
                    setSelectedProperty(null);
                }}
                property={selectedProperty}
                onUpdate={handlePropertyUpdate}
            />
        </>
    );
};

export default MyProperties;