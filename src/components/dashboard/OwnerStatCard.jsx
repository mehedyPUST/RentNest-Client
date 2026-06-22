import React from 'react';
import { Card } from '@heroui/react';
import {
    DollarSign,
    Building2,
    CalendarCheck,
    TrendingUp,
    TrendingDown,
    Users,
    Star,
    Clock
} from 'lucide-react';

export const OwnerStatCard = ({ title, value, icon: Icon, subtitle = "", trend = null, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400",
        green: "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400",
        purple: "bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400",
        orange: "bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400",
        red: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400",
        indigo: "bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400",
    };

    return (
        <Card
            className="bg-white dark:bg-[#18181b] border border-gray-200 dark:border-neutral-800 rounded-2xl p-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
        >
            <Card.Content className="flex flex-col gap-4 justify-between p-4">
                {/* Icon and Trend */}
                <div className="flex items-center justify-between">
                    {Icon && (
                        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${colorClasses[color]}`}>
                            <Icon width={22} height={22} />
                        </div>
                    )}
                    {trend !== null && trend !== undefined && (
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${trend > 0
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : trend < 0
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                            }`}>
                            {trend > 0 ? <TrendingUp className="w-3 h-3" /> : trend < 0 ? <TrendingDown className="w-3 h-3" /> : null}
                            {trend > 0 ? '+' : ''}{trend}%
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                        {title}
                    </span>
                    <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {value}
                    </span>
                    {subtitle && (
                        <span className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                            {subtitle}
                        </span>
                    )}
                </div>
            </Card.Content>
        </Card>
    );
};