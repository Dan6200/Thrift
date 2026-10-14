import type { NextRequest } from 'next/server'
import { updateSession } from './auth/server/definitions'

// Define the public paths that require no authentication
// Update these paths as needed for your application
const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/callback',
  '/',
  '/products',
  '/stores',
  '/shopping-cart',
]

// Define paths that MUST be protected
// Update these paths as needed for your application
const PROTECTED_PATHS = [
  '/vendor/dashboard',
  '/vendor/admin/dashboard',
  '/profile',
  '/settings',
  '/dashboard',
  '/create-store',
  '/vendor-analytics',
  '/orders',
  '/checkout',
  '/account',
]

/**
 * Middleware to check for the presence of the Supabase session
 * and protect routes.
 */
export async function middleware(request: NextRequest) {
  return updateSession(request, PUBLIC_PATHS, PROTECTED_PATHS)
}

/**
 * Configuration to define which paths the middleware should run on.
 * It's generally best to exclude static assets, API routes, and Next.js internal files.
 */
export const config = {
  // Update matcher to include all paths that might need auth checks,
  // excluding static files and API routes that don't need middleware.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
