'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    FaTwitter,
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaGithub,
    FaYoutube,
    FaPinterest
} from 'react-icons/fa';
import {
    Building2,
    Mail,
    Phone,
    MapPin,
    Heart,
    Sparkles,
    ChevronRight,
} from 'lucide-react';

// কুইক লিংক ডাটা
const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/blog", label: "Blog" },
];

// সাপোর্ট লিংক ডাটা
const supportLinks = [
    { href: "/faq", label: "Help Center" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/sitemap", label: "Sitemap" },
    { href: "/cookies", label: "Cookie Policy" },
];

// সোশ্যাল মিডিয়া লিংক ডাটা
const socialLinks = [
    { href: "#", icon: FaTwitter, label: "Twitter", color: "hover:bg-[#1DA1F2]" },
    { href: "#", icon: FaFacebookF, label: "Facebook", color: "hover:bg-[#1877F2]" },
    { href: "#", icon: FaInstagram, label: "Instagram", color: "hover:bg-[#E4405F]" },
    { href: "#", icon: FaLinkedinIn, label: "LinkedIn", color: "hover:bg-[#0A66C2]" },
    { href: "#", icon: FaGithub, label: "GitHub", color: "hover:bg-[#181717]" },
    { href: "#", icon: FaYoutube, label: "YouTube", color: "hover:bg-[#FF0000]" },
    { href: "#", icon: FaPinterest, label: "Pinterest", color: "hover:bg-[#E60023]" },
];

// অ্যানিমেশন ভেরিয়েন্টস
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

const Footer = () => {
    // ✅ সব হুক আগে কল করতে হবে
    const [currentYear, setCurrentYear] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsMounted(true);
        setCurrentYear(new Date().getFullYear());
    }, []);

    // ✅ কন্ডিশনাল রিটার্ন হুকের পরে
    if (pathname?.includes("dashboard")) {
        return null;
    }

    const isActive = (path) => pathname === path;

    return (
        <footer className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 border-t border-slate-200/50 dark:border-gray-800/50 mt-auto overflow-hidden">
            {/* ডেকোরেটিভ ব্যাকগ্রাউন্ড এলিমেন্ট */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-emerald-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-emerald-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-300/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full px-6 lg:px-8 py-16 lg:py-20">
                {/* মেইন ফুটার গ্রিড */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {/* ব্র্যান্ড সেকশন - ৪ কলাম */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4 space-y-5"
                    >
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <motion.div
                                className="relative w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-xl group-hover:shadow-emerald-500/30 transition-all duration-300"
                                whileHover={{ rotate: 360, scale: 1.05 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Building2 className="w-6 h-6 text-white" />
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
                            </motion.div>
                            <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">
                                Rent<span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">Nest</span>
                            </span>
                        </Link>

                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-sm font-light">
                            Find your perfect home with RentNest. Discover thousands of verified properties
                            for rent and sale across the country.
                        </p>

                        {/* সোশ্যাল মিডিয়া লিংক */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {socialLinks.map(({ href, icon: Icon, label, color }) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className={`w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-slate-200/50 dark:border-gray-700/50 text-slate-600 dark:text-slate-400 transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:border-transparent hover:scale-110 group ${color}`}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Icon className="w-4 h-4 group-hover:text-white transition-colors duration-300" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* কুইক লিংক - ২ কলাম */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2"
                    >
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {quickLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`group inline-flex items-center gap-2 text-sm transition-all duration-200 ${isActive(href) ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                    >
                                        <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200 ${isActive(href) ? "opacity-100 translate-x-0 text-emerald-600" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* সাপোর্ট - ২ কলাম */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-2"
                    >
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                            Support
                        </h3>
                        <ul className="space-y-3">
                            {supportLinks.map(({ href, label }) => (
                                <li key={href}>
                                    <Link
                                        href={href}
                                        className={`group inline-flex items-center gap-2 text-sm transition-all duration-200 ${isActive(href) ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                                    >
                                        <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200 ${isActive(href) ? "opacity-100 translate-x-0 text-emerald-600" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* কন্টাক্ট ইনফো - ৪ কলাম */}
                    <motion.div
                        variants={itemVariants}
                        className="lg:col-span-4"
                    >
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-5">
                            Get in Touch
                        </h3>
                        <ul className="space-y-4">
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a
                                    href="mailto:info@rentnest.com"
                                    className="group flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                                >
                                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-500/20 group-hover:to-emerald-600/20 dark:group-hover:from-emerald-500/30 dark:group-hover:to-emerald-600/30 transition-all duration-200 group-hover:scale-105">
                                        <Mail className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="font-light">info@rentnest.com</span>
                                </a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <a
                                    href="tel:+1234567890"
                                    className="group flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200"
                                >
                                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 flex items-center justify-center group-hover:from-emerald-500/20 group-hover:to-emerald-600/20 dark:group-hover:from-emerald-500/30 dark:group-hover:to-emerald-600/30 transition-all duration-200 group-hover:scale-105">
                                        <Phone className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="font-light">+1 (234) 567-890</span>
                                </a>
                            </motion.li>
                            <motion.li whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                                <div className="flex items-start gap-4 text-sm text-slate-600 dark:text-slate-400">
                                    <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 dark:from-emerald-500/20 dark:to-emerald-600/20 flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <span className="font-light leading-relaxed">123 Main Street,<br />New York, NY 10001</span>
                                </div>
                            </motion.li>
                        </ul>
                    </motion.div>
                </motion.div>

                {/* ডিভাইডার */}
                <motion.div
                    className="relative my-12"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200/60 dark:border-gray-800/60"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-gray-900 px-8 py-2 text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 rounded-full border border-slate-200/50 dark:border-gray-800/50 shadow-sm">
                            <motion.span
                                animate={{
                                    scale: [1, 1.2, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="inline-block"
                            >
                                <Sparkles className="w-3.5 h-3.5 inline mr-2 text-emerald-500" />
                            </motion.span>
                            Trusted by thousands
                        </span>
                    </div>
                </motion.div>

                {/* বটম বার */}
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-slate-500 dark:text-slate-400 font-light" suppressHydrationWarning>
                        &copy; {isMounted ? currentYear : '2025'} RentNest. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-slate-500 dark:text-slate-400">
                        <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-light text-xs uppercase tracking-wider">
                            Privacy
                        </Link>
                        <span className="w-px h-4 bg-slate-300/60 dark:bg-gray-700/60"></span>
                        <Link href="/terms" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-light text-xs uppercase tracking-wider">
                            Terms
                        </Link>
                        <span className="w-px h-4 bg-slate-300/60 dark:bg-gray-700/60"></span>
                        <Link href="/cookies" className="hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-light text-xs uppercase tracking-wider">
                            Cookies
                        </Link>
                        <span className="w-px h-4 bg-slate-300/60 dark:bg-gray-700/60"></span>
                        <motion.p
                            className="flex items-center gap-1.5 font-light"
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            Made with
                            <motion.span
                                animate={{
                                    scale: [1, 1.3, 1],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                            </motion.span>
                            by <span className="font-medium text-slate-700 dark:text-slate-300">RentNest</span>
                        </motion.p>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;