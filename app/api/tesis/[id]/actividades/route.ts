import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const tesisId = params.id
        const searchParams = request.nextUrl.searchParams
        const tipo = searchParams.get("tipo")
        const limit = parseInt(searchParams.get("limit") || "50")
        const offset = parseInt(searchParams.get("offset") || "0")

        // Verificar acceso a la tesis
        const tesis = await prisma.tesis.findUnique({
            where: { id: tesisId },
            select: {
                asesorId: true,
                estudianteId: true,
            },
        })

        if (!tesis) {
            return NextResponse.json({ error: "Tesis no encontrada" }, { status: 404 })
        }

        const esAsesor = session.user.rol === "ASESOR" && tesis.asesorId === session.user.id
        const esEstudiante = session.user.rol === "ESTUDIANTE" && tesis.estudianteId === session.user.id

        if (!esAsesor && !esEstudiante) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Construir filtro
        const where: any = { tesisId }
        if (tipo) {
            where.tipo = tipo
        }

        // Obtener actividades
        const actividades = await prisma.actividadEstudiante.findMany({
            where,
            orderBy: {
                timestamp: "desc",
            },
            take: limit,
            skip: offset,
        })

        // Contar total
        const total = await prisma.actividadEstudiante.count({ where })

        return NextResponse.json({
            actividades,
            total,
            limit,
            offset,
        })
    } catch (error) {
        console.error("Error fetching actividades:", error)
        return NextResponse.json(
            { error: "Error al obtener actividades" },
            { status: 500 }
        )
    }
}
