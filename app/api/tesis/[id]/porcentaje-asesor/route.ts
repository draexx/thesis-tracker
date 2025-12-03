import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const tesisId = params.id
        const body = await request.json()
        const { porcentaje, justificacion } = body

        if (porcentaje === undefined || !justificacion) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            )
        }

        if (porcentaje < 0 || porcentaje > 100) {
            return NextResponse.json(
                { error: "El porcentaje debe estar entre 0 y 100" },
                { status: 400 }
            )
        }

        // Verificar que la tesis pertenece al asesor
        const tesis = await prisma.tesis.findUnique({
            where: { id: tesisId },
            select: {
                id: true,
                asesorId: true,
                porcentajeGeneral: true,
                capitulos: {
                    select: {
                        id: true,
                        numeroCapitulo: true,
                    },
                    orderBy: {
                        orden: "asc",
                    },
                    take: 1,
                },
            },
        })

        if (!tesis || tesis.asesorId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        const porcentajeAnterior = tesis.porcentajeGeneral

        // Actualizar porcentaje
        const tesisActualizada = await prisma.tesis.update({
            where: { id: tesisId },
            data: {
                porcentajeGeneral: porcentaje,
            },
        })

        // Crear comentario con la justificación en el primer capítulo
        if (tesis.capitulos.length > 0) {
            await prisma.comentario.create({
                data: {
                    capituloId: tesis.capitulos[0].id,
                    autorId: session.user.id,
                    contenido: `**Ajuste de porcentaje general por el asesor**\n\nPorcentaje anterior: ${porcentajeAnterior}%\nNuevo porcentaje: ${porcentaje}%\n\nJustificación: ${justificacion}`,
                },
            })
        }

        // Crear actividad
        await prisma.actividadEstudiante.create({
            data: {
                tesisId,
                tipo: "ACTUALIZACION_PORCENTAJE",
                descripcion: `Porcentaje general actualizado por el asesor`,
                valorAnterior: { porcentaje: porcentajeAnterior },
                valorNuevo: { porcentaje, justificacion },
            },
        })

        return NextResponse.json({ tesis: tesisActualizada })
    } catch (error) {
        console.error("Error updating porcentaje:", error)
        return NextResponse.json(
            { error: "Error al actualizar porcentaje" },
            { status: 500 }
        )
    }
}
