// app/api/checkout_sessions/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
});

export async function POST(request) {
    try {
        const body = await request.json();
        const { propertyId, propertyTitle, propertyPrice, bookingData, bookingId } = body;

        // ✅ Check for bookingId
        if (!propertyId || !propertyTitle || !propertyPrice || !bookingData) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // ✅ Create Stripe Checkout Session with bookingId in success_url
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: propertyTitle,
                            description: `Booking payment for ${propertyTitle}`,
                            metadata: {
                                propertyId: propertyId,
                                bookingId: bookingId || 'pending',
                            },
                        },
                        unit_amount: Math.round(Number(propertyPrice) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // ✅ Add bookingId to success_url
            success_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&bookingId=${bookingId || ''}`,
            cancel_url: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/payment/cancelled?bookingId=${bookingId || ''}`,
            metadata: {
                propertyId: propertyId,
                propertyTitle: propertyTitle,
                amount: String(propertyPrice),
                bookingId: bookingId || 'pending',
                bookingData: JSON.stringify(bookingData)
            },
        });

        console.log('✅ Session created:', session.id);
        console.log('✅ Booking ID:', bookingId);

        // ✅ URL পাঠাচ্ছেন কিনা confirm করুন
        return NextResponse.json({
            success: true,
            sessionId: session.id,
            url: session.url  // ← এইটা দরকার
        });

    } catch (error) {
        console.error('❌ Stripe Error:', error);
        return NextResponse.json(
            { error: error.message || 'Payment session creation failed' },
            { status: 500 }
        );
    }
}