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

        // Verify ownership
        const tesis = await prisma.tesis.findUnique({
            where: { id: params.id },
            select: { estudianteId: true, porcentajeGeneral: true },
        })

        if (!tesis) {
            return NextResponse.json({ message: "Thesis not found" }, { status: 404 })
        }

        if (tesis.estudianteId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        // Update thesis and create activity record
        const [updatedTesis] = await prisma.$transaction([
            prisma.tesis.update({
                where: { id: params.id },
                data: { porcentajeGeneral: result.data.porcentaje },
            }),
            prisma.actividadEstudiante.create({
                data: {
                    tesisId: params.id,
                    tipo: "ACTUALIZACION_PORCENTAJE",
                    descripcion: `Actualizó el porcentaje general de ${tesis.porcentajeGeneral}% a ${result.data.porcentaje}%`,
                    valorAnterior: { porcentaje: tesis.porcentajeGeneral },
                    valorNuevo: { porcentaje: result.data.porcentaje },
                },
            }),
        ])

        return NextResponse.json(updatedTesis)
    } catch (error) {
        console.error("Error updating thesis percentage:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
