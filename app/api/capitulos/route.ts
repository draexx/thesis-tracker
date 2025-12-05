import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { z } from "zod"

const createChapterSchema = z.object({
    tesisId: z.string().uuid(),
    titulo: z.string().min(3),
    numeroCapitulo: z.number().int().positive(),
})

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        const body = await req.json()
        const result = createChapterSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { message: "Invalid input", errors: result.error.flatten() },
                { status: 400 }
            )
        }

        // Verify advisor ownership of thesis
        const tesis = await prisma.tesis.findUnique({
            where: { id: result.data.tesisId },
            select: { asesorId: true },
        })

        if (!tesis) {
            return NextResponse.json({ message: "Thesis not found" }, { status: 404 })
        }

        if (tesis.asesorId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        // Create chapter
        // Need to determine order, usually max order + 1 or just use numeroCapitulo
        const newChapter = await prisma.capitulo.create({
            data: {
                tesisId: result.data.tesisId,
                titulo: result.data.titulo,
                numeroCapitulo: result.data.numeroCapitulo,
                orden: result.data.numeroCapitulo, // Defaulting order to chapter number
            },
        })

        return NextResponse.json(newChapter)
    } catch (error) {
        console.error("Error creating chapter:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
