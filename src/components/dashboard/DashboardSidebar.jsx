// "use client";

// import { useState } from "react";
// import { Button, Drawer } from "@heroui/react";
// import { Menu, X } from "lucide-react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//     House,
//     Search,
//     Bell,
//     PlusCircle,
//     FileText,
//     Mail,
//     User,
//     Settings,
//     CalendarCheck,
//     Heart,
//     LayoutDashboard,
//     Users,
//     Building,
//     BookOpen,
//     CreditCard,
//     UserCog
// } from "lucide-react";
// import { useSession } from "@/lib/auth-client";

// export default function DashboardSidebar() {
//     const pathname = usePathname();
//     const { data: session, isPending } = useSession();
//     const [isOpen, setIsOpen] = useState(false);

//     const userRole = session?.user?.role?.toLowerCase() || 'tenant';

//     if (isPending) {
//         return (
//             <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block">
//                 <div className="flex items-center justify-center h-32">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//                 </div>
//             </aside>
//         );
//     }

//     let navItems = [];

//     if (userRole === 'tenant') {
//         navItems = [
//             { icon: House, href: '/dashboard/tenant', label: "Home" },
//             { icon: CalendarCheck, href: '/dashboard/tenant/my-bookings', label: "My Bookings" },
//             { icon: Heart, href: '/dashboard/tenant/favorites', label: "Favorites" },
//             { icon: User, href: '/dashboard/tenant/profile', label: "Profile" },
//         ];
//     } else if (userRole === 'owner') {
//         navItems = [
//             { icon: House, href: '/dashboard/owner', label: "Home" },
//             { icon: Search, href: '/dashboard/owner/my-properties', label: "My Properties" },
//             { icon: PlusCircle, href: '/dashboard/owner/add-property', label: "Add a New Property" },
//             { icon: FileText, href: '/dashboard/owner/booking-requests', label: "Booking Requests" },
//             { icon: User, href: '/dashboard/owner/profile', label: "Profile" },
//         ];
//     } else if (userRole === 'admin') {
//         navItems = [
//             { icon: LayoutDashboard, href: '/dashboard/admin', label: "Dashboard Home" },
//             { icon: Users, href: '/dashboard/admin/all-users', label: "All Users" },
//             { icon: Building, href: '/dashboard/admin/all-properties', label: "All Properties" },
//             { icon: BookOpen, href: '/dashboard/admin/all-bookings', label: "All Bookings" },
//             { icon: CreditCard, href: '/dashboard/admin/transactions', label: "Transactions" },
//             { icon: User, href: '/dashboard/admin/profile', label: "Profile" },
//         ];
//     }

//     const navContent = (
//         <nav className="flex flex-col gap-1">
//             {navItems.map((item) => {
//                 const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
//                 return (
//                     <Link
//                         href={item.href}
//                         key={item.label}
//                         onClick={() => setIsOpen(false)}
//                         className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive
//                             ? "bg-primary text-primary-foreground hover:bg-primary/90"
//                             : "text-foreground hover:bg-default"
//                             }`}
//                     >
//                         <item.icon className="size-5 shrink-0" />
//                         <span className="truncate">{item.label}</span>
//                     </Link>
//                 );
//             })}
//         </nav>
//     );

//     return (
//         <>
//             {/* Desktop Sidebar */}
//             <aside className="hidden w-64 shrink-0 border-r border-default p-4 lg:block h-screen sticky top-0">
//                 <div className="mb-6 px-3">
//                     <h2 className="text-lg font-semibold capitalize">{userRole} Dashboard</h2>
//                     {session?.user?.name && (
//                         <p className="text-sm text-muted-foreground mt-1">
//                             Welcome, {session.user.name}
//                         </p>
//                     )}
//                 </div>
//                 {navContent}
//             </aside>

//             {/* Mobile Drawer Trigger - এখন আর সাইডবারের সাথে ওভারল্যাপ করবে না */}
//             <div className="lg:hidden fixed top-4 left-4 z-50">
//                 <Button
//                     variant="light"
//                     className="flex items-center gap-2 bg-white shadow-md"
//                     onPress={() => setIsOpen(true)}
//                 >
//                     <Menu className="size-5" />
//                     <span className="text-sm">Menu</span>
//                 </Button>
//             </div>

//             {/* Mobile Drawer */}
//             <Drawer isOpen={isOpen} onOpenChange={setIsOpen} placement="left" size="xs">
//                 <Drawer.Content>
//                     <div className="p-4 min-w-[280px]">
//                         <div className="flex items-center justify-between mb-6">
//                             <div>
//                                 <h2 className="text-lg font-semibold capitalize">{userRole} Dashboard</h2>
//                                 {session?.user?.name && (
//                                     <p className="text-sm text-muted-foreground mt-1">
//                                         Welcome, {session.user.name}
//                                     </p>
//                                 )}
//                             </div>
//                             <Button
//                                 isIconOnly
//                                 variant="light"
//                                 onPress={() => setIsOpen(false)}
//                             >
//                                 <X className="size-5" />
//                             </Button>
//                         </div>
//                         {navContent}
//                     </div>
//                 </Drawer.Content>
//             </Drawer>
//         </>
//     );
// }



"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    House,
    Search,
    PlusCircle,
    FileText,
    User,
    CalendarCheck,
    Heart,
    LayoutDashboard,
    Users,
    Building,
    BookOpen,
    CreditCard,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

export default function DashboardSidebar() {
    const pathname = usePathname();
    const { data: session, isPending } = useSession();
    const [isOpen, setIsOpen] = useState(false);

    const userRole = session?.user?.role?.toLowerCase() || 'tenant';

    if (isPending) {
        return (
            <>
                {/* Loading state eo mobile header dekhano */}
                <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b z-40 flex items-center px-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
                <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r p-4 h-screen sticky top-0">
                    <div className="flex items-center justify-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </aside>
            </>
        );
    }

    let navItems = [];

    if (userRole === 'tenant') {
        navItems = [
            { icon: House, href: '/dashboard/tenant', label: "Home" },
            { icon: CalendarCheck, href: '/dashboard/tenant/my-bookings', label: "My Bookings" },
            { icon: Heart, href: '/dashboard/tenant/favorites', label: "Favorites" },
            { icon: User, href: '/dashboard/tenant/profile', label: "Profile" },
        ];
    } else if (userRole === 'owner') {
        navItems = [
            { icon: House, href: '/dashboard/owner', label: "Home" },
            { icon: Search, href: '/dashboard/owner/my-properties', label: "My Properties" },
            { icon: PlusCircle, href: '/dashboard/owner/add-property', label: "Add a New Property" },
            { icon: FileText, href: '/dashboard/owner/booking-requests', label: "Booking Requests" },
            { icon: User, href: '/dashboard/owner/profile', label: "Profile" },
        ];
    } else if (userRole === 'admin') {
        navItems = [
            { icon: LayoutDashboard, href: '/dashboard/admin', label: "Dashboard Home" },
            { icon: Users, href: '/dashboard/admin/all-users', label: "All Users" },
            { icon: Building, href: '/dashboard/admin/all-properties', label: "All Properties" },
            { icon: BookOpen, href: '/dashboard/admin/all-bookings', label: "All Bookings" },
            { icon: CreditCard, href: '/dashboard/admin/transactions', label: "Transactions" },
            { icon: User, href: '/dashboard/admin/profile', label: "Profile" },
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
            {/* Mobile Header Bar - Always visible on mobile */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white dark:bg-gray-800 border-b border-default flex items-center px-4 z-40 shadow-sm">
                <Button
                    variant="light"
                    isIconOnly
                    onPress={() => setIsOpen(true)}
                    className="mr-3"
                    aria-label="Open menu"
                >
                    <Menu className="size-5" />
                </Button>
                <div>
                    <h2 className="text-base font-semibold capitalize">{userRole} Dashboard</h2>
                    {session?.user?.name && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Welcome, {session.user.name}
                        </p>
                    )}
                </div>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-default p-4 h-screen sticky top-0 overflow-y-auto">
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
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />
                    {/* Drawer Panel */}
                    <div className="absolute left-0 top-0 bottom-0 w-[280px] max-w-[80vw] bg-white dark:bg-gray-800 shadow-xl transform transition-transform">
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-lg font-semibold capitalize">{userRole} Dashboard</h2>
                                    {session?.user?.name && (
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Welcome, {session.user.name}
                                        </p>
                                    )}
                                </div>
                                <Button
                                    isIconOnly
                                    variant="light"
                                    onPress={() => setIsOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <X className="size-5" />
                                </Button>
                            </div>
                            {navContent}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

