// app/access-denied/page.jsx
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import AccessDenied from '@/components/AccessDenied';

// This component safely uses useSearchParams inside a Suspense boundary
function AccessDeniedContent() {
    const searchParams = useSearchParams();
    const role = searchParams?.get('role') || 'tenant';

    return <AccessDenied role={role} />;
}

export default function AccessDeniedPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <AccessDeniedContent />
        </Suspense>
    );
}