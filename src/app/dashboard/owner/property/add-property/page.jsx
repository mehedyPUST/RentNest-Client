'use client';

import React, { useState } from 'react';

export default function AddPropertyForm() {
    const propertyTypes = ["Apartment", "House", "Villa", "Commercial Space"];
    const rentTypes = ["Monthly", "Weekly", "Daily"];
    const amenitiesList = [
        "Free Wi-Fi", "Swimming Pool", "Gym", "Parking Space",
        "24/7 Security", "Air Conditioning", "Power Backup", "Elevator"
    ];

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

    // FORM SUBMIT HANDLER
    const handleSubmit = async (e) => {
        e.preventDefault();

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
            status: "pending",
            owner: {
                name: "Anisur Rahman",
                email: "anis@company.com"
            },
            createdAt: new Date().toISOString()
        };

        console.log("Submitting Property Data to API:", propertyData);
        alert("Property submitted successfully!");
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-4 md:p-6 bg-gray-100 dark:bg-gray-900 rounded-2xl min-h-screen">

            {/* Header */}
            <div className="border-b border-gray-300 dark:border-gray-800 pb-5">
                <h1 className="text-2xl font-bold tracking-tight text-gray-950 dark:text-white">Add New Property</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Fill out the details below to list your property on RentNest.</p>
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
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-gray-800 dark:text-gray-200">Rent Type *</label>
                            <select
                                required
                                value={rentType}
                                onChange={(e) => setRentType(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-lg border border-gray-400 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 text-gray-900 dark:text-white"
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
                            />
                            {/* VISIBLE TAG ADD BUTTON */}
                            <button
                                type="button"
                                onClick={handleAddFeature}
                                className="px-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-lg border-2 border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 active:scale-95 transition-all text-sm"
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
                        <div className="border-2 border-dashed border-gray-400 dark:border-gray-700 rounded-xl p-6 text-center hover:border-emerald-600/50 dark:hover:border-emerald-400/30 transition-colors cursor-pointer bg-gray-50/50 dark:bg-gray-950/40">
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Click to upload or drag and drop</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or WEBP (Max 10 images)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 4: Owner Information */}
                <div className="bg-gray-200/40 dark:bg-gray-900/40 border border-gray-300 dark:border-gray-800 rounded-xl p-6 space-y-4">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-1">Owner Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Owner Name</label>
                            <input
                                disabled
                                type="text"
                                defaultValue="Anisur Rahman"
                                className="w-full px-3.5 py-2 rounded-lg bg-gray-300/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 text-sm border border-transparent cursor-not-allowed font-medium"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Owner Email</label>
                            <input
                                disabled
                                type="email"
                                defaultValue="anis@company.com"
                                className="w-full px-3.5 py-2 rounded-lg bg-gray-300/60 dark:bg-gray-800/60 text-gray-600 dark:text-gray-400 text-sm border border-transparent cursor-not-allowed font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* HIGH VISIBILITY ACTION BUTTONS */}
                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        type="button"
                        className="px-5 py-2.5 text-sm font-bold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg shadow-sm transition-all active:scale-95 border border-gray-400 dark:border-gray-600"
                    >
                        Discard Draft
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2.5 text-sm font-bold text-green-500 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 border border-emerald-800 dark:border-emerald-500"
                    >
                        Submit Property
                    </button>
                </div>

            </form>
        </div>
    );
}