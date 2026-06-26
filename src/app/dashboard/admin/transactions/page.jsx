// app/dashboard/admin/transactions/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import {
    DollarSign,
    Search,
    Filter,
    RefreshCw,
    Loader2,
    ArrowUpDown,
    Calendar,
    Home,
    User,
    Building2,
    ChevronLeft,
    ChevronRight,
    Eye,
    Download,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const TransactionsPageAdmin = () => {
    const { data: session, status } = useSession();
    const user = session?.user;

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // Fetch transactions
    const fetchTransactions = async (page = 1, status = 'all', search = '') => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            let url = `${API_URL}/api/admin/transactions?page=${page}&limit=${itemsPerPage}`;

            if (status !== 'all') {
                url += `&status=${status}`;
            }
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            const response = await fetch(url, {
                cache: 'no-store'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch transactions');
            }

            const data = await response.json();

            if (data.success) {
                setTransactions(data.transactions || []);
                setTotalItems(data.totalItems || data.transactions?.length || 0);
            } else {
                throw new Error(data.message || 'Failed to fetch transactions');
            }

        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError(error.message);
            setTransactions([]);
            toast.error('Failed to load transactions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchTransactions(currentPage, filterStatus, searchTerm);
        }
    }, [user, currentPage, filterStatus]);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTransactions(1, filterStatus, searchTerm);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        fetchTransactions(1, filterStatus, '');
    };

    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchTransactions(newPage, filterStatus, searchTerm);
        }
    };

    // View transaction details
    const viewTransactionDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusMap = {
            'paid': { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid ✓', icon: <CheckCircle className="w-3 h-3" /> },
            'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending ⏳', icon: <Clock className="w-3 h-3" /> },
            'failed': { bg: 'bg-red-100', text: 'text-red-800', label: 'Failed ✗', icon: <XCircle className="w-3 h-3" /> },
            'refunded': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Refunded', icon: <ArrowUpDown className="w-3 h-3" /> }
        };
        const info = statusMap[status] || statusMap['pending'];
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${info.bg} ${info.text}`}>
                {info.icon}
                {info.label}
            </span>
        );
    };

    // Get payment type badge
    const getPaymentTypeBadge = (type) => {
        const typeMap = {
            'booking': 'bg-blue-100 text-blue-800',
            'rent': 'bg-purple-100 text-purple-800',
            'deposit': 'bg-orange-100 text-orange-800',
            'refund': 'bg-gray-100 text-gray-800'
        };
        const bg = typeMap[type] || typeMap['booking'];
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${bg}`}>
                {type || 'Booking'}
            </span>
        );
    };

    // ✅ Get owner name from transaction
    const getOwnerName = (transaction) => {
        // Try to get owner name from different possible fields
        if (transaction.ownerInfo?.name) return transaction.ownerInfo.name;
        if (transaction.owner?.name) return transaction.owner.name;
        if (transaction.ownerName) return transaction.ownerName;

        // If not found, try to get from propertyInfo
        if (transaction.propertyInfo?.owner?.name) return transaction.propertyInfo.owner.name;

        return 'N/A';
    };

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    // Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to view transactions.</p>
                    <Link href="/login" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // Check if user is admin
    if (user.role?.toLowerCase() !== 'admin') {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-6xl mb-4">⛔</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You do not have permission to view transactions.</p>
                    <Link href="/dashboard" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage all payment transactions
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => fetchTransactions(currentPage, filterStatus, searchTerm)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button
                            onClick={() => toast.info('Download feature coming soon!')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Total Transactions</p>
                        <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {formatCurrency(transactions.reduce((sum, t) => sum + (t.amount || 0), 0))}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Successful</p>
                        <p className="text-2xl font-bold text-green-600">
                            {transactions.filter(t => t.status === 'paid').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <p className="text-sm text-gray-500">Pending</p>
                        <p className="text-2xl font-bold text-yellow-600">
                            {transactions.filter(t => t.status === 'pending').length}
                        </p>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by transaction ID, property, or tenant..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                />
                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Search
                            </button>
                        </form>

                        <select
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setCurrentPage(1);
                                fetchTransactions(1, e.target.value, searchTerm);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="paid">Paid</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Transaction ID
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Property
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Tenant
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Owner
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {transactions.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="px-4 py-8 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-2">
                                                <DollarSign className="w-12 h-12 text-gray-300" />
                                                <p className="text-sm font-medium">No transactions found</p>
                                                <p className="text-xs">Try adjusting your search or filter</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    transactions.map((transaction) => (
                                        <tr
                                            key={transaction._id}
                                            className="hover:bg-gray-50 transition-colors"
                                        >
                                            <td className="px-4 py-3">
                                                <p className="font-mono text-xs text-gray-600">
                                                    #{transaction._id?.slice(-8) || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900 line-clamp-1">
                                                    {transaction.propertyInfo?.title || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {transaction.propertyInfo?.location || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900">{transaction.tenantInfo?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500">{transaction.tenantInfo?.email || 'N/A'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900">
                                                    {getOwnerName(transaction)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-900">
                                                    {formatCurrency(transaction.amount)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {getPaymentTypeBadge(transaction.paymentType)}
                                            </td>
                                            <td className="px-4 py-3">
                                                {getStatusBadge(transaction.status)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-600">
                                                    {formatDate(transaction.createdAt)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => viewTransactionDetails(transaction)}
                                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-sm text-gray-600">
                                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                                {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                <span className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm">
                                    {currentPage}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 text-sm"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Transaction Details Modal */}
            {showDetailsModal && selectedTransaction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction Details</h2>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Transaction ID</p>
                                    <p className="font-mono text-sm font-medium">{selectedTransaction._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div>{getStatusBadge(selectedTransaction.status)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Amount</p>
                                    <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedTransaction.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Type</p>
                                    <div>{getPaymentTypeBadge(selectedTransaction.paymentType)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date</p>
                                    <p className="text-sm">{formatDate(selectedTransaction.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Payment Method</p>
                                    <p className="text-sm capitalize">{selectedTransaction.paymentMethod || 'Stripe'}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Property Information</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                    <p><span className="text-sm text-gray-500">Title:</span> {selectedTransaction.propertyInfo?.title || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Location:</span> {selectedTransaction.propertyInfo?.location || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Price:</span> {formatCurrency(selectedTransaction.propertyInfo?.price)}</p>
                                    <p><span className="text-sm text-gray-500">Owner:</span> {getOwnerName(selectedTransaction)}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="font-semibold text-gray-900 mb-2">Tenant Information</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                    <p><span className="text-sm text-gray-500">Name:</span> {selectedTransaction.tenantInfo?.name || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Email:</span> {selectedTransaction.tenantInfo?.email || 'N/A'}</p>
                                    <p><span className="text-sm text-gray-500">Phone:</span> {selectedTransaction.tenantInfo?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedTransaction.additionalNotes && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Additional Notes</h3>
                                    <p className="text-sm text-gray-600">{selectedTransaction.additionalNotes}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPageAdmin;