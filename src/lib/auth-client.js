// lib/auth-client.js
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        inferAdditionalFields({
            user: {
                role: { type: "string" },
                isBlocked: { type: "boolean" },
                phone: { type: "string" },
            },
        }),
    ],
});

// ✅ শুধু ক্লায়েন্ট হুক
export const {
    signIn,
    signUp,
    signOut,
    useSession,
    getSession,
} = authClient;

// ✅ Helper functions
export async function getCurrentUser() {
    try {
        const { data: session } = await getSession();
        return session?.user || null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}