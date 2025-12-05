import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { z } from "zod"

const updateSchema = z.object({
    porcentaje: z.number().min(0).max(100),
})

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const result = updateSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.flatten() },
                { status: 400 }
            )
        }

        // Verify ownership through thesis
        const capitulo = await prisma.capitulo.findUnique({
            where: { id: params.id },
            include: {
                tesis: {
                    select: { estudianteId: true, id: true },
                },
            },
        })

        if (!capitulo) {
            return NextResponse.json({ message: "Chapter not found" }, { status: 404 })
        }

        if (capitulo.tesis.estudianteId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        // Update chapter and create activity record
        const [updatedCapitulo] = await prisma.$transaction([
            prisma.capitulo.update({
                where: { id: params.id },
                data: { porcentajeCompletado: result.data.porcentaje },
            }),
            prisma.actividadEstudiante.create({
                data: {
                    tesisId: capitulo.tesis.id,
                    tipo: "ACTUALIZACION_CAPITULO",
                    descripcion: `Actualizó el capítulo ${capitulo.numeroCapitulo}: ${capitulo.titulo} a ${result.data.porcentaje}%`,
                    valorAnterior: {
                        capituloId: capitulo.id,
                        porcentaje: capitulo.porcentajeCompletado
                    },
                    valorNuevo: {
                        capituloId: capitulo.id,
                        porcentaje: result.data.porcentaje
                    },
                },
            }),
        ])



        // Recalculate general progress asynchronously
        await updateTesisProgress(capitulo.tesis.id)

        return NextResponse.json(updatedCapitulo)
    } catch (error) {
        console.error("Error updating chapter percentage:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

async function updateTesisProgress(tesisId: string) {
    try {
        const capitulos = await prisma.capitulo.findMany({
            where: { tesisId },
            select: { porcentajeCompletado: true },
        })

        if (capitulos.length === 0) return

        const totalPorcentaje = capitulos.reduce(
            (acc, curr) => acc + curr.porcentajeCompletado,
            0
        )
        const promedio = Math.round(totalPorcentaje / capitulos.length)

        await prisma.tesis.update({
            where: { id: tesisId },
            data: { porcentajeGeneral: promedio },
        })
    } catch (error) {
        console.error("Error recalculating thesis progress:", error)
    }
}
