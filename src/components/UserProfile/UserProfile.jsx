// components/UserProfile/UserProfile.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    Loader2,
    Building2,
    Heart,
    Calendar as CalendarIcon,
    Settings,
    Award,
    Home,
    LogOut,
    Users,
    CloudUpload,
    Image as ImageIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const UserProfile = ({ role = 'tenant' }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
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
        photo: ''
    });
    const [originalData, setOriginalData] = useState({});
    const [stats, setStats] = useState({
        totalBookings: 0,
        totalFavorites: 0,
        totalProperties: 0,
        memberSince: ''
    });

    const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    // ✅ Role-based dashboard links
    const dashboardLinks = {
        admin: {
            home: '/dashboard/admin',
            bookings: '/dashboard/admin/all-bookings',
            properties: '/dashboard/admin/all-properties',
            users: '/dashboard/admin/all-users',
            label: 'Admin Dashboard'
        },
        owner: {
            home: '/dashboard/owner',
            bookings: '/dashboard/owner/bookings',
            properties: '/dashboard/owner/my-properties',
            addProperty: '/dashboard/owner/add-property',
            label: 'Owner Dashboard'
        },
        tenant: {
            home: '/dashboard/tenant',
            bookings: '/dashboard/tenant/my-bookings',
            favorites: '/dashboard/tenant/favorites',
            label: 'Tenant Dashboard'
        }
    };

    const links = dashboardLinks[role] || dashboardLinks.tenant;

    // ✅ Upload image to ImgBB
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

    // ✅ Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation
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

        // Create preview
        const preview = URL.createObjectURL(file);
        setProfileData(prev => ({
            ...prev,
            photo: preview,
            _file: file
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // ✅ Remove image
    const handleRemoveImage = () => {
        if (profileData.photo && profileData.photo.startsWith('blob:')) {
            URL.revokeObjectURL(profileData.photo);
        }
        setProfileData(prev => ({
            ...prev,
            photo: originalData.photo || '',
            _file: null
        }));
    };

    // ✅ Load user data
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                photo: user.image || user.photo || '',
                _file: null
            });
            setOriginalData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                photo: user.image || user.photo || '',
                _file: null
            });
            fetchUserStats();
        }
    }, [user]);

    // ✅ Fetch user stats based on role
    const fetchUserStats = async () => {
        try {
            const userId = user?.id || user?._id;
            let statsData = {
                totalBookings: 0,
                totalFavorites: 0,
                totalProperties: 0,
                memberSince: user?.createdAt || new Date().toISOString()
            };

            // Fetch bookings count
            try {
                const bookingsRes = await fetch(
                    `${API_URL}/api/bookings/my-bookings?tenantId=${userId}&page=1&limit=1`
                );
                const bookingsData = await bookingsRes.json();
                statsData.totalBookings = bookingsData.pagination?.totalItems || 0;
            } catch (e) { }

            // Fetch favorites count (Tenant only)
            if (role === 'tenant') {
                try {
                    const favRes = await fetch(
                        `${API_URL}/api/favorites/my-favorites?tenantId=${userId}&page=1&limit=1`
                    );
                    const favData = await favRes.json();
                    statsData.totalFavorites = favData.favorites?.length || 0;
                } catch (e) { }
            }

            // Fetch properties count (Owner only)
            if (role === 'owner') {
                try {
                    const propsRes = await fetch(
                        `${API_URL}/api/properties/user/${userId}`
                    );
                    const propsData = await propsRes.json();
                    statsData.totalProperties = propsData.properties?.length || 0;
                } catch (e) { }
            }

            setStats(statsData);

        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // ✅ Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    // ✅ Handle save profile with image upload
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            let finalPhotoUrl = profileData.photo;

            // ✅ Upload image if a new file is selected
            if (profileData._file) {
                setUploading(true);
                setUploadProgress(0);
                try {
                    finalPhotoUrl = await uploadImageToImgBB(profileData._file);
                    setUploadProgress(100);
                } catch (uploadError) {
                    toast.error(`Image upload failed: ${uploadError.message}`);
                    setUploading(false);
                    setLoading(false);
                    return;
                }
                setUploading(false);
            }

            const userId = user?.id || user?._id;
            const updateData = {
                name: profileData.name,
                phone: profileData.phone,
                location: profileData.location,
                bio: profileData.bio,
                photo: finalPhotoUrl
            };

            const response = await fetch(`${API_URL}/api/user/profile/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile');
            }

            // ✅ Update local state with the uploaded image URL
            setProfileData(prev => ({
                ...prev,
                photo: finalPhotoUrl,
                _file: null
            }));
            setOriginalData(prev => ({
                ...prev,
                photo: finalPhotoUrl
            }));

            toast.success('Profile updated successfully!');
            setIsEditing(false);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || 'Failed to update profile');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    // ✅ Handle cancel edit
    const handleCancelEdit = () => {
        setProfileData(originalData);
        setIsEditing(false);
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

    // ✅ Get role-specific badge color
    const getRoleBadgeColor = () => {
        const colors = {
            admin: 'bg-purple-100 text-purple-700',
            owner: 'bg-blue-100 text-blue-700',
            tenant: 'bg-green-100 text-green-700'
        };
        return colors[role] || colors.tenant;
    };

    // ✅ Get role-specific stats
    const getStatsConfig = () => {
        const configs = {
            admin: [
                { icon: <Building2 className="w-5 h-5" />, label: 'Properties', value: stats.totalProperties || 'N/A' },
                { icon: <Users className="w-5 h-5" />, label: 'Users', value: 'N/A' },
                { icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings', value: stats.totalBookings }
            ],
            owner: [
                { icon: <Home className="w-5 h-5" />, label: 'Properties', value: stats.totalProperties || 0 },
                { icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings', value: stats.totalBookings },
                { icon: <Heart className="w-5 h-5" />, label: 'Favorites', value: stats.totalFavorites }
            ],
            tenant: [
                { icon: <CalendarIcon className="w-5 h-5" />, label: 'Bookings', value: stats.totalBookings },
                { icon: <Heart className="w-5 h-5" />, label: 'Favorites', value: stats.totalFavorites },
                { icon: <Award className="w-5 h-5" />, label: 'Rating', value: '4.8' }
            ]
        };
        return configs[role] || configs.tenant;
    };

    // ✅ Get quick actions based on role
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
                { icon: <CalendarIcon className="w-4 h-4" />, label: 'Bookings', href: '/dashboard/owner/bookings' },
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

    const statsConfig = getStatsConfig();
    const quickActions = getQuickActions();

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* ✅ Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 capitalize">
                                {role} Profile
                            </h1>
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
                                        disabled={loading || uploading}
                                    >
                                        <X className="w-4 h-4" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={loading || uploading}
                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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
                                    <>
                                        <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition shadow-lg">
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
                                        {profileData.photo && profileData.photo.startsWith('blob:') && (
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
                                        disabled={loading}
                                    />
                                ) : (
                                    <h2 className="text-2xl font-bold text-gray-900">{profileData.name}</h2>
                                )}
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getRoleBadgeColor()}`}>
                                        <Shield className="w-3 h-3" />
                                        {role}
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

                        {/* Upload Progress Bar */}
                        {uploading && (
                            <div className="mt-4">
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Uploading image... {Math.round(uploadProgress)}%</p>
                            </div>
                        )}

                        {/* Stats Row - Role based */}
                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                            {statsConfig.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                                        {stat.icon}
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
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
                                        disabled
                                    />
                                ) : (
                                    <p className="text-gray-900 flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        {profileData.email}
                                    </p>
                                )}
                                {isEditing && (
                                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                    disabled={loading}
                                />
                            ) : (
                                <p className="text-gray-700 leading-relaxed">
                                    {profileData.bio || 'No bio added yet. Click edit to add one!'}
                                </p>
                            )}
                        </div>

                        {/* Quick Stats - Role specific */}
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

                {/* ✅ Quick Actions - Role based */}
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
                    <div className={`grid grid-cols-2 md:grid-cols-${Math.min(quickActions.length, 4)} gap-3`}>
                        {quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.href}
                                className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition text-gray-700 hover:text-blue-700"
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