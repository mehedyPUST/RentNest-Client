'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, Input, Button } from '@heroui/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', photo: '', role: 'tenant',
    });

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) return showToast('Passwords do not match');
        setLoading(true);
        // ... (Your existing API logic remains the same)
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Background Decorative Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200 mix-blend-multiply filter blur-[120px] opacity-70 animate-pulse" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-200 mix-blend-multiply filter blur-[120px] opacity-70" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <Card className="backdrop-blur-xl bg-white/70 border border-white/50 shadow-2xl p-8 rounded-3xl">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Create Account</h1>
                        <p className="text-gray-500 mt-2">Start your journey with RentNest today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Full Name" variant="flat" size="lg" className="bg-white/50" />
                            <Input label="Email" type="email" variant="flat" size="lg" className="bg-white/50" />
                        </div>

                        <Input label="Photo URL (Optional)" variant="flat" size="lg" className="bg-white/50" />

                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-gray-600 ml-1">Account Type</label>
                            <select
                                className="w-full px-4 py-3 rounded-xl border-none bg-white/60 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="tenant">🏠 Tenant</option>
                                <option value="owner">🏢 Property Owner</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Password" type="password" variant="flat" size="lg" className="bg-white/50" />
                            <Input label="Confirm Password" type="password" variant="flat" size="lg" className="bg-white/50" />
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            className="w-full bg-gray-900 text-white rounded-xl hover:bg-black transition-all shadow-xl shadow-indigo-500/20"
                            isLoading={loading}
                        >
                            Get Started
                        </Button>
                    </form>

                    <div className="my-8 flex items-center gap-4 text-xs text-gray-400 uppercase tracking-widest">
                        <div className="h-px flex-1 bg-gray-200" /> OR <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <Button variant="flat" className="w-full bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
                        Continue with Google
                    </Button>
                </Card>
            </motion.div>
        </div>
    );
}