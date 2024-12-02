import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_SECRET);

const LOGIN_PATH = '/login';
const REGISTER_PATH = '/register';
const UNAUTHORIZED_PATH = '/unauthorized';

interface User {
    role: string;
}

async function verifyToken(token: string): Promise<User | null> {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as unknown as User;
    } catch (error) {
        console.error('Failed to verify token:', error);
        return null;
    }
}

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    // Redirect authenticated users away from login/register pages
    if (token && (pathname.startsWith(LOGIN_PATH) || pathname.startsWith(REGISTER_PATH))) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    // Redirect unauthenticated users to login for protected routes
    if (!token) {
        if (!pathname.startsWith(LOGIN_PATH) && !pathname.startsWith(REGISTER_PATH)) {
            return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
        }
        return NextResponse.next();
    }

    // Verify token and get the user
    const user = await verifyToken(token);
    if (!user) {
        return NextResponse.redirect(new URL(LOGIN_PATH, req.url));
    }

    // Role based access control
    if (pathname.startsWith('/admin') && user.role !== 'admin') {
        return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, req.url));
    }

    if (pathname.startsWith('/trainer') && user.role !== 'trainer') {
        return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, req.url));
    }

    if (pathname.startsWith('/trainee') && user.role !== 'trainee') {
        return NextResponse.redirect(new URL(UNAUTHORIZED_PATH, req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/trainer/:path*',
        '/trainee/:path*',
        '/login',
        '/register',
    ],
};
