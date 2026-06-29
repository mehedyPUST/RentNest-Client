'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHome, FaBuilding, FaUsers, FaChartLine, FaShieldAlt, FaHandshake } from 'react-icons/fa';
import { Sparkles, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';

const RentalStatistics = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const stats = [
        {
            id: 1,
            value: 5000,
            label: "Active Properties",
            icon: FaHome,
            suffix: "+",
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50 dark:bg-emerald-950/30"
        },
        {
            id: 2,
            value: 1200,
            label: "Happy Tenants",
            icon: FaUsers,
            suffix: "+",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30"
        },
        {
            id: 3,
            value: 98,
            label: "Satisfaction Rate",
            icon: FaChartLine,
            suffix: "%",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30"
        },
        {
            id: 4,
            value: 24,
            label: "Hour Support",
            icon: FaShieldAlt,
            suffix: "/7",
            color: "from-orange-500 to-orange-600",
            bgColor: "bg-orange-50 dark:bg-orange-950/30"
        }
    ];

    const quickFacts = [
        { icon: Award, label: "Best Platform 2024", color: "text-amber-500" },
        { icon: Clock, label: "Instant Booking", color: "text-blue-500" },
        { icon: CheckCircle, label: "Verified Listings", color: "text-green-500" },
        { icon: FaHandshake, label: "Trusted Partners", color: "text-purple-500" }
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

    const statVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            y: 30,
        },
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
            y: -5,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
    };

    const iconVariants = {
        initial: { rotate: 0, scale: 1 },
        hover: {
            rotate: 360,
            scale: 1.1,
            transition: {
                duration: 0.6,
                ease: "easeInOut",
            },
        },
    };

    const numberVariants = {
        hidden: { opacity: 0, scale: 0.5 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.2,
            },
        },
    };

    const factContainerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const factVariants = {
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

    const growthVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.3,
                ease: "easeOut",
            },
        },
        hover: {
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
            },
        },
    };

    const pulseIconVariants = {
        animate: {
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <section className="py-20 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/80 dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    className="text-center mb-12"
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
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rental Statistics</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Trusted by <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Thousands</span>
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
                        Real numbers that show why thousands of tenants and property owners trust RentNest.
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.id}
                            variants={statVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className={`relative p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm hover:shadow-xl transition-shadow duration-300 text-center ${stat.bgColor}`}
                        >
                            {/* Icon */}
                            <motion.div
                                className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg mb-4`}
                                variants={iconVariants}
                                initial="initial"
                                whileHover="hover"
                            >
                                <stat.icon className="w-6 h-6" />
                            </motion.div>

                            {/* Value */}
                            <motion.div
                                className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1"
                                variants={numberVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                            >
                                {isVisible ? (
                                    <>
                                        {stat.value.toLocaleString()}
                                        <motion.span
                                            className="text-emerald-600 dark:text-emerald-400"
                                            animate={{
                                                scale: [1, 1.2, 1],
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            {stat.suffix}
                                        </motion.span>
                                    </>
                                ) : (
                                    "0"
                                )}
                            </motion.div>

                            {/* Label */}
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                                {stat.label}
                            </p>

                            {/* Decorative Line */}
                            <motion.div
                                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r ${stat.color} rounded-full opacity-50`}
                                initial={{ width: 0 }}
                                whileInView={{ width: 48 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                viewport={{ once: true }}
                            />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Facts */}
                <motion.div
                    className="mt-12 flex flex-wrap justify-center gap-4"
                    variants={factContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {quickFacts.map((fact, index) => (
                        <motion.div
                            key={index}
                            variants={factVariants}
                            whileHover="hover"
                            className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
                        >
                            <motion.span
                                animate={index % 2 === 0 ? {
                                    scale: [1, 1.2, 1],
                                } : {
                                    rotate: [0, 10, -10, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <fact.icon className={`w-4 h-4 ${fact.color}`} />
                            </motion.span>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {fact.label}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Growth Indicator */}
                <motion.div
                    className="mt-10 p-6 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-900/30"
                    variants={growthVariants}
                    initial="hidden"
                    whileInView="visible"
                    whileHover="hover"
                    viewport={{ once: true }}
                >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <motion.div
                                className="p-3 bg-emerald-600/10 rounded-xl"
                                variants={pulseIconVariants}
                                animate="animate"
                            >
                                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                            </motion.div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Year-over-Year Growth</p>
                                <motion.p
                                    className="text-2xl font-bold text-gray-900 dark:text-white"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15,
                                        delay: 0.3,
                                    }}
                                    viewport={{ once: true }}
                                >
                                    +42%
                                </motion.p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                            {[
                                { label: "New Listings", value: "+18%" },
                                { label: "Tenant Growth", value: "+34%" },
                                { label: "Market Share", value: "+28%" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="text-center"
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.1) }}
                                    viewport={{ once: true }}
                                >
                                    <p className="text-gray-500 dark:text-gray-400">{item.label}</p>
                                    <motion.p
                                        className="font-semibold text-gray-900 dark:text-white"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {item.value}
                                    </motion.p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default RentalStatistics;