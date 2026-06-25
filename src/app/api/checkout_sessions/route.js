// app/api/checkout_sessions/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';

export async function POST(request) {
    try {
        const headersList = await headers();
        const origin = headersList.get('origin') || 'http://localhost:3000';

        const body = await request.json();
        const { propertyId, propertyTitle, propertyPrice, bookingId } = body;

        console.log('📥 1. Checkout Request:', { propertyId, propertyTitle, propertyPrice, bookingId });

        if (!propertyId || !propertyPrice) {
            return NextResponse.json(
                { error: 'Property details are required' },
                { status: 400 }
            );
        }

        if (!process.env.STRIPE_SECRET_KEY) {
            console.error('❌ 2. STRIPE_SECRET_KEY is missing!');
            return NextResponse.json(
                { error: 'Stripe secret key is not configured' },
                { status: 500 }
            );
        }

        console.log('✅ 3. Stripe Key found');

        const amountInCents = Math.round(Number(propertyPrice) * 100);
        console.log('💰 4. Amount in cents:', amountInCents);

        console.log('💰 5. Creating Stripe Checkout Session...');

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: propertyTitle || 'Rent Payment',
                            description: `Booking for ${propertyTitle}`,
                            metadata: {
                                propertyId: propertyId,
                                bookingId: bookingId || 'pending'
                            }
                        },
                        unit_amount: amountInCents,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            payment_intent_data: {
                metadata: {
                    bookingId: bookingId || 'pending'
                }
            },
            success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
            cancel_url: `${origin}/payment/cancelled`,
            metadata: {
                propertyId: propertyId,
                bookingId: bookingId || 'pending'
            },
            payment_method_types: ['card'],
        });

        console.log('✅ 6. Checkout Session Created:', session.id);
        console.log('🔗 7. Checkout URL:', session.url);

        return NextResponse.json({
            success: true,
            sessionId: session.id,
            url: session.url
        });

    } catch (err) {
        console.error('❌ Stripe error:', err);

        let errorMessage = err.message;
        if (err.type === 'StripeAuthenticationError') {
            errorMessage = 'Invalid Stripe API key. Please check your STRIPE_SECRET_KEY in .env.local';
        } else if (err.type === 'StripeInvalidRequestError') {
            errorMessage = `Invalid request: ${err.message}`;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: err.statusCode || 500 }
        );
    }
}