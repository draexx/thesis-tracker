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

        const capituloId = params.id

        // Verificar que el capítulo existe y pertenece a una tesis del asesor
        const capitulo = await prisma.capitulo.findUnique({
            where: { id: capituloId },
            include: {
                tesis: {
                    select: {
                        id: true,
                        asesorId: true,
                    },
                },
            },
        })

        if (!capitulo) {
            return NextResponse.json({ error: "Capítulo no encontrado" }, { status: 404 })
        }

        if (capitulo.tesis.asesorId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Aprobar capítulo
        const capituloActualizado = await prisma.capitulo.update({
            where: { id: capituloId },
            data: {
                aprobadoPorAsesor: true,
                fechaAprobacion: new Date(),
            },
        })

        // Crear actividad
        await prisma.actividadEstudiante.create({
            data: {
                tesisId: capitulo.tesis.id,
                tipo: "ACTUALIZACION_CAPITULO",
                descripcion: `Capítulo ${capitulo.numeroCapitulo} aprobado por el asesor`,
                valorAnterior: { aprobado: false },
                valorNuevo: { aprobado: true },
            },
        })

        return NextResponse.json({ capitulo: capituloActualizado })
    } catch (error) {
        console.error("Error approving capitulo:", error)
        return NextResponse.json(
            { error: "Error al aprobar capítulo" },
            { status: 500 }
        )
    }
}
