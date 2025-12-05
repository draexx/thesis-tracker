import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        // Intentar una consulta simple
        const userCount = await prisma.user.count()

        // Intentar listar tablas (esto es específico de PostgreSQL)
        const tables = await prisma.$queryRaw`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `

        return NextResponse.json({
            status: "ok",
            message: "Conexión exitosa a la base de datos",
            userCount,
            tables,
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL,
                // No mostrar la URL completa por seguridad, solo el host
                host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0]
            }
        })
    } catch (error) {
        console.error("Database connection error:", error)
        return NextResponse.json({
            status: "error",
            message: "Error conectando a la base de datos",
            error: error instanceof Error ? error.message : String(error),
            env: {
                hasDatabaseUrl: !!process.env.DATABASE_URL
            }
        }, { status: 500 })
    }
}
