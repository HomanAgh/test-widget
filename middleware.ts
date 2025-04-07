import { type NextRequest } from 'next/server'
import { updateSession } from './app/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Skip middleware for widget bundle files
  if (
    request.nextUrl.pathname.startsWith('/widget-bundle.js') || 
    request.nextUrl.pathname.startsWith('/widget-loader.js') || 
    request.nextUrl.pathname.startsWith('/widget-loader-combined.js') ||
    request.nextUrl.pathname.endsWith('.html')||
    request.nextUrl.pathname.startsWith('/_next/image') && request.nextUrl.searchParams.has('url')
  ) {
    return;
  }
  
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - widget bundle files
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|widget-bundle.js|widget-loader.js|widget-loader-combined.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|html)$).*)',
  ],
}