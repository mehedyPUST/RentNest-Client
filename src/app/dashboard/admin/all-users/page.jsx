// app/dashboard/admin/all-users/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied'; // ✅ যোগ করুন

const AllUsersPage = () => {
    const { data: session, status } = useSession();
    const user = session?.user;

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingUserId, setUpdatingUserId] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`);

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            setUsers(data.user || []);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Role update function with PATCH API
    const handleRoleChange = async (userId, newRole, userName) => {
        if (!confirm(`Are you sure you want to change ${userName}'s role to ${newRole}?`)) {
            return;
        }

        // Optimistic update
        const previousUsers = [...users];
        setUsers(users.map(user => {
            const id = user._id?.$oid || user._id || user.id;
            if (id === userId) {
                return { ...user, role: newRole };
            }
            return user;
        }));

        setUpdatingUserId(userId);

        try {
            // ✅ Using /api/user/:id (singular)
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: newRole
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`✅ Role updated to ${newRole}`);
                await fetchUsers();
            } else {
                setUsers(previousUsers);
                alert(`❌ ${data.message || 'Failed to update role'}`);
            }
        } catch (error) {
            console.error('Error updating role:', error);
            setUsers(previousUsers);
            alert('❌ Failed to update role');
        } finally {
            setUpdatingUserId(null);
        }
    };

    // ✅ Loading state
    if (status === 'loading' || loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // ✅ Not authenticated
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="text-center bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md">
                    <div className="text-5xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view this page.</p>
                    <Link href="/login" className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ ✅ ✅ Role Check - Admin (AccessDenied যোগ করা)
    if (user.role?.toLowerCase() !== 'admin') {
        return <AccessDenied role="admin" />;
    }

    if (error) {
        return (
            <div className="p-4 md:p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
                    <p className="text-red-600 dark:text-red-400">Error loading users: {error}</p>
                    <button
                        onClick={fetchUsers}
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        All Users
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Total Users: {users.length}
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                >
                    Refresh
                </button>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    SL
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {users.length > 0 ? (
                                users.map((user, index) => {
                                    const userId = user._id?.$oid || user._id || user.id || '';
                                    const isUpdating = updatingUserId === userId;

                                    return (
                                        <tr
                                            key={userId || index}
                                            className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                {index + 1}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {user.image ? (
                                                        <img
                                                            src={user.image}
                                                            alt={user.name}
                                                            className="w-8 h-8 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                                                {user.name?.charAt(0) || 'U'}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {user.name || 'Unknown User'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                                {user.email || 'No email'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.role?.toLowerCase() === 'admin'
                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                    : user.role?.toLowerCase() === 'owner'
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                        : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {user.role || 'tenant'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${user.isBlocked
                                                    ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                    : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center">
                                                    <select
                                                        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                        defaultValue={user.role || 'tenant'}
                                                        onChange={(e) => {
                                                            const newRole = e.target.value;
                                                            handleRoleChange(userId, newRole, user.name);
                                                        }}
                                                        disabled={isUpdating}
                                                    >
                                                        <option value="tenant">Tenant</option>
                                                        <option value="owner">Owner</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                    {isUpdating && (
                                                        <div className="ml-2">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-sm font-medium">No users found</p>
                                            <p className="text-xs">There are no users registered yet.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer with Stats */}
                {users.length > 0 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing <span className="font-medium">{users.length}</span> users
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                Admin: {users.filter(u => u.role === 'admin').length}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                Owner: {users.filter(u => u.role === 'owner').length}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                Tenant: {users.filter(u => u.role === 'tenant').length}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllUsersPage;