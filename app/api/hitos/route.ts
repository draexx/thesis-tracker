import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { tesisId, titulo, descripcion, fechaLimite, capituloId } = body

        if (!tesisId || !titulo || !fechaLimite) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            )
        }

        // Verificar que la tesis pertenece al asesor
        const tesis = await prisma.tesis.findUnique({
            where: { id: tesisId },
            select: { asesorId: true },
        })

        if (!tesis || tesis.asesorId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Crear hito
        const hito = await prisma.hito.create({
            data: {
                tesisId,
                titulo,
                descripcion,
                fechaLimite: new Date(fechaLimite),
                capituloId: capituloId || null,
            },
            include: {
                capitulo: {
                    select: {
                        titulo: true,
                        numeroCapitulo: true,
                    },
                },
            },
        })

        // Crear actividad
        await prisma.actividadEstudiante.create({
            data: {
                tesisId,
                tipo: "ACTUALIZACION_CAPITULO",
                descripcion: `Nuevo hito creado: ${titulo}`,
            },
        })

        return NextResponse.json({ hito })
    } catch (error) {
        console.error("Error creating hito:", error)
        return NextResponse.json(
            { error: "Error al crear hito" },
            { status: 500 }
        )
    }
}
