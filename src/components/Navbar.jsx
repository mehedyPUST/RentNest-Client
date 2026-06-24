'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Building2, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';

const Navbar = () => {

    const pathname = usePathname();
    // if (pathname.includes("dashboard")) {
    //     return null
    // }

    const [isMenuOpen, setIsMenuOpen] = useState(false);


    const { data: session } = authClient.useSession();
    const user = session?.user;
    console.log(user, 'user from nav')
    const isLoggedIn = !!user;

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            toast.success('Logged out successfully');
            window.location.href = '/';
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    const handleLogin = () => {
        window.location.href = '/login';
    };

    // Check if a link is active
    const isActive = (path) => pathname === path;

    // Get dashboard path based on user role
    const getDashboardPath = () => {
        if (!user) return '/dashboard';
        const role = user?.role?.toLowerCase();
        if (role === 'admin') return '/dashboard/admin';
        if (role === 'owner') return '/dashboard/owner';
        if (role === 'tenant') return '/dashboard/tenant';
        // if (role === 'tenant') return '/dashboard';
        return '/dashboard';
    };

    // Get dashboard label based on user role
    const getDashboardLabel = () => {
        if (!user) return 'Dashboard';
        const role = user?.role?.toLowerCase();
        if (role === 'admin') return 'Admin Panel';
        if (role === 'owner') return 'Dashboard';
        if (role === 'tenant') return 'Dashboard';
        return 'Dashboard';
    };

    // Animation variants
    const logoVariants = {
        initial: { opacity: 0, x: -20 },
        animate: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    const navItemVariants = {
        initial: { opacity: 0, y: -10 },
        animate: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.4,
                ease: "easeOut"
            }
        }),
        hover: {
            scale: 1.05,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    const mobileMenuVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.4,
                ease: "easeOut",
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const mobileItemVariants = {
        hidden: {
            opacity: 0,
            x: -20
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const menuButtonVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: isMenuOpen ? 90 : 0,
            transition: { duration: 0.3 }
        }
    };

    const logoIconVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: 360,
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 3
            }
        }
    };

    const dashboardPath = getDashboardPath();
    const dashboardLabel = getDashboardLabel();

    return (
        <motion.nav
            className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo + Name */}
                    <motion.div
                        className="flex items-center gap-3"
                        variants={logoVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <motion.div
                            className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center cursor-pointer shadow-md shadow-blue-200"
                            variants={logoIconVariants}
                            initial="initial"
                            animate="animate"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Building2 className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className='flex flex-col'>
                            <Link href="/" className="text-2xl font-bold tracking-tight text-gray-900">
                                Rent<span className="text-blue-600">Nest</span>
                            </Link>
                            <motion.p
                                className="text-xs text-gray-500 -mt-0.5"
                                animate={{
                                    opacity: [0.5, 1, 0.5],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                Property Hub
                            </motion.p>
                        </div>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {[
                            { href: "/", icon: Home, label: "Home" },
                            { href: "/all-properties", icon: Building2, label: "All Properties" },
                        ].map((item, index) => (
                            <motion.div
                                key={item.href}
                                custom={index}
                                variants={navItemVariants}
                                initial="initial"
                                animate="animate"
                                whileHover="hover"
                            >
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-2 transition-colors ${isActive(item.href)
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-700 hover:text-gray-900 font-medium"
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" /> {item.label}
                                </Link>
                            </motion.div>
                        ))}

                        {isLoggedIn ? (
                            <>
                                <motion.div
                                    custom={2}
                                    variants={navItemVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                >
                                    <Link
                                        href={dashboardPath}
                                        className={`flex items-center gap-2 transition-colors ${isActive(dashboardPath)
                                            ? "text-blue-600 font-semibold"
                                            : "text-gray-700 hover:text-gray-900 font-medium"
                                            }`}
                                    >
                                        <LayoutDashboard className="w-4 h-4" /> {dashboardLabel}
                                    </Link>
                                </motion.div>
                                <motion.button
                                    custom={3}
                                    variants={navItemVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
                                >
                                    <LogOut className="w-4 h-4" /> Logout
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <motion.button
                                    custom={2}
                                    variants={navItemVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogin}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
                                >
                                    <LogIn className="w-4 h-4" /> Login
                                </motion.button>

                                <motion.div
                                    custom={3}
                                    variants={navItemVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/register"
                                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all active:scale-[0.97] shadow-md shadow-blue-200"
                                    >
                                        <UserPlus className="w-4 h-4" /> Register
                                    </Link>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <motion.button
                        onClick={toggleMenu}
                        className="md:hidden p-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
                        variants={menuButtonVariants}
                        initial="initial"
                        animate="animate"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isMenuOpen ? 'close' : 'menu'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:hidden border-t bg-white/95 backdrop-blur-md overflow-hidden shadow-lg"
                        variants={mobileMenuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <div className="px-6 py-8 space-y-6 text-lg">
                            <motion.div variants={mobileItemVariants}>
                                <Link
                                    href="/"
                                    className={`flex items-center gap-3 transition-colors ${isActive('/')
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-700 hover:text-gray-900"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Home className="w-5 h-5" /> Home
                                </Link>
                            </motion.div>

                            <motion.div variants={mobileItemVariants}>
                                <Link
                                    href="/all-properties"
                                    className={`flex items-center gap-3 transition-colors ${isActive('/all-properties')
                                        ? "text-blue-600 font-semibold"
                                        : "text-gray-700 hover:text-gray-900"
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Building2 className="w-5 h-5" /> All Properties
                                </Link>
                            </motion.div>

                            {isLoggedIn ? (
                                <>
                                    <motion.div variants={mobileItemVariants}>
                                        <Link
                                            href={dashboardPath}
                                            className={`flex items-center gap-3 transition-colors ${isActive(dashboardPath)
                                                ? "text-blue-600 font-semibold"
                                                : "text-gray-700 hover:text-gray-900"
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="w-5 h-5" /> {dashboardLabel}
                                        </Link>
                                    </motion.div>
                                    <motion.div variants={mobileItemVariants}>
                                        <button
                                            onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                            className="flex items-center gap-3 text-gray-700 hover:text-red-600 w-full text-left transition-colors"
                                        >
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </motion.div>
                                </>
                            ) : (
                                <>
                                    <motion.div variants={mobileItemVariants}>
                                        <button
                                            onClick={() => { handleLogin(); setIsMenuOpen(false); }}
                                            className="flex items-center gap-3 text-gray-700 hover:text-gray-900 w-full text-left transition-colors"
                                        >
                                            <LogIn className="w-5 h-5" /> Login
                                        </button>
                                    </motion.div>
                                    <motion.div
                                        variants={mobileItemVariants}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            href="/register"
                                            className="block w-full text-center py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl transition-all shadow-md shadow-blue-200"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Register
                                        </Link>
                                    </motion.div>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;