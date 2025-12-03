import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/error",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
            const isOnApi = nextUrl.pathname.startsWith("/api") && !nextUrl.pathname.startsWith("/api/auth")

            if (isOnDashboard) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isOnApi) {
                if (isLoggedIn) return true
                return Response.json({ message: "Unauthorized" }, { status: 401 })
            }

            return true
        },
        jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.rol = user.rol
                token.nombre = user.nombre
                token.email = user.email
                token.avatar = user.avatar
                token.programa = user.programa
                token.cohorte = user.cohorte
            }
            return token
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.rol = token.rol as any
                session.user.nombre = token.nombre as string
                session.user.email = token.email as string
                session.user.avatar = token.avatar as string | null | undefined
                session.user.programa = token.programa as string | undefined
                session.user.cohorte = token.cohorte as string | undefined
            }
            return session
        },
    },
    providers: [], // Configured in auth.ts
} satisfies NextAuthConfig
