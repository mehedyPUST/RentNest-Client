// app/dashboard/admin/transactions/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied';
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

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchTransactions(1, filterStatus, searchTerm);
    };

    const clearSearch = () => {
        setSearchTerm('');
        setCurrentPage(1);
        fetchTransactions(1, filterStatus, '');
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            fetchTransactions(newPage, filterStatus, searchTerm);
        }
    };

    const viewTransactionDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
    };

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

    const formatCurrency = (amount) => {
        if (!amount) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

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

    const getOwnerName = (transaction) => {
        if (transaction.ownerInfo?.name) return transaction.ownerInfo.name;
        if (transaction.owner?.name) return transaction.owner.name;
        if (transaction.ownerName) return transaction.ownerName;
        if (transaction.propertyInfo?.owner?.name) return transaction.propertyInfo.owner.name;
        return 'N/A';
    };

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view transactions.</p>
                    <Link href="/login" className="mt-6 inline-block px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (user.role?.toLowerCase() !== 'admin') {
        return <AccessDenied role="admin" />;
    }

    return (
        <div className="p-4 md:p-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transactions</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        View and manage all payment transactions
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchTransactions(currentPage, filterStatus, searchTerm)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </button>
                    <button
                        onClick={() => toast.info('Download feature coming soon!')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(transactions.reduce((sum, t) => sum + (t.amount || 0), 0))}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {transactions.filter(t => t.status === 'paid').length}
                    </p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {transactions.filter(t => t.status === 'pending').length}
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by transaction ID, property, or tenant..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <XCircle className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
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
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
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
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-center w-12">
                                    #
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Property
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Tenant
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider text-center">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <DollarSign className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                                            <p className="text-sm font-medium">No transactions found</p>
                                            <p className="text-xs">Try adjusting your search or filter</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction, index) => {
                                    const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;
                                    return (
                                        <tr
                                            key={transaction._id}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-center">
                                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {serialNumber}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
                                                    #{transaction._id?.slice(-8) || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900 dark:text-white line-clamp-1">
                                                    {transaction.propertyInfo?.title || 'N/A'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {transaction.propertyInfo?.location || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900 dark:text-white">{transaction.tenantInfo?.name || 'N/A'}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.tenantInfo?.email || 'N/A'}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-gray-900 dark:text-white">
                                                    {getOwnerName(transaction)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-semibold text-gray-900 dark:text-white">
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
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {formatDate(transaction.createdAt)}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => viewTransactionDetails(transaction)}
                                                    className="p-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center justify-between gap-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                            >
                                First
                            </button>
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            {/* Page Numbers */}
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
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`px-3 py-1.5 text-sm rounded-lg transition ${currentPage === pageNum
                                                    ? 'bg-emerald-600 text-white font-medium'
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                )}
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
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                                    <p className="font-mono text-sm font-medium text-gray-900 dark:text-white">{selectedTransaction._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <div>{getStatusBadge(selectedTransaction.status)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Amount</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(selectedTransaction.amount)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Type</p>
                                    <div>{getPaymentTypeBadge(selectedTransaction.paymentType)}</div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                                    <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedTransaction.createdAt)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Payment Method</p>
                                    <p className="text-sm text-gray-900 dark:text-white capitalize">{selectedTransaction.paymentMethod || 'Stripe'}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Property Information</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Title:</span> {selectedTransaction.propertyInfo?.title || 'N/A'}</p>
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Location:</span> {selectedTransaction.propertyInfo?.location || 'N/A'}</p>
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Price:</span> {formatCurrency(selectedTransaction.propertyInfo?.price)}</p>
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Owner:</span> {getOwnerName(selectedTransaction)}</p>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tenant Information</h3>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Name:</span> {selectedTransaction.tenantInfo?.name || 'N/A'}</p>
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Email:</span> {selectedTransaction.tenantInfo?.email || 'N/A'}</p>
                                    <p className="text-gray-900 dark:text-white"><span className="text-sm text-gray-500 dark:text-gray-400">Phone:</span> {selectedTransaction.tenantInfo?.phone || 'N/A'}</p>
                                </div>
                            </div>

                            {selectedTransaction.additionalNotes && (
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Additional Notes</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedTransaction.additionalNotes}</p>
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