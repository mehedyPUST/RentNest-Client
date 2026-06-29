// app/api/auth/[...all]/route.js

import { auth } from "@/lib/auth";


export async function GET(request, context) {
    return auth.handler(request, context);
}

export async function POST(request, context) {
    return auth.handler(request, context);
}