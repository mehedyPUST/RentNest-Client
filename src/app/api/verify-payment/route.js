// app/api/verify-payment/route.js
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');
        const bookingId = searchParams.get('booking_id');

        console.log('🔍 1. Verify Payment Request:', { sessionId, bookingId });

        if (!sessionId || !bookingId) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // ✅ 1 সেকেন্ড Delay যোগ করুন - Payment Process Complete হওয়ার জন্য
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('🔍 2. Fetching Stripe Session...');
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('📥 3. Stripe Session:', session);
        console.log('📥 4. Payment Status:', session.payment_status);

        if (session.payment_status === 'paid') {
            console.log('✅ 5. Payment successful! Updating booking...');

            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/bookings/${bookingId}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    paymentStatus: 'paid',
                    transactionId: session.payment_intent,
                    paymentAmount: session.amount_total / 100
                })
            });

            const data = await response.json();
            console.log('📥 6. Booking Update Response:', data);

            return NextResponse.json({
                success: true,
                message: 'Payment verified and booking updated',
                booking: data.booking,
                session: session
            });
        } else {
            console.log('❌ 5. Payment not completed:', session.payment_status);
            return NextResponse.json({
                success: false,
                message: `Payment not completed. Status: ${session.payment_status}`
            });
        }

    } catch (error) {
        console.error('❌ Error verifying payment:', error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}