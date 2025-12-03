import { useSession } from "next-auth/react"
import { Rol } from "@prisma/client"

export function useAuth() {
    const { data: session, status } = useSession()

    const isAuthenticated = status === "authenticated"
    const isLoading = status === "loading"
    const user = session?.user

    const hasRole = (role: Rol) => {
        return user?.rol === role
    }

    return {
        session,
        user,
        isAuthenticated,
        isLoading,
        hasRole,
        isStudent: hasRole("ESTUDIANTE"),
        isAdvisor: hasRole("ASESOR"),
    }
}
