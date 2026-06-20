// lib/auth.js
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db('RentNest');

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),

    emailAndPassword: {
        enabled: true,
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
                input: true,           // ← Very important
                enum: ["tenant", "owner"],
            },
            isBlocked: {
                type: "boolean",
                defaultValue: false,
                required: true,
                input: false,          // Not allowed to be set by user
            },
        },
    },

    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["google"],
        },
    },
});