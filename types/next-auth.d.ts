import { type DefaultSession } from "next-auth"
import { Rol } from "@prisma/client"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            rol: Rol
            nombre: string
            email: string
            avatar?: string | null
            programa?: string
            cohorte?: string
        } & DefaultSession["user"]
    }

    interface User {
        id: string
        rol: Rol
        nombre: string
        email: string
        avatar?: string | null
        programa?: string
        cohorte?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        rol: Rol
        nombre: string
        email: string
        avatar?: string | null
        programa?: string
        cohorte?: string
    }
}
