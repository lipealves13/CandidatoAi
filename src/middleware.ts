import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;

    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    const hostname = req.headers.get("host") || "";

    // Get the default root domain, e.g. "localhost:3000" or platform domain.
    // In production, this would be process.env.NEXT_PUBLIC_ROOT_DOMAIN
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost:3000";

    // Define allowed domains (including localhost for development)
    const isLocalhost = hostname.includes("localhost");

    let domain = hostname.replace(`.${rootDomain}`, "");

    // Custom domain routing
    // If the hostname is strictly different from the root domain, it's a tenant.
    if (
        hostname !== rootDomain &&
        !hostname.startsWith("www.") &&
        (isLocalhost ? domain !== "localhost:3000" : true)
    ) {
        // We rewrite the request to the `/[domain]/path` sub-route in our App Router
        return NextResponse.rewrite(
            new URL(`/${domain}${url.pathname}${url.search}`, req.url)
        );
    }

    return NextResponse.next();
}
