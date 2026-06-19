'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaSearch,
    FaCalendarCheck,
    FaHome,
    FaCreditCard,
    FaRegBuilding,
    FaRegHandshake,
    FaKey,
    FaRegSmile
} from 'react-icons/fa';
import {
    Search,
    Calendar,
    Home,
    CreditCard,
    Sparkles,
    ArrowRight
} from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Search className="w-6 h-6" />,
            title: "Search Properties",
            description: "Browse thousands of properties. Filter by location, price, property type, and amenities to find your perfect match.",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50 dark:bg-blue-950/30",
            borderColor: "border-blue-200 dark:border-blue-800",
            numberColor: "bg-blue-600"
        },
        {
            icon: <Calendar className="w-6 h-6" />,
            title: "Schedule a Visit",
            description: "Book a viewing at your convenience. Virtual tours available for remote viewing or visit in person.",
            color: "from-indigo-500 to-indigo-600",
            bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
            borderColor: "border-indigo-200 dark:border-indigo-800",
            numberColor: "bg-indigo-600"
        },
        {
            icon: <Home className="w-6 h-6" />,
            title: "Choose & Apply",
            description: "Select your favorite property, submit your application, and get approved quickly with our streamlined process.",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50 dark:bg-purple-950/30",
            borderColor: "border-purple-200 dark:border-purple-800",
            numberColor: "bg-purple-600"
        },
        {
            icon: <CreditCard className="w-6 h-6" />,
            title: "Secure Payment",
            description: "Complete your booking with secure online payment. Transparent pricing with no hidden fees or surprises.",
            color: "from-pink-500 to-pink-600",
            bgColor: "bg-pink-50 dark:bg-pink-950/30",
            borderColor: "border-pink-200 dark:border-pink-800",
            numberColor: "bg-pink-600"
        }
    ];

    const features = [
        { icon: <FaRegBuilding />, label: "5,000+ Properties" },
        { icon: <FaRegHandshake />, label: "Trusted Agents" },
        { icon: <FaKey />, label: "Instant Booking" },
        { icon: <FaRegSmile />, label: "99% Satisfaction" }
    ];

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
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

    const stepVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.95,
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

    const numberVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: 0.2,
            },
        },
        hover: {
            scale: 1.1,
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

    const arrowVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
        hover: {
            x: 5,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
    };

    const lineVariants = {
        hidden: { scaleX: 0 },
        visible: {
            scaleX: 1,
            transition: {
                duration: 0.8,
                delay: 0.5,
                ease: "easeOut",
            },
        },
    };

    const featureContainerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const featureItemVariants = {
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

    return (
        <section className="py-20 sm:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">

            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

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
                            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Simple Process</span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
                        How <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">RentNest</span>{" "}
                        <span className="text-gray-900 dark:text-white">Works</span>
                    </h2>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-blue-600 rounded-full"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                            viewport={{ once: true }}
                        />
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true }}
                        />
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                        Find your dream home in 4 simple steps. From searching to moving in, we make the process seamless and stress-free.
                    </p>
                </motion.div>

                {/* Steps */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                >
                    {/* Connecting Line - Desktop */}
                    <motion.div
                        className="hidden lg:block absolute top-1/2 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900 -translate-y-1/2 origin-left"
                        variants={lineVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={stepVariants}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className={`group relative ${step.bgColor} border ${step.borderColor} rounded-2xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 backdrop-blur-sm cursor-default`}
                        >
                            {/* Step number */}
                            <motion.div
                                className={`absolute -top-4 -left-4 w-10 h-10 ${step.numberColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-500/20`}
                                variants={numberVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true }}
                            >
                                {index + 1}
                            </motion.div>

                            {/* Icon */}
                            <motion.div
                                className={`mb-5 inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                                variants={iconVariants}
                                initial="initial"
                                whileHover="hover"
                            >
                                {step.icon}
                            </motion.div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {step.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {step.description}
                            </p>

                            {/* Arrow indicator - visible on hover */}
                            <motion.div
                                className="absolute bottom-4 right-4"
                                variants={arrowVariants}
                                initial="hidden"
                                whileInView="visible"
                                whileHover="hover"
                                viewport={{ once: true }}
                            >
                                <ArrowRight className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    className="text-center mt-16"
                    variants={featureContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.div
                        className="inline-flex flex-wrap justify-center gap-6 sm:gap-8 p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-lg"
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center gap-3"
                                variants={featureItemVariants}
                                whileHover="hover"
                            >
                                <motion.div
                                    className="text-blue-600 dark:text-blue-400 text-xl"
                                    whileHover={{ rotate: 360, scale: 1.2 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {feature.icon}
                                </motion.div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {feature.label}
                                </span>
                                {index < features.length - 1 && (
                                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 ml-2 hidden sm:block"></div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;