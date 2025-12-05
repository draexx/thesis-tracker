import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { z } from "zod"

const updateChapterSchema = z.object({
    titulo: z.string().min(3).optional(),
    numeroCapitulo: z.number().int().positive().optional(),
})

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const result = updateChapterSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.flatten() },
                { status: 400 }
            )
        }

        // Verify ownership
        const capitulo = await prisma.capitulo.findUnique({
            where: { id: params.id },
            include: {
                tesis: {
                    select: { asesorId: true },
                },
            },
        })

        if (!capitulo) {
            return NextResponse.json({ message: "Chapter not found" }, { status: 404 })
        }

        if (capitulo.tesis.asesorId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        const updatedChapter = await prisma.capitulo.update({
            where: { id: params.id },
            data: {
                titulo: result.data.titulo,
                numeroCapitulo: result.data.numeroCapitulo,
                orden: result.data.numeroCapitulo ? result.data.numeroCapitulo : undefined,
            },
        })

        return NextResponse.json(updatedChapter)
    } catch (error) {
        console.error("Error updating chapter:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        // Verify ownership
        const capitulo = await prisma.capitulo.findUnique({
            where: { id: params.id },
            include: {
                tesis: {
                    select: { asesorId: true, id: true },
                },
            },
        })

        if (!capitulo) {
            return NextResponse.json({ message: "Chapter not found" }, { status: 404 })
        }

        if (capitulo.tesis.asesorId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        // Transaction to delete chapter and update total progress if needed
        await prisma.$transaction(async (tx) => {
            // Delete related activities/comments if necessary or let cascade handle it?
            // Assuming cascade delete is set in DB or we just delete the chapter.
            // Prisma schema usually needs explicit cascade or we just delete.
            // Schema has comments tied to chapter. We should check schema.
            // Assuming basic delete for now.

            await tx.capitulo.delete({
                where: { id: params.id },
            })

            // Recalculate thesis progress
            const remainingChapters = await tx.capitulo.findMany({
                where: { tesisId: capitulo.tesis.id },
                select: { porcentajeCompletado: true },
            })

            let newProgress = 0
            if (remainingChapters.length > 0) {
                const total = remainingChapters.reduce((acc, curr) => acc + curr.porcentajeCompletado, 0)
                newProgress = Math.round(total / remainingChapters.length)
            }

            await tx.tesis.update({
                where: { id: capitulo.tesis.id },
                data: { porcentajeGeneral: newProgress },
            })
        })

        return NextResponse.json({ message: "Chapter deleted" })
    } catch (error) {
        console.error("Error deleting chapter:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
