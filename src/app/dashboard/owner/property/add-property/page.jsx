'use client';

import { createProperty } from '@/lib/actions/properties';
import { useSession } from '@/lib/auth-client';
import React, { useState, useRef, useEffect } from 'react';


export default function AddPropertyForm() {
    const propertyTypes = ["Apartment", "House", "Villa", "Commercial Space"];
    const rentTypes = ["Monthly", "Weekly", "Daily"];
    const amenitiesList = [
        "Free Wi-Fi", "Swimming Pool", "Gym", "Parking Space",
        "24/7 Security", "Air Conditioning", "Power Backup", "Elevator"
    ];

    // Get user session
    const { data: session, status } = useSession();
    const user = session?.user;

    // States for Form Fields
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [price, setPrice] = useState("");
    const [rentType, setRentType] = useState("monthly");
    const [bedrooms, setBedrooms] = useState("");
    const [bathrooms, setBathrooms] = useState("");
    const [size, setSize] = useState("");
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [extraFeatures, setExtraFeatures] = useState(["Pet Friendly", "Garden Access"]);
    const [newFeature, setNewFeature] = useState("");

    // Image upload states
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    // Handle Amenities Checkbox
    const handleAmenityChange = (amenity) => {
        if (selectedAmenities.includes(amenity)) {
            setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
        } else {
            setSelectedAmenities([...selectedAmenities, amenity]);
        }
    };

    // Extra Features Add/Remove
    const handleAddFeature = (e) => {
        if (e) e.preventDefault();
        if (newFeature.trim() && !extraFeatures.includes(newFeature)) {
            setExtraFeatures([...extraFeatures, newFeature.trim()]);
            setNewFeature("");
        }
    };

    const handleRemoveFeature = (featureToRemove) => {
        setExtraFeatures(extraFeatures.filter(f => f !== featureToRemove));
    };

    // Image upload handlers
    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        if (selectedImages.length + files.length > 10) {
            alert('Maximum 10 images allowed');
            return;
        }

        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
            const isValidType = validTypes.includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024;

            if (!isValidType) {
                alert(`Invalid file type: ${file.name}. Only JPEG, JPG, PNG, WEBP, and GIF are allowed.`);
                return false;
            }
            if (!isValidSize) {
                alert(`File too large: ${file.name}. Maximum size is 5MB.`);
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
                    console.error('ImgBB upload failed:', data);
                    throw new Error(data.error?.message || 'Image upload failed');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                throw new Error(`Failed to upload image ${i + 1}: ${error.message}`);
            }
        }

        return uploadedUrls;
    };

    // Reset form
    const resetForm = () => {
        setTitle("");
        setDescription("");
        setLocation("");
        setPropertyType("");
        setPrice("");
        setRentType("monthly");
        setBedrooms("");
        setBathrooms("");
        setSize("");
        setSelectedAmenities([]);
        setExtraFeatures(["Pet Friendly", "Garden Access"]);
        setSelectedImages([]);
        setImagePreviews([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Check if user has permission to add property (Admin or Owner)
    const hasPermission = () => {
        if (!user) return false;
        const role = user.role?.toLowerCase();
        return role === 'admin' || role === 'owner';
    };

    // FORM SUBMIT HANDLER
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check permission again before submission
        if (!hasPermission()) {
            alert('You do not have permission to add properties. Only Admin and Owner roles can add properties.');
            return;
        }

        if (!title || !description || !location || !propertyType || !price || !bedrooms || !bathrooms || !size) {
            alert('Please fill in all required fields');
            return;
        }

        // Check if user is authenticated
        if (!user) {
            alert('Please login to add a property');
            return;
        }

        setIsSubmitting(true);
        setUploading(true);
        setUploadProgress(0);

        try {
            let imageUrls = [];

            if (selectedImages.length > 0) {
                imageUrls = await uploadImagesToImgBB(selectedImages);
                console.log('Images uploaded successfully:', imageUrls);
            }

            const propertyData = {
                title,
                description,
                location,
                propertyType,
                price: Number(price),
                rentType,
                specifications: {
                    bedrooms: Number(bedrooms),
                    bathrooms: Number(bathrooms),
                    size: size
                },
                amenities: selectedAmenities,
                extraFeatures: extraFeatures,
                images: imageUrls,
                status: "pending",
                ownerId: user.id || user._id || '',  // Store user ID at root level
                owner: {  // Keep this for display/denormalization
                    name: user.name || user.fullName || 'User',
                    email: user.email,
                    phone: user.phone || '',
                    role: user.role || 'owner'  // Include role in owner data
                },
                createdAt: new Date().toISOString()
            };

            console.log("Submitting Property Data:", propertyData);

            const result = await createProperty(propertyData);

            if (result.success) {
                alert('Property submitted successfully!');
                console.log('Server response:', result);
                resetForm();
            } else {
                throw new Error(result.message || 'Failed to submit property');
            }
        } catch (error) {
            console.error('Error submitting property:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setUploading(false);
            setUploadProgress(0);
            setIsSubmitting(false);
        }
    };

    // Show loading while session is loading
    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-400 mb-4">
                        Authentication Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Please login to add a new property.
                    </p>
                    <a
                        href="/login"
                        className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Login Now
                    </a>
                </div>
            </div>
        );
    }

    // Check if user has permission (Admin or Owner)
    if (!hasPermission()) {
        return (
            <div className="max-w-4xl mx-auto p-8 text-center">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8">
                    <div className="flex justify-center mb-4">
                        <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        You do not have permission to add properties. Only users with <strong>Admin</strong> or <strong>Owner</strong> roles can add properties.
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                        Your current role: <span className="font-semibold capitalize">{user?.role || 'User'}</span>
                    </p>
                    <a
                        href="/dashboard"
                        className="inline-block mt-4 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6 bg-gray-100 dark:bg-gray-900 rounded-2xl min-h-screen">

            {/* Header */}
            <div className="border-b border-gray-300 dark:border-gray-800 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">Add New Property</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fill out the details below to list your property on RentNest.</p>
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <span className="text-xs font-medium text-emerald-800 dark:text-emerald-400">
                        Role: {user?.role || 'Owner'} • You have permission to add properties
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* SECTION 1: Basic Information */}
                <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Basic Information</h2>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Property Title *</label>
                        <input
                            required
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g., Luxury 3BHK Apartment with Lake View"
                            className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Description *</label>
                        <textarea
                            required
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your property's best features..."
                            className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Property Type *</label>
                            <select
                                required
                                value={propertyType}
                                onChange={(e) => setPropertyType(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            >
                                <option value="">Select type</option>
                                {propertyTypes.map((type) => (
                                    <option key={type} value={type.toLowerCase()}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Location / Address *</label>
                            <input
                                required
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="e.g., Sector 11, Uttara, Dhaka"
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Pricing & Specifications */}
                <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
                    <h2 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider mb-2">Pricing & Specifications</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Rent Price (BDT) *</label>
                            <input
                                required
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="0"
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Rent Type *</label>
                            <select
                                required
                                value={rentType}
                                onChange={(e) => setRentType(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            >
                                {rentTypes.map((rent) => (
                                    <option key={rent} value={rent.toLowerCase()}>{rent}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Bedrooms *</label>
                            <input
                                required
                                type="number"
                                value={bedrooms}
                                onChange={(e) => setBedrooms(e.target.value)}
                                placeholder="e.g., 3"
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Bathrooms *</label>
                            <input
                                required
                                type="number"
                                value={bathrooms}
                                onChange={(e) => setBathrooms(e.target.value)}
                                placeholder="e.g., 2"
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Property Size *</label>
                            <input
                                required
                                type="text"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                placeholder="e.g., 1450 sqft"
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </div>

                {/* SECTION 3: Amenities & Media */}
                <div className="bg-white dark:bg-gray-950 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-5">

                    {/* Amenities */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">Amenities</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {amenitiesList.map((amenity) => (
                                <label key={amenity} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedAmenities.includes(amenity)}
                                        onChange={() => handleAmenityChange(amenity)}
                                        className="rounded border-gray-400 dark:border-gray-600 text-emerald-600 focus:ring-emerald-500 size-4 cursor-pointer"
                                        disabled={isSubmitting}
                                    />
                                    <span>{amenity}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Extra Features */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">Extra Features</label>
                        <div className="flex gap-2 max-w-md">
                            <input
                                type="text"
                                placeholder="Add feature (e.g., Gas Connection)"
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
                                className="px-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg border-2 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all text-sm"
                                disabled={isSubmitting}
                            >
                                Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2 pt-1">
                            {extraFeatures.map((feature) => (
                                <span
                                    key={feature}
                                    className="inline-flex items-center gap-1.5 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white text-xs font-medium px-2.5 py-1 rounded-md border border-gray-300 dark:border-gray-700"
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

                    {/* Image Upload Area */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 block">Property Images</label>

                        <div
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-xl p-6 text-center hover:border-emerald-600/50 dark:hover:border-emerald-400/30 transition-colors cursor-pointer bg-gray-50/50 dark:bg-gray-950/40 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex flex-col items-center gap-1">
                                <svg className="w-10 h-10 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                    {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG, WEBP or GIF (Max 10 images, 5MB each)
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    Uploading... {Math.round(uploadProgress)}%
                                </p>
                            </div>
                        )}

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                            disabled={isSubmitting}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 4: Owner Information - NOW DYNAMIC */}
                <div className="bg-gray-200/40 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1">Owner Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Owner Name</label>
                            <input
                                disabled
                                type="text"
                                value={user?.name || user?.fullName || 'User'}
                                className="w-full px-3.5 py-2 rounded-lg bg-gray-300/60 dark:bg-gray-800/60 text-gray-900 dark:text-white text-sm border border-transparent cursor-not-allowed font-medium"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Owner Email</label>
                            <input
                                disabled
                                type="email"
                                value={user?.email || ''}
                                className="w-full px-3.5 py-2 rounded-lg bg-gray-300/60 dark:bg-gray-800/60 text-gray-900 dark:text-white text-sm border border-transparent cursor-not-allowed font-medium"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Role</label>
                            <input
                                disabled
                                type="text"
                                value={user?.role || 'Owner'}
                                className="w-full px-3.5 py-2 rounded-lg bg-gray-300/60 dark:bg-gray-800/60 text-gray-900 dark:text-white text-sm border border-transparent cursor-not-allowed font-medium capitalize"
                            />
                        </div>
                        {user?.phone && (
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Phone Number</label>
                                <input
                                    disabled
                                    type="text"
                                    value={user?.phone || ''}
                                    className="w-full px-3.5 py-2 rounded-lg bg-gray-300/60 dark:bg-gray-800/60 text-gray-900 dark:text-white text-sm border border-transparent cursor-not-allowed font-medium"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        type="button"
                        onClick={resetForm}
                        className="px-5 py-2.5 text-sm font-bold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all active:scale-95 border border-gray-400 dark:border-gray-600"
                        disabled={isSubmitting}
                    >
                        Discard Draft
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`px-6 py-2.5 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 border border-emerald-800 dark:border-emerald-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {uploading ? 'Uploading Images...' : 'Submitting...'}
                            </span>
                        ) : 'Submit Property'}
                    </button>
                </div>

            </form>
        </div>
    );
}