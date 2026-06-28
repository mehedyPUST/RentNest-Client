// lib/auth.js

import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

// ✅ MongoDB Client - Singleton Pattern
let cachedClient = null;
let cachedDb = null;
let authInstance = null;

// ✅ MongoDB Connection Options
const MONGO_OPTIONS = {
    maxPoolSize: 5,
    minPoolSize: 1,
    maxIdleTimeMS: 30000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    serverSelectionTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
    heartbeatFrequencyMS: 10000,
};

async function getMongoClient() {
    if (cachedClient) {
        try {
            await cachedClient.db('admin').command({ ping: 1 });
            return cachedClient;
        } catch (error) {
            console.warn('⚠️ MongoDB connection lost. Reconnecting...');
            cachedClient = null;
            cachedDb = null;
        }
    }

    const client = new MongoClient(process.env.MONGODB_URI, MONGO_OPTIONS);
    await client.connect();
    console.log('✅ MongoDB connected for Better Auth');

    cachedClient = client;
    cachedDb = client.db('RentNest');

    return client;
}

async function getDb() {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await getMongoClient();
    cachedDb = client.db('RentNest');
    return cachedDb;
}

// ✅ Better Auth Instance
async function getAuth() {
    if (authInstance) {
        return authInstance;
    }

    const db = await getDb();
    const client = await getMongoClient();

    authInstance = betterAuth({
        database: mongodbAdapter(db, { client }),

        session: {
            expiresIn: 60 * 60 * 24 * 7, // 7 days
            updateAge: 60 * 60 * 24, // 1 day
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
    });

    console.log('✅ Better Auth initialized');
    return authInstance;
}

// ✅ Export auth - Server Side Handler
export const auth = {
    get handler() {
        return async (request, context) => {
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
        };
    },
};

// ✅ Health check - Server Side
export async function checkMongoConnection() {
    try {
        const client = await getMongoClient();
        await client.db('admin').command({ ping: 1 });
        return { connected: true };
    } catch (error) {
        console.error('❌ MongoDB connection check failed:', error);
        return { connected: false, error: error.message };
    }
}