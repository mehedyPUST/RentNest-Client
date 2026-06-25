// app/payment/success/page.jsx
import PaymentSuccessContent from '@/components/PaymentSuccessContent';
import { Suspense } from 'react';


// ✅ Dynamic rendering - Build সময় prerender হবে না
export const dynamic = 'force-dynamic';

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading payment details...</p>
                </div>
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}