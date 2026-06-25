// app/payment/cancelled/page.jsx
import Link from 'next/link';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentCancelledPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="flex justify-center mb-4">
                    <FaTimesCircle className="w-20 h-20 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Payment Cancelled
                </h1>
                <p className="text-gray-600 mb-6">
                    You cancelled the payment. Your booking is still pending.
                    You can try again later.
                </p>
                <div className="space-y-3">
                    <Link
                        href="/my-bookings"
                        className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        View My Bookings
                    </Link>
                    <Link
                        href="/all-properties"
                        className="block w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Browse More Properties
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancelledPage;