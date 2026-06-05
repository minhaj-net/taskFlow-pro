import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const hasAuth = request.cookies.has('tfp_auth')
  const roleCookie = request.cookies.get('tfp_role')?.value

  // 1. If not authenticated and trying to access dashboard, redirect to login
  if (path.startsWith('/dashboard') && !hasAuth) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 2. If authenticated and trying to access login/register, redirect to dashboard
  //    (but allow / so logged-in users can visit the marketing homepage)
  if ((path === '/login' || path === '/register') && hasAuth) {
    const role = roleCookie || 'member'
    const dashboardPath = role === 'admin' ? '/dashboard/admin' : role === 'manager' ? '/dashboard/manager' : '/dashboard/member'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // 3. Handle dashboard base route /dashboard
  if (path === '/dashboard' && hasAuth) {
    const role = roleCookie || 'member'
    const dashboardPath = role === 'admin' ? '/dashboard/admin' : role === 'manager' ? '/dashboard/manager' : '/dashboard/member'
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  // 4. Role Guards
  if (hasAuth && roleCookie) {
    // Admin only pages
    const isAdminPage = path.startsWith('/dashboard/admin') || path.startsWith('/dashboard/users')
    // Manager only pages
    const isManagerPage = path.startsWith('/dashboard/manager')
    // Member only pages
    const isMemberPage = path.startsWith('/dashboard/member')
    
    // Shared Admin/Manager pages (blocked for Member)
    const isManagerAdminPage = path.startsWith('/dashboard/analytics') || 
                               path.startsWith('/dashboard/activity') || 
                               path.startsWith('/dashboard/team')

    if (roleCookie === 'member') {
      if (isAdminPage || isManagerPage || isManagerAdminPage) {
        return NextResponse.redirect(new URL('/dashboard/member', request.url))
      }
    } else if (roleCookie === 'manager') {
      if (isAdminPage || isMemberPage) {
        return NextResponse.redirect(new URL('/dashboard/manager', request.url))
      }
    } else if (roleCookie === 'admin') {
      if (isManagerPage || isMemberPage) {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
  ],
}
