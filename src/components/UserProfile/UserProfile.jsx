// components/UserProfile/UserProfile.jsx
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import AccessDenied from '@/components/AccessDenied';
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
    Loader2,
    Building2,
    Heart,
    Calendar as CalendarIcon,
    Settings,
    Award,
    Home,
    Users,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const UserProfile = ({ role = 'tenant' }) => {
    const router = useRouter();
    const { data: session, status, update } = useSession();
    const user = session?.user || null;

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        image: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalFavorites: 0,
        totalProperties: 0,
        totalUsers: 0,
        memberSince: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000';
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    const fetchUserStats = useCallback(async () => {
        try {
            const userId = user?.id || user?._id;
            if (!userId) return;

            let statsData = {
                totalBookings: 0,
                totalFavorites: 0,
                totalProperties: 0,
                totalUsers: 0,
                memberSince: user?.createdAt || new Date().toISOString()
            };

            // Admin এর জন্য সব ডেটা
            if (role === 'admin') {
                try {
                    const propsRes = await fetch(`${API_URL}/api/properties?page=1&limit=1&isAdmin=true`);
                    const propsData = await propsRes.json();
                    statsData.totalProperties = propsData.pagination?.totalItems || 0;
                } catch (e) {
                    console.error('Error fetching properties:', e);
                }

                try {
                    const usersRes = await fetch(`${API_URL}/api/user?page=1&limit=1`);
                    const usersData = await usersRes.json();
                    statsData.totalUsers = usersData.pagination?.totalItems || 0;
                } catch (e) {
                    console.error('Error fetching users:', e);
                }

                try {
                    const bookingsRes = await fetch(`${API_URL}/api/bookings?page=1&limit=1&isAdmin=true`);
                    const bookingsData = await bookingsRes.json();
                    statsData.totalBookings = bookingsData.totalItems || bookingsData.bookings?.length || 0;
                } catch (e) {
                    console.error('Error fetching bookings:', e);
                }
            }

            // Owner এর জন্য
            if (role === 'owner') {
                try {
                    const propsRes = await fetch(
                        `${API_URL}/api/properties/user/${userId}?page=1&limit=1`
                    );
                    const propsData = await propsRes.json();
                    statsData.totalProperties = propsData.pagination?.totalItems || 0;
                } catch (e) { }

                try {
                    const bookingsRes = await fetch(
                        `${API_URL}/api/bookings/owner/${userId}?page=1&limit=1`
                    );
                    const bookingsData = await bookingsRes.json();
                    statsData.totalBookings = bookingsData.pagination?.totalItems || 0;
                } catch (e) { }

                try {
                    const favRes = await fetch(
                        `${API_URL}/api/favorites/my-favorites?tenantId=${userId}&page=1&limit=1`
                    );
                    const favData = await favRes.json();
                    statsData.totalFavorites = favData.pagination?.totalItems || 0;
                } catch (e) { }
            }

            // Tenant এর জন্য
            if (role === 'tenant') {
                try {
                    const bookingsRes = await fetch(
                        `${API_URL}/api/bookings/my-bookings?tenantId=${userId}&page=1&limit=1`
                    );
                    const bookingsData = await bookingsRes.json();
                    statsData.totalBookings = bookingsData.pagination?.totalItems || 0;
                } catch (e) { }

                try {
                    const favRes = await fetch(
                        `${API_URL}/api/favorites/my-favorites?tenantId=${userId}&page=1&limit=1`
                    );
                    const favData = await favRes.json();
                    statsData.totalFavorites = favData.pagination?.totalItems || 0;
                } catch (e) { }
            }

            setStats(prev => {
                if (
                    prev.totalBookings === statsData.totalBookings &&
                    prev.totalFavorites === statsData.totalFavorites &&
                    prev.totalProperties === statsData.totalProperties &&
                    prev.totalUsers === statsData.totalUsers &&
                    prev.memberSince === statsData.memberSince
                ) {
                    return prev;
                }
                return statsData;
            });

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }, [user, role, API_URL]);

    // ✅ API থেকে ইউজার ডেটা fetch করুন
    useEffect(() => {
        if (!user) return;

        const userId = user?.id || user?._id;
        if (!userId) return;

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/${userId}`);
                const data = await response.json();

                if (data.success && data.user) {
                    const userData = data.user;
                    console.log('✅ Full user data from API:', {
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        location: userData.location,
                        bio: userData.bio,
                        image: userData.image
                    });

                    setProfileData({
                        name: userData.name || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        location: userData.location || '',
                        bio: userData.bio || '',
                        image: userData.image || '',
                        _file: null
                    });

                    setOriginalData({
                        name: userData.name || '',
                        email: userData.email || '',
                        phone: userData.phone || '',
                        location: userData.location || '',
                        bio: userData.bio || '',
                        image: userData.image || '',
                        _file: null
                    });
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
        fetchUserStats();

    }, [user, API_URL]);

    const uploadImageToImgBB = async (file) => {
        if (!IMGBB_API_KEY) {
            throw new Error('ImgBB API key is not configured');
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                return data.data.url;
            } else {
                throw new Error(data.error?.message || 'Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error(`Failed to upload image: ${error.message}`);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
        const isValidType = validTypes.includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024;

        if (!isValidType) {
            toast.error('Only JPEG, JPG, PNG, WEBP, and GIF are allowed.');
            return;
        }
        if (!isValidSize) {
            toast.error('Image size must be less than 5MB.');
            return;
        }

        const preview = URL.createObjectURL(file);
        setProfileData(prev => ({
            ...prev,
            image: preview,
            _file: file
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = () => {
        if (profileData.image && profileData.image.startsWith('blob:')) {
            URL.revokeObjectURL(profileData.image);
        }
        setProfileData(prev => ({
            ...prev,
            image: originalData.image || '',
            _file: null
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        let uploadedImageUrl = null;

        try {
            let finalImageUrl = profileData.image;

            if (profileData._file) {
                setUploading(true);
                setUploadProgress(0);
                try {
                    const progressInterval = setInterval(() => {
                        setUploadProgress(prev => Math.min(prev + 10, 90));
                    }, 200);

                    uploadedImageUrl = await uploadImageToImgBB(profileData._file);
                    clearInterval(progressInterval);
                    setUploadProgress(100);

                    console.log('✅ Image uploaded successfully:', uploadedImageUrl);
                    finalImageUrl = uploadedImageUrl;

                } catch (uploadError) {
                    toast.error(`Image upload failed: ${uploadError.message}`);
                    setUploading(false);
                    setLoading(false);
                    return;
                }
                setUploading(false);
            }

            const userId = user?.id || user?._id;
            if (!userId) {
                toast.error('User ID not found. Please login again.');
                setLoading(false);
                return;
            }

            const updateData = {
                name: profileData.name,
                phone: profileData.phone || '',
                location: profileData.location || '',
                bio: profileData.bio || '',
                image: finalImageUrl || ''
            };

            console.log('📤 Sending update data:', updateData);

            const response = await fetch(`${API_URL}/api/user/profile/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            console.log('📥 Response:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            const updatedUser = data.user;
            const updatedImage = updatedUser?.image || uploadedImageUrl || finalImageUrl;

            // ✅ সব ফিল্ড আপডেট করুন
            setProfileData(prev => ({
                ...prev,
                name: updatedUser?.name || prev.name,
                email: updatedUser?.email || prev.email,
                phone: updatedUser?.phone || prev.phone,
                location: updatedUser?.location || prev.location,
                bio: updatedUser?.bio || prev.bio,
                image: updatedImage,
                _file: null
            }));

            setOriginalData(prev => ({
                ...prev,
                name: updatedUser?.name || prev.name,
                email: updatedUser?.email || prev.email,
                phone: updatedUser?.phone || prev.phone,
                location: updatedUser?.location || prev.location,
                bio: updatedUser?.bio || prev.bio,
                image: updatedImage,
                _file: null
            }));

            // ✅ সেশন আপডেট করুন
            try {
                if (update && typeof update === 'function') {
                    await update({
                        user: {
                            ...session.user,
                            name: updatedUser?.name || profileData.name,
                            email: updatedUser?.email || profileData.email,
                            phone: updatedUser?.phone || profileData.phone,
                            location: updatedUser?.location || profileData.location,
                            bio: updatedUser?.bio || profileData.bio,
                            image: updatedImage
                        }
                    });
                    console.log('✅ Session updated successfully');
                }
            } catch (sessionError) {
                console.error('❌ Failed to update session:', sessionError);
            }

            // Refresh stats
            await fetchUserStats();

            toast.success('✅ Profile updated successfully!');
            setIsEditing(false);

        } catch (error) {
            console.error('❌ Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const handleCancelEdit = () => {
        if (profileData.image && profileData.image.startsWith('blob:')) {
            URL.revokeObjectURL(profileData.image);
        }
        setProfileData(originalData);
        setIsEditing(false);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleBadgeColor = () => {
        const colors = {
            admin: 'bg-purple-100 text-purple-700',
            owner: 'bg-blue-100 text-blue-700',
            tenant: 'bg-green-100 text-green-700'
        };
        return colors[role] || colors.tenant;
    };

    const getStatsConfig = () => {
        const configs = {
            admin: [
                { icon: <Building2 className="w-5 h-5" />, label: 'Properties', value: stats.totalProperties ?? 0 },
                { icon: <Users className="w-5 h-5" />, label: 'Users', value: stats.totalUsers ?? 0 },
                { icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings', value: stats.totalBookings ?? 0 }
            ],
            owner: [
                { icon: <Home className="w-5 h-5" />, label: 'Properties', value: stats.totalProperties ?? 0 },
                { icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings', value: stats.totalBookings ?? 0 },
                { icon: <Heart className="w-5 h-5" />, label: 'Favorites', value: stats.totalFavorites ?? 0 }
            ],
            tenant: [
                { icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings', value: stats.totalBookings ?? 0 },
                { icon: <Heart className="w-5 h-5" />, label: 'Favorites', value: stats.totalFavorites ?? 0 },
                { icon: <Award className="w-5 h-5" />, label: 'Rating', value: '4.8' }
            ]
        };
        return configs[role] || configs.tenant;
    };

    const getQuickActions = () => {
        const actions = {
            admin: [
                { icon: <Building2 className="w-4 h-4" />, label: 'All Properties', href: '/dashboard/admin/all-properties' },
                { icon: <Users className="w-4 h-4" />, label: 'All Users', href: '/dashboard/admin/all-users' },
                { icon: <CalendarIcon className="w-4 h-4" />, label: 'All Bookings', href: '/dashboard/admin/all-bookings' },
                { icon: <Settings className="w-4 h-4" />, label: 'Dashboard', href: '/dashboard/admin' }
            ],
            owner: [
                { icon: <Building2 className="w-4 h-4" />, label: 'My Properties', href: '/dashboard/owner/my-properties' },
                { icon: <CalendarIcon className="w-4 h-4" />, label: 'Bookings', href: '/dashboard/owner/booking-requests' },
                { icon: <Heart className="w-4 h-4" />, label: 'Favorites', href: '/dashboard/tenant/favorites' },
                { icon: <Settings className="w-4 h-4" />, label: 'Dashboard', href: '/dashboard/owner' }
            ],
            tenant: [
                { icon: <CalendarIcon className="w-4 h-4" />, label: 'My Bookings', href: '/dashboard/tenant/my-bookings' },
                { icon: <Heart className="w-4 h-4" />, label: 'Favorites', href: '/dashboard/tenant/favorites' },
                { icon: <Building2 className="w-4 h-4" />, label: 'Browse Properties', href: '/all-properties' },
                { icon: <Settings className="w-4 h-4" />, label: 'Dashboard', href: '/dashboard/tenant' }
            ]
        };
        return actions[role] || actions.tenant;
    };

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
                <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <div className="text-6xl mb-4">🔒</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Please Login</h2>
                    <p className="text-gray-600 dark:text-gray-400">You need to be logged in to view your profile.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    if (user.role?.toLowerCase() !== role) {
        return <AccessDenied role={role} />;
    }

    const statsConfig = getStatsConfig();
    const quickActions = getQuickActions();

    return (
        <div className="w-full bg-gray-50 dark:bg-gray-950 py-8">
            <div className="w-full px-4 md:px-6">

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
                                {role} Profile
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your personal information</p>
                        </div>
                        <div className="flex gap-3">
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                                        disabled={loading || uploading}
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading || uploading}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                                    >
                                        {(loading || uploading) ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4" />
                                        )}
                                        {uploading ? 'Uploading...' : loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden"
                >
                    <div className="h-32 bg-gradient-to-r from-emerald-500 to-emerald-700 relative">
                        <div className="absolute -bottom-12 left-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-white dark:bg-gray-900 overflow-hidden">
                                    {profileData.image ? (
                                        <img
                                            src={profileData.image}
                                            alt={profileData.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                console.error('Image load error:', profileData.image);
                                                e.target.src = '';
                                                e.target.alt = 'No image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                            <User className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    )}
                                </div>
                                {isEditing && (
                                    <>
                                        <label className="absolute bottom-0 right-0 bg-emerald-600 rounded-full p-1.5 cursor-pointer hover:bg-emerald-700 transition shadow-lg">
                                            <Camera className="w-4 h-4 text-white" />
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageSelect}
                                                disabled={uploading}
                                            />
                                        </label>
                                        {profileData.image && profileData.image.startsWith('blob:') && (
                                            <button
                                                onClick={handleRemoveImage}
                                                className="absolute -top-1 -right-1 bg-red-500 rounded-full p-1 hover:bg-red-600 transition shadow-lg"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        )}
                                    </>
                                )}
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                                        <div className="text-center">
                                            <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
                                            <p className="text-white text-xs mt-1">{Math.round(uploadProgress)}%</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-16 px-6 pb-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                            <div className="flex-1">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={profileData.name || ''}
                                        onChange={handleInputChange}
                                        className="text-2xl font-bold text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 w-full max-w-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Your name"
                                        disabled={loading}
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profileData.name}</h2>
                                )}
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getRoleBadgeColor()}`}>
                                        <Shield className="w-3 h-3" />
                                        {role}
                                    </span>
                                    {user?.emailVerified && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                                            <CheckCircle className="w-3 h-3" />
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 md:mt-0 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>Joined {formatDate(stats.memberSince)}</span>
                            </div>
                        </div>

                        {uploading && (
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Uploading image... {Math.round(uploadProgress)}%</p>
                            </div>
                        )}

                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                            {statsConfig.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
                                        {stat.icon}
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5 text-emerald-600" />
                            Contact Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={profileData.email || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="your@email.com"
                                        disabled
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        {profileData.email}
                                    </p>
                                )}
                                {isEditing && (
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Email cannot be changed</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={profileData.phone || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="+1 (555) 000-0000"
                                        disabled={loading}
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        {profileData.phone || 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="location"
                                        value={profileData.location || ''}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="City, Country"
                                        disabled={loading}
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                        {profileData.location || 'Not provided'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-600" />
                            About Me
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    value={profileData.bio || ''}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                                    placeholder="Tell us about yourself..."
                                    disabled={loading}
                                />
                            ) : (
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {profileData.bio || 'No bio added yet. Click edit to add one!'}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <Building2 className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Properties Viewed</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">24</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
                                    <Heart className="w-5 h-5 text-red-600 mx-auto mb-1" />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Favorites</p>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{stats.totalFavorites}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6"
                >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        Quick Actions
                    </h3>
                    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(quickActions.length, 4)} gap-3`}>
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                            >
                                {action.icon}
                                {action.label}
                            </Link>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>
    );
};

export default UserProfile;