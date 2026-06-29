// lib/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { jwt } from "better-auth/plugins";

let authInstance = null;

async function getAuth() {
    if (authInstance) {
        return authInstance;
    }

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db('RentNest');

    const JWT_SECRET = process.env.BETTER_AUTH_SECRET;

    authInstance = betterAuth({
        database: mongodbAdapter(db, { client }),
        secret: JWT_SECRET,
        session: {
            expiresIn: 60 * 60 * 24 * 7,
            updateAge: 60 * 60 * 24,
            cookieCache: {
                enabled: true,
                strategy: 'jwt',
                maxAge: 7 * 24 * 60 * 60
            }
        },
        emailAndPassword: {
            enabled: true,
            autoSignIn: true,
        },
        socialProviders: {
            google: {
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                mapProfileToUser: (profile) => ({
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    role: "tenant",
                }),
            }
        },
        user: {
            additionalFields: {
                role: {
                    type: "string",
                    defaultValue: "tenant",
                    required: true,
                    input: true,
                    enum: ["tenant", "owner", "admin"],
                },
                isBlocked: {
                    type: "boolean",
                    defaultValue: false,
                    required: true,
                    input: false,
                },
                phone: {
                    type: "string",
                    required: false,
                    input: true,
                },
            },
        },
        account: {
            accountLinking: {
                enabled: true,
                trustedProviders: ["google"],
            },
        },
        advanced: {
            cookiePrefix: 'rentnest',
            defaultCookieAttributes: {
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                httpOnly: true,
            },
        },
        rateLimiting: {
            enabled: true,
            window: 60,
            max: 100,
        },
        plugins: [
            jwt({
                jwt: {
                    expiresIn: '7d',
                    secret: JWT_SECRET,
                },
                cookie: {
                    name: 'rentnest_jwt',
                    maxAge: 7 * 24 * 60 * 60,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    httpOnly: true,
                }
            })
        ],
    });

    console.log('✅ Better Auth initialized with JWT plugin');
    return authInstance;
}

// ✅ সঠিক export - auth object
export const auth = {
    handler: async (request, context) => {
        try {
            const authInstance = await getAuth();
            return authInstance.handler(request, context);
        } catch (error) {
            console.error('❌ Auth handler error:', error);
            return new Response(
                JSON.stringify({
                    error: 'Authentication service temporarily unavailable',
                    details: error.message
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }
    }
};

export async function checkMongoConnection() {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        return { connected: true };
    } catch (error) {
        console.error('❌ MongoDB connection check failed:', error);
        return { connected: false, error: error.message };
    }
}