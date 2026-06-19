"use client";
import { authClient } from "@/lib/auth-client";
import { Check } from "@gravity-ui/icons";
import {
    Button,
    Card,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
    Dropdown,
    Header,
} from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { GrGoogle } from "react-icons/gr";
import { MdEmail, MdLock, MdPerson, MdImage, MdHome, MdBusiness } from "react-icons/md";

export default function SignUpPage() {
    const router = useRouter()
    const [selectedRole, setSelectedRole] = useState(new Set(["tenant"]));

    const roles = [
        { id: "tenant", label: "Tenant", description: "Looking for a home", icon: MdHome },
        { id: "owner", label: "Owner", description: "List your property", icon: MdBusiness },
    ];

    const getSelectedRoleLabel = () => {
        const roleId = Array.from(selectedRole)[0];
        const role = roles.find(r => r.id === roleId);
        return role ? role.label : "Select your role";
    };

    const getSelectedRoleIcon = () => {
        const roleId = Array.from(selectedRole)[0];
        const role = roles.find(r => r.id === roleId);
        if (!role) return null;
        const Icon = role.icon;
        return <Icon className={roleId === "tenant" ? "text-blue-500" : "text-purple-500"} size={18} />;
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const name = e.target.name.value;
        const image = e.target.image.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const role = Array.from(selectedRole)[0];

        const loadingToast = toast.loading("Creating your account...");

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
                image,
                metadata: {
                    role: role,
                },
            });

            if (error) {
                toast.dismiss(loadingToast);

                if (error.message?.includes("already")) {
                    toast.error("This email is already registered. Try signing in instead.");
                } else {
                    toast.error("Signup failed. Please check your details and try again.");
                }
                return;
            }
            await authClient.signOut();
            toast.dismiss(loadingToast);

            toast.success(`🎉 Account created successfully as ${role}! Login to enjoy RentNest`);

            setTimeout(() => {
                router.push("login");
            }, 1200);

        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const handleGoogleSignIn = async () => {
        const loadingToast = toast.loading("Redirecting to Google...");

        try {
            await authClient.signIn.social({
                provider: "google"
            });
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error("Google sign-in failed. Try again.");
        }
    };

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

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    const cardVariants = {
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
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.6,
            },
        },
        hover: {
            scale: 1.02,
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
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

    const buttonVariants = {
        initial: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
        tap: {
            scale: 0.95,
            transition: {
                duration: 0.1,
            },
        },
    };

    const floatingVariants = {
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    return (
        <motion.div
            className="min-h-screen py-8 overflow-hidden bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Decorative Floating Elements */}
            <motion.div
                className="absolute top-20 left-10 text-6xl opacity-10 hidden lg:block"
                variants={floatingVariants}
                animate="animate"
            >
                🏠
            </motion.div>
            <motion.div
                className="absolute bottom-20 right-10 text-6xl opacity-10 hidden lg:block"
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
            >
                🔑
            </motion.div>
            <motion.div
                className="absolute top-1/2 left-5 text-4xl opacity-5 hidden lg:block"
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 1 }}
            >
                ✨
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Page Header */}
                <motion.div
                    className="text-center mb-8"
                    variants={headerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        <motion.span
                            animate={{
                                rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            📝
                        </motion.span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Join Us Today</span>
                    </motion.div>

                    <motion.h1
                        className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                    >
                        Create <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Account</span>
                    </motion.h1>

                    <div className="flex items-center justify-center gap-3 mb-6">
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                        <motion.div
                            className="w-2 h-2 bg-blue-600 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                        />
                        <motion.div
                            className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: 64 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        />
                    </div>

                    <motion.p
                        className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Join thousands of happy tenants and property owners. Sign up today and find your dream home.
                    </motion.p>
                </motion.div>

                {/* Sign Up Card */}
                <motion.div
                    className="flex justify-center items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                    >
                        <Card className="w-full max-w-md border border-gray-200/50 dark:border-gray-800/50 shadow-xl bg-white dark:bg-gray-900 overflow-hidden">
                            <motion.div
                                className="p-6 md:p-8"
                                variants={containerVariants}
                            >
                                <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
                                    {/* Name Field */}
                                    <motion.div variants={itemVariants}>
                                        <TextField isRequired name="name" type="text">
                                            <Label className="text-gray-700 dark:text-gray-300 font-semibold">Full Name</Label>
                                            <div className="relative">
                                                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <Input
                                                    placeholder="Enter your name"
                                                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 w-full dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                            <FieldError />
                                        </TextField>
                                    </motion.div>

                                    {/* Image URL Field */}
                                    <motion.div variants={itemVariants}>
                                        <TextField isRequired name="image" type="text">
                                            <Label className="text-gray-700 dark:text-gray-300 font-semibold">Profile Image URL</Label>
                                            <div className="relative">
                                                <MdImage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <Input
                                                    placeholder="https://example.com/avatar.jpg"
                                                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 w-full dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                            <FieldError />
                                        </TextField>
                                    </motion.div>

                                    {/* Email Field */}
                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            isRequired
                                            name="email"
                                            type="email"
                                            validate={(value) => {
                                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                                    return "Please enter a valid email address";
                                                }
                                                return null;
                                            }}
                                        >
                                            <Label className="text-gray-700 dark:text-gray-300 font-semibold">Email</Label>
                                            <div className="relative">
                                                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <Input
                                                    placeholder="john@example.com"
                                                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 w-full dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                            <FieldError />
                                        </TextField>
                                    </motion.div>

                                    {/* Password Field */}
                                    <motion.div variants={itemVariants}>
                                        <TextField
                                            isRequired
                                            minLength={8}
                                            name="password"
                                            type="password"
                                            validate={(value) => {
                                                if (value.length < 8) {
                                                    return "Password must be at least 8 characters";
                                                }
                                                if (!/[A-Z]/.test(value)) {
                                                    return "Password must contain at least one uppercase letter";
                                                }
                                                if (!/[0-9]/.test(value)) {
                                                    return "Password must contain at least one number";
                                                }
                                                return null;
                                            }}
                                        >
                                            <Label className="text-gray-700 dark:text-gray-300 font-semibold">Password</Label>
                                            <div className="relative">
                                                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <Input
                                                    placeholder="Enter your password"
                                                    className="pl-10 border-gray-200 dark:border-gray-700 focus:border-blue-500 w-full dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                            <Description className="text-gray-400 dark:text-gray-500">
                                                Must be at least 8 characters with 1 uppercase and 1 number
                                            </Description>
                                            <FieldError />
                                        </TextField>
                                    </motion.div>

                                    {/* Role Selection - Dropdown */}
                                    <motion.div variants={itemVariants} className="flex flex-col gap-2">
                                        <Label className="text-gray-700 dark:text-gray-300 font-semibold">I want to join as a</Label>
                                        <Dropdown>
                                            <Button
                                                aria-label="Select role"
                                                variant="secondary"
                                                className="w-full justify-between border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium h-12 rounded-xl transition-all"
                                                endContent={
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                }
                                                startContent={
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-950/50 flex items-center justify-center">
                                                        {getSelectedRoleIcon()}
                                                    </div>
                                                }
                                            >
                                                <span className="font-medium">{getSelectedRoleLabel()}</span>
                                            </Button>
                                            <Dropdown.Popover className="min-w-[280px] rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-800/50">
                                                <Dropdown.Menu
                                                    selectedKeys={selectedRole}
                                                    selectionMode="single"
                                                    onSelectionChange={setSelectedRole}
                                                    className="p-2"
                                                >
                                                    <Dropdown.Section>
                                                        <Header className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                                            Select your role
                                                        </Header>
                                                        {roles.map((role) => {
                                                            const Icon = role.icon;
                                                            const isSelected = Array.from(selectedRole)[0] === role.id;
                                                            return (
                                                                <Dropdown.Item
                                                                    key={role.id}
                                                                    id={role.id}
                                                                    textValue={role.label}
                                                                    className={`py-3 px-3 rounded-xl transition-all ${isSelected
                                                                        ? "bg-blue-50 dark:bg-blue-950/20"
                                                                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${role.id === "tenant"
                                                                            ? "bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400"
                                                                            : "bg-purple-100 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400"
                                                                            }`}>
                                                                            <Icon size={20} />
                                                                        </div>
                                                                        <div className="flex flex-col flex-1">
                                                                            <span className={`font-medium ${isSelected
                                                                                ? "text-blue-600 dark:text-blue-400"
                                                                                : "text-gray-800 dark:text-gray-200"
                                                                                }`}>
                                                                                {role.label}
                                                                            </span>
                                                                            <span className="text-xs text-gray-500 dark:text-gray-400">{role.description}</span>
                                                                        </div>
                                                                        {isSelected && (
                                                                            <div className="w-5 h-5 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center">
                                                                                <Check size={12} className="text-white" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </Dropdown.Item>
                                                            );
                                                        })}
                                                    </Dropdown.Section>
                                                </Dropdown.Menu>
                                            </Dropdown.Popover>
                                        </Dropdown>
                                        <Description className="text-gray-400 dark:text-gray-500 text-sm">
                                            Select your role to get started with the right features
                                        </Description>
                                    </motion.div>

                                    {/* Action Buttons */}
                                    <motion.div
                                        className="flex gap-3 pt-2"
                                        variants={itemVariants}
                                    >
                                        <motion.div
                                            variants={buttonVariants}
                                            initial="initial"
                                            whileHover="hover"
                                            whileTap="tap"
                                            className="flex-1"
                                        >
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold transition-all shadow-md shadow-blue-500/20 h-12 rounded-xl"
                                            >
                                                <Check size={18} />
                                                Create Account
                                            </Button>
                                        </motion.div>
                                        <motion.div
                                            variants={buttonVariants}
                                            initial="initial"
                                            whileHover="hover"
                                            whileTap="tap"
                                        >
                                            <Button
                                                type="reset"
                                                variant="flat"
                                                className="border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 h-12 rounded-xl"
                                            >
                                                Reset
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </Form>

                                {/* Divider */}
                                <motion.div
                                    className="relative my-6"
                                    variants={itemVariants}
                                >
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-400">Or continue with</span>
                                    </div>
                                </motion.div>

                                {/* Google Sign In Button */}
                                <motion.div
                                    variants={itemVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <Button
                                        onClick={handleGoogleSignIn}
                                        className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-all duration-300 h-12 rounded-xl"
                                    >
                                        <GrGoogle className="text-red-500" />
                                        Sign Up with Google
                                    </Button>
                                </motion.div>

                                {/* Sign In Link */}
                                <motion.p
                                    className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6"
                                    variants={itemVariants}
                                >
                                    Already have an account?{' '}
                                    <Link href="/login" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors">
                                        Sign In
                                    </Link>
                                </motion.p>
                            </motion.div>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}