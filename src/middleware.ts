import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Check if this is an admin route (but not the login page)
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    const supabase = createMiddlewareClient({ req, res })
    
    try {
      const {
        data: { session },
        error
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Middleware auth error:', error)
      }

      if (!session) {
        console.log('No session found, redirecting to login')
        // Redirect to login page if not authenticated
        const redirectUrl = new URL('/admin/login', req.url)
        redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      } else {
        console.log('Session found for user:', session.user?.email)
      }
    } catch (error) {
      console.error('Middleware error:', error)
      const redirectUrl = new URL('/admin/login', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }
  
  return res
}

export const config = {
  matcher: ['/admin', '/admin/((?!login|test-session).)*']
}
