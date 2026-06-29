
import AllPropertiesContent from './AllPropertiesContent';
import { Suspense } from 'react';

// ✅ Dynamic rendering force করে - Vercel deploy এ prerender error ঠিক করার জন্য
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AllPropertiesPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading properties...</p>
                </div>
            </div>
        }>
            <AllPropertiesContent />
        </Suspense>
    );
}