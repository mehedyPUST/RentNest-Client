// app/dashboard/tenant/profile/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Edit,
    Save,
    X,
    Camera,
    Shield,
    CheckCircle,
    AlertCircle,
    Loader2,
    Building2,
    Heart,
    Calendar as CalendarIcon,
    LogOut,
    Settings,
    Award
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Link from 'next/link';

const UserProfileForTenant = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user || null;

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        photo: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalFavorites: 0,
        memberSince: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

    // ✅ Load user data
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                photo: user.image || user.photo || ''
            });
            setOriginalData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                photo: user.image || user.photo || ''
            });
            fetchUserStats();
        }
    }, [user]);

    // ✅ Fetch user stats
    const fetchUserStats = async () => {
        try {
            const tenantId = user?.id || user?._id;

            // Get bookings count
            const bookingsRes = await fetch(
                `${API_URL}/api/bookings/my-bookings?tenantId=${tenantId}&page=1&limit=1`
            );
            const bookingsData = await bookingsRes.json();

            // Get favorites count
            const favRes = await fetch(
                `${API_URL}/api/favorites/my-favorites?tenantId=${tenantId}&page=1&limit=1`
            );
            const favData = await favRes.json();

            setStats({
                totalBookings: bookingsData.pagination?.totalItems || 0,
                totalFavorites: favData.favorites?.length || 0,
                memberSince: user?.createdAt || new Date().toISOString()
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // ✅ Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Handle save profile
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const userId = user?.id || user?._id;
            const response = await fetch(`${API_URL}/api/user/profile/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            toast.success('Profile updated successfully!');
            setIsEditing(false);
            setOriginalData(profileData);

            // Update session
            if (data.user) {
                // You might want to update the session here
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Handle cancel edit
    const handleCancelEdit = () => {
        setProfileData(originalData);
        setIsEditing(false);
    };

    // ✅ Handle photo upload
    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData(prev => ({
                    ...prev,
                    photo: reader.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // ✅ Format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // ✅ Loading state
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    // ✅ Not authenticated
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Please Login</h2>
                    <p className="text-gray-600">You need to be logged in to view your profile.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ✅ Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                            <p className="text-gray-600 mt-1">Manage your personal information</p>
                        </div>
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        Save Changes
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* ✅ Profile Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                    {/* Cover Photo */}
                    <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                        <div className="absolute -bottom-12 left-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-white overflow-hidden">
                                    {profileData.photo ? (
                                        <img
                                            src={profileData.photo}
                                            alt={profileData.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                            <User className="w-12 h-12 text-blue-600" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition">
                                        <Camera className="w-4 h-4 text-white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoUpload}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="pt-16 px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Your name"
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                        <Shield className="w-3 h-3" />
                                        Tenant
                                    </span>
                                    {user?.emailVerified && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {formatDate(stats.memberSince)}</span>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                    <CalendarIcon className="w-3 h-3" />
                                    Total Bookings
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    Favorites
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-900">4.8</p>
                                <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                    <Award className="w-3 h-3" />
                                    Rating
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ✅ Profile Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-blue-600" />
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {profileData.email}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {profileData.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="City, Country"
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        {profileData.location || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bio & Preferences */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            About Me
                        </h3>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">
                                    {profileData.bio || 'No bio added yet. Click edit to add one!'}
                                </p>
                            )}
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 rounded-lg p-3 text-center">
                                    <Building2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">Properties Viewed</p>
                                    <p className="text-sm font-semibold text-gray-900">24</p>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-3 text-center">
                                    <Heart className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500">Favorites</p>
                                    <p className="text-sm font-semibold text-gray-900">{stats.totalFavorites}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ✅ Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600" />
                        Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Link
                            href="/dashboard/tenant/my-bookings"
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition text-gray-700 hover:text-blue-700"
                        >
                            <CalendarIcon className="w-4 h-4" />
                            My Bookings
                        </Link>
                        <Link
                            href="/dashboard/tenant/favorites"
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg hover:bg-red-50 transition text-gray-700 hover:text-red-700"
                        >
                            <Heart className="w-4 h-4" />
                            My Favorites
                        </Link>
                        <Link
                            href="/all-properties"
                            className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg hover:bg-green-50 transition text-gray-700 hover:text-green-700"
                        >
                            <Building2 className="w-4 h-4" />
                            Browse Properties
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default UserProfileForTenant;