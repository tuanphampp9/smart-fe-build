import { jwtDecode } from 'jwt-decode'
import { NextResponse, NextRequest } from 'next/server'

export default async function middleware(request: NextRequest) {
  const callbackUrl = encodeURIComponent(
    `${request.nextUrl.pathname}${request.nextUrl.search}`
  )
  const token = request.cookies.get('token')?.value ?? ''
  let pathName = request.nextUrl.pathname
  //check path required login
  if (pathName.includes('/admin') || pathName.includes('/my-account')) {
    const response = NextResponse.redirect(
      new URL(`/login?redirect=${callbackUrl}`, request.url)
    )
    if (!token) {
      return response
    }
    const decoded: any = jwtDecode(token)
    console.log(decoded)
    const isExpired = decoded.exp < Date.now() / 1000
    if (isExpired) {
      const response = NextResponse.redirect(new URL(`/login`, request.nextUrl))
      response.cookies.set('token', '', {
        expires: new Date(0),
      })
      return response
    }
    if (decoded.user.roleName === 'READER' && pathName.includes('/admin')) {
      return NextResponse.redirect(new URL(`/`, request.nextUrl))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!apis|_next|_vercel|.*\\..*|market-view\\.html).*)'],
}
