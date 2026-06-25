// app/api/stripe/verify-session/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-02-24.acacia',
});

export async function POST(request) {
    try {
        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json(
                { error: 'Session ID is required' },
                { status: 400 }
            );
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return NextResponse.json(
                { error: 'Payment not completed' },
                { status: 400 }
            );
        }

        let bookingData = {};
        try {
            if (session.metadata.bookingData) {
                bookingData = JSON.parse(session.metadata.bookingData);
            }
        } catch (e) {
            console.warn('⚠️ Failed to parse booking data:', e);
        }

        return NextResponse.json({
            success: true,
            payment_status: session.payment_status,
            metadata: {
                propertyId: session.metadata.propertyId,
                propertyTitle: session.metadata.propertyTitle,
                amount: session.metadata.amount,
                bookingData: bookingData
            }
        });

    } catch (error) {
        console.error('❌ Error verifying session:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to verify payment' },
            { status: 500 }
        );
    }
}