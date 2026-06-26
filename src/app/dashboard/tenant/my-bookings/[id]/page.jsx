// app/dashboard/tenant/my-bookings/[id]/page.jsx
import BookingDetailsClient from './BookingDetailsClient';

// ✅ Next.js 15 - params কে async করে await করুন
export default async function TenantBookingDetailsPage({ params }) {
    // ✅ params কে await করুন
    const { id } = await params;

    return <BookingDetailsClient bookingId={id} />;
}