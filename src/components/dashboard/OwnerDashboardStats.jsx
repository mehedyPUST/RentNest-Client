import { Building2, CalendarCheck, DollarSign } from "lucide-react";
import { OwnerStatCard } from "./OwnerStatCard";

export const OwnerDashboardStats = ({ statsData = [] }) => {
    // Default hardcoded data for owner
    const defaultStats = [
        {
            id: 1,
            title: "Total Earnings",
            value: "$48,250",
            icon: DollarSign,
            subtitle: "+$12,430 this month",
            trend: 15,
            color: "green"
        },
        {
            id: 2,
            title: "Total Properties",
            value: "12",
            icon: Building2,
            subtitle: "+3 new properties",
            trend: 8,
            color: "blue"
        },
        {
            id: 3,
            title: "Total Bookings",
            value: "156",
            icon: CalendarCheck,
            subtitle: "+28 confirmed bookings",
            trend: 22,
            color: "purple"
        }
    ];

    const data = statsData.length > 0 ? statsData : defaultStats;

    return (
        <div className="w-full max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Analytics Overview
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Here's what's happening with your properties
                </p>
            </div>

            {/* Stats Grid - 3 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.map((stat) => (
                    <OwnerStatCard
                        key={stat.id}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        subtitle={stat.subtitle}
                        trend={stat.trend}
                        color={stat.color || "blue"}
                    />
                ))}
            </div>
        </div>
    );
};