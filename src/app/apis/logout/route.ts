import { NextResponse } from 'next/server'
export async function POST() {
  const response = NextResponse.json(
    { message: 'Logout successfully' },
    { status: 200 }
  )
  response.cookies.set('token', '', {
    expires: new Date(0),
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
  })
  return response
}
