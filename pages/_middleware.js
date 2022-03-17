import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  // Token will exist if user is logged in
  const token = await getToken({ req, secret: process.env.SECRET })
  const { pathname } = req.nextUrl

  // Redirect to home if the have token and his trying to access the login page
  if (token && pathname == '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/'

    return NextResponse.redirect(url)
  }

  // Allow the requests if the following is true...
  // 1) Its a requests for next-auth session & provider fetching
  // 2) the token exists

  if (pathname.includes('/api/auth') || token) {
    return NextResponse.next()
  }

  // Redirect them to login if the dont have token AND are requesting a protected route
  if (!token && pathname !== '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    
    return NextResponse.redirect(url)
  }
}