'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaShieldAlt,
    FaHeadset,
    FaMoneyBillWave,
    FaHome,
    FaClock,
    FaStar,
    FaRegBuilding,
    FaRegHandshake,
    FaKey,
    FaRegSmile
} from 'react-icons/fa';
import {
    Shield,
    Headphones,
    Wallet,
    Home,
    Clock,
    Star,
    Sparkles,
    CheckCircle,
    ArrowRight
} from 'lucide-react';

const WhyChooseUs = () => {
    const features = [
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Verified Properties",
            description: "Every property on RentNest is verified by our team. We ensure accurate listings and authentic photos.",
            color: "from-emerald-500 to-green-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
            borderColor: "border-emerald-200 dark:border-emerald-800"
        },
        {
            icon: <Wallet className="w-6 h-6" />,
            title: "Best Price Guarantee",
            description: "We offer competitive rates with no hidden fees. Transparent pricing from listing to move-in.",
            color: "from-amber-500 to-orange-600",
            bgColor: "bg-amber-50 dark:bg-amber-950/30",
            borderColor: "border-amber-200 dark:border-amber-800"
        },
        {
            icon: <Headphones className="w-6 h-6" />,
            title: "24/7 Support",
            description: "Our dedicated team is always available to assist you with any questions or concerns.",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
            borderColor: "border-blue-200 dark:border-blue-800"
        },
        {
            icon: <Home className="w-6 h-6" />,
            title: "Flexible Viewing",
            description: "Schedule viewings at your convenience. Virtual tours available for remote viewing.",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
            borderColor: "border-purple-200 dark:border-purple-800"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Quick Approval",
            description: "Get approved within 24 hours. Our streamlined process gets you into your dream home faster.",
            color: "from-pink-500 to-pink-600",
            bgColor: "bg-pink-50 dark:bg-pink-950/30",
            borderColor: "border-pink-200 dark:border-pink-800"
        },
        {
            icon: <Star className="w-6 h-6" />,
            title: "Trusted Service",
            description: "Thousands of satisfied tenants trust RentNest for their property needs. Join our community today.",
            color: "from-indigo-500 to-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
            borderColor: "border-indigo-200 dark:border-indigo-800"
        }
    ];

    const stats = [
        { value: "10K+", label: "Happy Tenants", color: "text-emerald-600 dark:text-emerald-400" },
        { value: "5K+", label: "Properties Listed", color: "text-blue-600 dark:text-blue-400" },
        { value: "98%", label: "Satisfaction Rate", color: "text-purple-600 dark:text-purple-400" },
        { value: "24/7", label: "Support Available", color: "text-amber-600 dark:text-amber-400" }
    ];

    const highlights = [
        { icon: <FaRegBuilding />, label: "Verified Properties" },
        { icon: <FaRegHandshake />, label: "Trusted Agents" },
        { icon: <FaKey />, label: "No Hidden Fees" },
        { icon: <FaRegSmile />, label: "Hassle-Free Move-in" }
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2,
            },
        },
    };

    const headerVariants = {
        hidden: { opacity: 0, y: -30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const featureVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const statsContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const statVariants = {
        hidden: { opacity: 0, scale: 0.5, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                duration: 0.5,
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
    };

    const highlightVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
    };

    const iconVariants = {
        initial: { rotate: 0 },
        hover: {
            rotate: 360,
            transition: {
                duration: 0.6,
                ease: "easeInOut",
            },
        },
    };

    const starVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.2, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <section className="py-20 sm:py-28 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 w-full">

            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    className="text-center mb-16 sm:mb-20"
                    variants={headerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        >
                            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Why RentNest</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                        Why Choose <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">RentNest</span>
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-emerald-600 rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-emerald-700 to-emerald-800 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        We're committed to providing the best property rental experience with exceptional service,
                        transparent pricing, and a wide selection of verified properties.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={featureVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className={`group ${feature.bgColor} border ${feature.borderColor} rounded-2xl p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm relative overflow-hidden cursor-default`}
                        >
                            {/* Background gradient overlay */}
                            <motion.div
                                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                            />

                            {/* Icon with gradient */}
                            <motion.div
                                className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-5 relative z-10`}
                                variants={iconVariants}
                                initial="initial"
                                whileHover="hover"
                            >
                                {feature.icon}
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 relative z-10">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed relative z-10">
                                {feature.description}
                            </p>

                            {/* Decorative dot */}
                            <motion.div
                                className={`absolute -bottom-6 -right-6 w-20 h-20 rounded-full bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 3,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800"
                    variants={statsContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={statVariants}
                                whileHover="hover"
                                className="group cursor-default"
                            >
                                <motion.div
                                    className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${stat.color} transition-all duration-300`}
                                >
                                    {stat.value}
                                </motion.div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 font-medium">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {highlights.map((item, index) => (
                        <motion.div
                            key={index}
                            className="flex items-center gap-3"
                            variants={highlightVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <motion.div
                                className="text-emerald-600 dark:text-emerald-400 text-xl"
                                whileHover={{ rotate: 360, scale: 1.2 }}
                                transition={{ duration: 0.4 }}
                            >
                                {item.icon}
                            </motion.div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {item.label}
                            </span>
                            {index < highlights.length - 1 && (
                                <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 ml-2 hidden sm:block"></div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonial Teaser */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <motion.div
                        className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <span className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                                <motion.span
                                    key={i}
                                    variants={starVariants}
                                    initial="initial"
                                    animate="animate"
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Star className="w-4 h-4 fill-current" />
                                </motion.span>
                            ))}
                        </span>
                        <motion.span
                            className="font-medium text-gray-700 dark:text-gray-300"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            4.9/5
                        </motion.span>
                        <span>from 2,000+ reviews</span>
                    </motion.div>
                </motion.div>

            </div>
        </section>
    );
};

export default WhyChooseUs;