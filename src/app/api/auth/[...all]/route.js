// import { auth } from "@/lib/auth"; // path to your auth file
// import { toNextJsHandler } from "better-auth/next-js";

// export const { POST, GET } = toNextJsHandler(auth);


// app/api/auth/[...all]/route.js
import { auth } from "@/lib/auth";

export async function GET(request, context) {
    return auth.handler(request, context);
}

export async function POST(request, context) {
    return auth.handler(request, context);
}