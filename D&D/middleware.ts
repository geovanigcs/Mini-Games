import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rotas que requerem autenticação
const protectedRoutes = ['/dashboard', '/character']

// Rotas públicas que sempre devem ser acessíveis
const publicRoutes = ['/', '/auth', '/api', '/_next']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Permitir acesso a rotas públicas e assets
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Para rotas protegidas, permitir o acesso e deixar o cliente verificar no useEffect
  // O controle de autenticação será feito no lado do cliente
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Permitir acesso, mas a verificação será feita no componente
    return NextResponse.next()
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
