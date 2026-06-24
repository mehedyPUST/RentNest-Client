// components/RoleDropdown.js (Client Component)
'use client';

import { useState } from 'react';

export default function RoleDropdown({ user, onRoleChange }) {
    const [selectedRole, setSelectedRole] = useState(user.role || 'tenant');

    const handleChange = async (e) => {
        const newRole = e.target.value;
        if (confirm(`Are you sure you want to change ${user.name}'s role to ${newRole}?`)) {
            setSelectedRole(newRole);
            await onRoleChange(user._id || user.id, newRole);
        } else {
            e.target.value = selectedRole;
        }
    };

    return (
        <select
            className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
            value={selectedRole}
            onChange={handleChange}
        >
            <option value="tenant">Tenant</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
        </select>
    );
}