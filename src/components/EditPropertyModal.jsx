// components/EditPropertyModal.jsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSave, FaPlus, FaTrash, FaImage, FaBed, FaBath, FaRulerCombined, FaTag, FaHome, FaCheck, FaSpinner } from 'react-icons/fa';
import { MdVerified, MdPending, MdCancel, MdWarning } from 'react-icons/md';
import toast from 'react-hot-toast';

const EditPropertyModal = ({ isOpen, onClose, property, onUpdate }) => {
    // Form States
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        propertyType: '',
        price: '',
        rentType: 'monthly',
        specifications: {
            bedrooms: '',
            bathrooms: '',
            size: ''
        },
        amenities: [],
        extraFeatures: [],
        images: []
    });
    const [newAmenity, setNewAmenity] = useState('');
    const [newFeature, setNewFeature] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const propertyTypes = ['Apartment', 'House', 'Villa', 'Condo', 'Townhouse', 'Studio', 'Land'];
    const rentTypes = ['Monthly', 'Weekly', 'Daily'];
    const amenitiesList = [
        'Free Wi-Fi', 'Swimming Pool', 'Gym', 'Parking Space',
        '24/7 Security', 'Air Conditioning', 'Power Backup', 'Elevator'
    ];

    // Load property data when modal opens
    useEffect(() => {
        if (property && isOpen) {
            setFormData({
                title: property.title || '',
                description: property.description || '',
                location: property.location || '',
                propertyType: property.propertyType || '',
                price: property.price || '',
                rentType: property.rentType || 'monthly',
                specifications: {
                    bedrooms: property.specifications?.bedrooms || '',
                    bathrooms: property.specifications?.bathrooms || '',
                    size: property.specifications?.size || ''
                },
                amenities: property.amenities || [],
                extraFeatures: property.extraFeatures || [],
                images: property.images || []
            });
            // Reset image upload states
            setSelectedImages([]);
            setImagePreviews([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [property, isOpen]);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle specifications change
    const handleSpecChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            specifications: {
                ...prev.specifications,
                [name]: value
            }
        }));
    };

    // Amenities
    const handleAmenityChange = (amenity) => {
        setFormData(prev => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter(item => item !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    // Add extra feature
    const handleAddFeature = (e) => {
        if (e) e.preventDefault();
        if (newFeature.trim() && !formData.extraFeatures.includes(newFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                extraFeatures: [...prev.extraFeatures, newFeature.trim()]
            }));
            setNewFeature('');
        }
    };

    const handleRemoveFeature = (feature) => {
        setFormData(prev => ({
            ...prev,
            extraFeatures: prev.extraFeatures.filter(f => f !== feature)
        }));
    };

    // Image handlers
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (selectedImages.length + files.length > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            const isValidType = validTypes.includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;

            if (!isValidType) {
                toast.error(`Invalid file type: ${file.name}. Only JPEG, JPG, PNG, WEBP, and GIF are allowed.`);
                return false;
            }
            if (!isValidSize) {
                toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
        setSelectedImages([...selectedImages, ...validFiles]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(imagePreviews[index]);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        const newImages = selectedImages.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
        setSelectedImages(newImages);
    };

    const handleRemoveExistingImage = (index) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = Array.from(e.dataTransfer.files);
        if (files.length === 0) return;
        const mockEvent = { target: { files: files } };
        handleImageSelect(mockEvent);
    };

    // Upload images to ImgBB
    const uploadImagesToImgBB = async (files) => {
        const uploadedUrls = [];
        const API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

        if (!API_KEY) {
            throw new Error('ImgBB API key is not configured');
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    uploadedUrls.push(data.data.url);
                    setUploadProgress(((i + 1) / files.length) * 100);
                } else {
                    throw new Error(data.error?.message || 'Image upload failed');
                }
            } catch (error) {
                throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
            }
        }

        return uploadedUrls;
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.location) newErrors.location = 'Location is required';
        if (!formData.price) newErrors.price = 'Price is required';
        if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
        if (!formData.rentType) newErrors.rentType = 'Rent type is required';
        if (!formData.specifications.bedrooms) newErrors.bedrooms = 'Bedrooms is required';
        if (!formData.specifications.bathrooms) newErrors.bathrooms = 'Bathrooms is required';
        if (!formData.specifications.size) newErrors.size = 'Size is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setUploading(true);
        setUploadProgress(0);

        try {
            let allImages = [...formData.images];

            // Upload new images if any
            if (selectedImages.length > 0) {
                const newImageUrls = await uploadImagesToImgBB(selectedImages);
                allImages = [...allImages, ...newImageUrls];
            }

            const updateData = {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                propertyType: formData.propertyType,
                price: parseFloat(formData.price),
                rentType: formData.rentType,
                specifications: {
                    bedrooms: parseInt(formData.specifications.bedrooms) || 0,
                    bathrooms: parseInt(formData.specifications.bathrooms) || 0,
                    size: formData.specifications.size || 'N/A'
                },
                amenities: formData.amenities,
                extraFeatures: formData.extraFeatures,
                images: allImages,
                status: property?.status === 'rejected' ? 'pending' : property?.status || 'pending',
                updatedAt: new Date().toISOString()
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/properties/${property._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update property');
            }

            toast.success('Property updated successfully!');
            if (property?.status === 'rejected') {
                toast.success('Property resubmitted for review!');
            }

            if (onUpdate) {
                onUpdate(data.property || updateData);
            }

            onClose();

        } catch (error) {
            console.error('Error updating property:', error);
            toast.error(error.message || 'Failed to update property');
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setIsSubmitting(false);
        }
    };

    // Get status info
    const getStatusInfo = () => {
        const status = property?.status?.toLowerCase();
        if (status === 'rejected') {
            return {
                icon: <MdCancel className="w-5 h-5 text-red-500" />,
                bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
                text: 'text-red-700 dark:text-red-400',
                title: 'Property Rejected',
                message: `Reason: ${property?.rejectionReason || 'No reason provided'}`,
                action: 'Resubmit for Review'
            };
        } else if (status === 'pending') {
            return {
                icon: <MdPending className="w-5 h-5 text-yellow-500" />,
                bg: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
                text: 'text-yellow-700 dark:text-yellow-400',
                title: 'Pending Approval',
                message: 'Changes will be reviewed again.',
                action: 'Update Property'
            };
        } else if (status === 'approved') {
            return {
                icon: <MdVerified className="w-5 h-5 text-green-500" />,
                bg: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
                text: 'text-green-700 dark:text-green-400',
                title: 'Property Approved',
                message: 'Changes may require re-review.',
                action: 'Update Property'
            };
        }
        return {
            icon: <FaHome className="w-5 h-5 text-blue-500" />,
            bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
            text: 'text-blue-700 dark:text-blue-400',
            title: 'Edit Property',
            message: 'Make your changes and save.',
            action: 'Save Changes'
        };
    };

    const statusInfo = getStatusInfo();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
                <div className="flex items-center justify-center min-h-screen px-4 py-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white dark:bg-gray-950 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-700 dark:to-emerald-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaHome className="w-5 h-5 text-white" />
                                <h2 className="text-xl font-bold text-white">Edit Property</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white/80 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                <FaTimes className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Status Banner */}
                        <div className={`mx-6 mt-4 border rounded-lg p-3 ${statusInfo.bg}`}>
                            <div className="flex items-start gap-2">
                                {statusInfo.icon}
                                <div>
                                    <p className={`text-sm font-semibold ${statusInfo.text}`}>
                                        {statusInfo.title}
                                    </p>
                                    <p className={`text-xs ${statusInfo.text} opacity-80`}>
                                        {statusInfo.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] space-y-4">
                            {/* Basic Information */}
                            <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
                                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Basic Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Property Title *</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            placeholder="e.g. Luxury 3BHK Apartment"
                                            disabled={isSubmitting}
                                        />
                                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Location *</label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.location ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            placeholder="e.g. Gulshan, Dhaka"
                                            disabled={isSubmitting}
                                        />
                                        {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Property Type *</label>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.propertyType ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            disabled={isSubmitting}
                                        >
                                            <option value="">Select type</option>
                                            {propertyTypes.map(type => (
                                                <option key={type} value={type.toLowerCase()}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Rent Type *</label>
                                        <select
                                            name="rentType"
                                            value={formData.rentType}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.rentType ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            disabled={isSubmitting}
                                        >
                                            {rentTypes.map(type => (
                                                <option key={type} value={type.toLowerCase()}>{type}</option>
                                            ))}
                                        </select>
                                        {errors.rentType && <p className="text-red-500 text-xs mt-1">{errors.rentType}</p>}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Price (USD) *</label>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.price ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            placeholder="e.g. 1500"
                                            disabled={isSubmitting}
                                            min="0"
                                        />
                                        {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-0.5">
                                    <label className="text-xs font-semibold text-gray-800 dark:text-gray-200">Description *</label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className={`w-full px-3 py-2 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white resize-none`}
                                        placeholder="Describe your property in detail..."
                                        disabled={isSubmitting}
                                    />
                                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                </div>
                            </div>

                            {/* Specifications */}
                            <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
                                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Specifications</h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                            <FaBed className="text-emerald-500" /> Bedrooms *
                                        </label>
                                        <input
                                            type="number"
                                            name="bedrooms"
                                            value={formData.specifications.bedrooms}
                                            onChange={handleSpecChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.bedrooms ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            placeholder="e.g. 3"
                                            disabled={isSubmitting}
                                            min="0"
                                        />
                                        {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                            <FaBath className="text-emerald-500" /> Bathrooms *
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.specifications.bathrooms}
                                            onChange={handleSpecChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.bathrooms ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            placeholder="e.g. 2"
                                            disabled={isSubmitting}
                                            min="0"
                                        />
                                        {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
                                    </div>

                                    <div className="flex flex-col gap-0.5">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                            <FaRulerCombined className="text-emerald-500" /> Size (sqft) *
                                        </label>
                                        <input
                                            type="text"
                                            name="size"
                                            value={formData.specifications.size}
                                            onChange={handleSpecChange}
                                            className={`w-full px-3 py-2 rounded-lg border ${errors.size ? 'border-red-500' : 'border-gray-400 dark:border-gray-700'} bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white`}
                                            placeholder="e.g. 1450"
                                            disabled={isSubmitting}
                                        />
                                        {errors.size && <p className="text-red-500 text-xs mt-1">{errors.size}</p>}
                                    </div>
                                </div>
                            </div>

                            {/* Amenities & Features */}
                            <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
                                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Amenities & Features</h3>

                                {/* Amenities */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">Amenities</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                        {amenitiesList.map((amenity) => (
                                            <label key={amenity} className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={() => handleAmenityChange(amenity)}
                                                    className="rounded border-gray-400 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 size-3.5 cursor-pointer"
                                                    disabled={isSubmitting}
                                                />
                                                <span>{amenity}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Extra Features */}
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">Extra Features</label>
                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            type="text"
                                            placeholder="Add feature (e.g., Pet Friendly)"
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleAddFeature();
                                                }
                                            }}
                                            className="w-full px-3 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFeature}
                                            className="px-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg border-2 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all text-sm"
                                            disabled={isSubmitting}
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {formData.extraFeatures.map((feature) => (
                                            <span
                                                key={feature}
                                                className="inline-flex items-center gap-1 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium px-2 py-1 rounded border border-gray-300 dark:border-gray-700"
                                            >
                                                {feature}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveFeature(feature)}
                                                    className="text-gray-500 hover:text-red-500 font-bold ml-1"
                                                    disabled={isSubmitting}
                                                >
                                                    &times;
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Images */}
                            <div className="bg-white dark:bg-gray-950 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-800 space-y-3">
                                <h3 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Property Images</h3>

                                {/* Existing Images */}
                                {formData.images.length > 0 && (
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-800 dark:text-gray-200 block">Existing Images</label>
                                        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                            {formData.images.map((img, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={img}
                                                        alt={`Property ${index + 1}`}
                                                        className="w-full h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/200x200/CCCCCC/FFFFFF?text=No+Image';
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveExistingImage(index)}
                                                        className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        disabled={isSubmitting}
                                                    >
                                                        <FaTrash className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Upload New Images */}
                                <div
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-lg p-4 text-center hover:border-emerald-600/50 dark:hover:border-emerald-400/30 transition-colors cursor-pointer bg-gray-50/50 dark:bg-gray-950/40 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="flex flex-col items-center gap-1">
                                        <FaImage className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                                        <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                                            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                        </span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                            PNG, JPG, WEBP or GIF (Max 10 images, 5MB each)
                                        </span>
                                        <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                            {selectedImages.length}/10 images selected
                                        </span>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                        disabled={isSubmitting}
                                    />
                                </div>

                                {uploading && uploadProgress > 0 && (
                                    <div className="space-y-1">
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                                            Uploading... {Math.round(uploadProgress)}%
                                        </p>
                                    </div>
                                )}

                                {/* New Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(index)}
                                                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    disabled={isSubmitting}
                                                >
                                                    <FaTrash className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium text-sm"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <FaSpinner className="w-4 h-4 animate-spin" />
                                            {uploading ? 'Uploading...' : 'Saving...'}
                                        </>
                                    ) : (
                                        <>
                                            <FaSave className="w-4 h-4" />
                                            {property?.status === 'rejected' ? 'Resubmit' : 'Save Changes'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
};

export default EditPropertyModal;