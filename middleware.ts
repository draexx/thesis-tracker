import NextAuth from "next-auth"
import { authConfig } from "./lib/auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const userRole = req.auth?.user?.rol

    // Protect specific routes based on role
    if (isLoggedIn) {
        // Proteger ruta de estudiante
        if (nextUrl.pathname.startsWith("/estudiante") && userRole !== "ESTUDIANTE") {
            return NextResponse.redirect(new URL("/", nextUrl)) // Redirigir a la página principal si no tiene permiso
        }
        // Proteger ruta de asesor
        if (nextUrl.pathname.startsWith("/asesor") && userRole !== "ASESOR") {
            return NextResponse.redirect(new URL("/", nextUrl))
        }
    }

    // Redirect logged-in users away from login page
    if (isLoggedIn && nextUrl.pathname === "/login") {
        if (userRole === "ESTUDIANTE") {
            return NextResponse.redirect(new URL("/estudiante", nextUrl))
        } else if (userRole === "ASESOR") {
            return NextResponse.redirect(new URL("/asesor", nextUrl))
        }
        return NextResponse.redirect(new URL("/", nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
