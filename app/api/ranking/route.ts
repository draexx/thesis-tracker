import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma/client"

export const revalidate = 300 // ISR: Revalidate every 5 minutes

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const programa = searchParams.get("programa")
        const cohorte = searchParams.get("cohorte")
        const search = searchParams.get("search")

        // Build where clause
        const where: any = {
            visibilidadPublica: true,
            estudiante: {
                ocultarDelRanking: false,
            },
        }

        // Add filters
        if (programa && programa !== "todos") {
            where.estudiante.programa = programa
        }

        if (cohorte && cohorte !== "todos") {
            where.estudiante.cohorte = cohorte
        }

        if (search) {
            where.estudiante.nombre = {
                contains: search,
                mode: "insensitive",
            }
        }

        // Fetch ranking data
        const tesis = await prisma.tesis.findMany({
            where,
            select: {
                id: true,
                titulo: true,
                porcentajeGeneral: true,
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        avatar: true,
                        programa: true,
                        cohorte: true,
                    },
                },
            },
            orderBy: {
                porcentajeGeneral: "desc",
            },
        })

        // Transform data
        const entries = tesis.map((t) => ({
            id: t.estudiante.id,
            nombre: t.estudiante.nombre,
            avatar: t.estudiante.avatar,
            titulo: t.titulo,
            porcentaje: Math.round(t.porcentajeGeneral),
            programa: t.estudiante.programa,
            cohorte: t.estudiante.cohorte,
        }))

        // Calculate statistics
        const porcentajes = entries.map((e) => e.porcentaje)
        const promedio =
            porcentajes.length > 0
                ? porcentajes.reduce((a, b) => a + b, 0) / porcentajes.length
                : 0

        // Calculate median
        const sorted = [...porcentajes].sort((a, b) => a - b)
        const mediana =
            sorted.length > 0
                ? sorted.length % 2 === 0
                    ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
                    : sorted[Math.floor(sorted.length / 2)]
                : 0

        // Calculate completion rate (students > 50%)
        const tasaProgreso =
            porcentajes.length > 0
                ? (porcentajes.filter((p) => p > 50).length / porcentajes.length) * 100
                : 0

        const statistics = {
            promedio,
            mediana,
            tasaProgreso,
            totalParticipantes: entries.length,
        }

        // Get unique programs and cohortes for filters
        const allUsers = await prisma.user.findMany({
            where: {
                rol: "ESTUDIANTE",
            },
            select: {
                programa: true,
                cohorte: true,
            },
        })

        const programas = [...new Set(allUsers.map((u) => u.programa))].sort()
        const cohortes = [...new Set(allUsers.map((u) => u.cohorte))].sort()

        return NextResponse.json({
            entries,
            statistics,
            filters: {
                programas,
                cohortes,
            },
        })
    } catch (error) {
        console.error("Error fetching ranking:", error)
        return NextResponse.json(
            { error: "Error al obtener el ranking" },
            { status: 500 }
        )
    }
}
