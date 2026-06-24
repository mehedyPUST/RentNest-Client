"use client";

import { useState } from "react";
import { Button, Drawer } from "@heroui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Search,
    Bell,
    PlusCircle,
    FileText,
    Mail,
    User,
    Settings,
    CalendarCheck,
    Heart,
    LayoutDashboard,
    Users,
    Building,
    BookOpen,
    CreditCard,
    UserCog
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session, isPending } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const userRole = session?.user?.role?.toLowerCase() || 'tenant';

    if (isPending) {
        return (
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </aside>
        );
    }

    let navItems = [];

    if (userRole === 'tenant') {
        navItems = [
            { icon: House, href: '/dashboard/tenant', label: "Dashboard" },
            { icon: CalendarCheck, href: '/dashboard/tenant/my-bookings', label: "My Bookings" },
            { icon: Heart, href: '/dashboard/tenant/favorites', label: "Favorites" },
            { icon: User, href: '/dashboard/tenant/profile', label: "Profile" },
            { icon: Search, href: '/all-properties', label: "Browse Properties" },
            { icon: Bell, href: '#', label: "Notifications" },
            { icon: Settings, href: '#', label: "Settings" },
        ];
    } else if (userRole === 'owner') {
        navItems = [
            { icon: House, href: '/dashboard/owner', label: "Home" },
            { icon: Search, href: '/dashboard/owner/my-properties', label: "My Properties" },
            { icon: PlusCircle, href: '/dashboard/owner/add-property', label: "Add a New Property" },
            { icon: FileText, href: '/dashboard/owner/booking-requests', label: "Booking Requests" },
            { icon: Mail, href: '#', label: "Messages" },
            { icon: User, href: '#', label: "Profile" },
            { icon: Settings, href: '#', label: "Settings" },
        ];
    } else if (userRole === 'admin') {
        navItems = [
            { icon: LayoutDashboard, href: '/dashboard/admin', label: "Dashboard" },
            { icon: Users, href: '/dashboard/admin/users', label: "All Users" },
            { icon: Building, href: '/dashboard/admin/properties', label: "All Properties" },
            { icon: BookOpen, href: '/dashboard/admin/bookings', label: "All Bookings" },
            { icon: CreditCard, href: '/dashboard/admin/transactions', label: "Transactions" },
            { icon: Bell, href: '#', label: "Notifications" },
            { icon: UserCog, href: '#', label: "Settings" },
        ];
    }

    const navContent = (
        <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                return (
                    <Link
                        href={item.href}
                        key={item.label}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "text-foreground hover:bg-default"
                            }`}
                    >
                        <item.icon className="size-5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
                <div className="mb-6 px-3">
                    <h2 className="text-lg font-semibold capitalize">{userRole} Dashboard</h2>
                    {session?.user?.name && (
                        <p className="text-sm text-muted-foreground mt-1">
                            Welcome, {session.user.name}
                        </p>
                    )}
                </div>
                {navContent}
            </aside>

            {/* Mobile Drawer */}
            <div className="lg:hidden">
                {/* Trigger Button */}
                <Button
                    variant="light"
                    className="flex items-center gap-2"
                    onPress={() => setIsOpen(true)}
                >
                    <Menu className="size-5" />
                    <span className="text-sm">Menu</span>
                </Button>

                {/* Drawer */}
                <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="left" size="xs">
                    <Drawer.Content>
                        <div className="p-4 min-w-[280px]">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold capitalize">{userRole} Dashboard</h2>
                                    {session?.user?.name && (
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Welcome, {session.user.name}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    onPress={() => setIsOpen(false)}
                                >
                                    <X className="size-5" />
                                </Button>
                            </div>
                            {navContent}
                        </div>
                    </Drawer.Content>
                </Drawer>
            </div>
        </>
    );
}