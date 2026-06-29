// app/access-denied/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AccessDenied from '@/components/AccessDenied';

export default function AccessDeniedPage() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    const role = searchParams?.get('role') || 'tenant';

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return <AccessDenied role={role} />;
}