import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  // Debug: Log the current path
  console.log('Middleware: Current path:', request.nextUrl.pathname)
  let supabaseResponse = NextResponse.next({
    request,
  })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll()
          console.log('Middleware: Cookies:', cookies.map(c => c.name))
          return cookies
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          console.log('Middleware: Setting cookies:', cookiesToSet.map(c => c.name))
        },
      },
    }
  )
  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // Debug: Log user state
  console.log('Middleware: User state:', user ? 'Logged in' : 'Not logged in')
  // List of public routes that don't require authentication
  const publicRoutes = [
    '/auth',           // Authentication pages
    '/login',          // Login page
    '/register',       // Registration page
    '/api/graphql',    // GraphQL API endpoint
    '/api/auth',       // Auth API endpoints
    '/embed'           // Embed routes
  ]
  // Check if the current path is under /embed
  const isEmbedRoute = request.nextUrl.pathname.startsWith('/embed')
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))
  // Debug: Log route state
  console.log('Middleware: Route type:', isPublicRoute ? 'Public' : 'Protected')
  // If user is logged in and trying to access auth pages, redirect to home
  // EXCEPT for embed routes which should always be accessible
  if (user && isPublicRoute && !request.nextUrl.pathname.startsWith('/api') && !isEmbedRoute) {
    console.log('Middleware: Redirecting authenticated user to home')
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }
  // If no user and trying to access protected route, redirect to auth
  if (!user && !isPublicRoute) {
    console.log('Middleware: Redirecting unauthenticated user to auth')
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }
  // Add auth state to headers for debugging
  supabaseResponse.headers.set('x-auth-state', user ? 'authenticated' : 'unauthenticated')
  return supabaseResponse
}