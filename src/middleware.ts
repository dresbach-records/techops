import { NextResponse, type NextRequest } from 'next/server'

// This middleware is now a simple pass-through.
// The previous logic for Supabase session management is deprecated as the
// frontend no longer communicates with Supabase directly.
// We can re-introduce logic here later if needed for other purposes.
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
