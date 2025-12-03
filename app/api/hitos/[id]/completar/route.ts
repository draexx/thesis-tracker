import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Verify ownership through thesis
        const hito = await prisma.hito.findUnique({
            where: { id: params.id },
            include: {
                tesis: {
                    select: { estudianteId: true, id: true },
                },
            },
        })

        if (!hito) {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 })
        }

        if (hito.tesis.estudianteId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        const newCompletado = !hito.completado

        // Update milestone and create activity record
        const [updatedHito] = await prisma.$transaction([
            prisma.hito.update({
                where: { id: params.id },
                data: {
                    completado: newCompletado,
                    fechaCompletado: newCompletado ? new Date() : null,
                },
            }),
            prisma.actividadEstudiante.create({
                data: {
                    tesisId: hito.tesis.id,
                    tipo: "COMPLETADO_HITO",
                    descripcion: newCompletado
                        ? `Completó el hito: ${hito.titulo}`
                        : `Marcó como pendiente el hito: ${hito.titulo}`,
                    valorAnterior: { hitoId: hito.id, completado: hito.completado },
                    valorNuevo: { hitoId: hito.id, completado: newCompletado },
                },
            }),
        ])

        return NextResponse.json(updatedHito)
    } catch (error) {
        console.error("Error updating milestone:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
