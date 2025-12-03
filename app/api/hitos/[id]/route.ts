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

        const hitoId = params.id
        const body = await request.json()

        // Verificar que el hito existe y pertenece a una tesis del asesor
        const hito = await prisma.hito.findUnique({
            where: { id: hitoId },
            include: {
                tesis: {
                    select: {
                        id: true,
                        asesorId: true,
                    },
                },
            },
        })

        if (!hito || hito.tesis.asesorId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Actualizar hito
        const hitoActualizado = await prisma.hito.update({
            where: { id: hitoId },
            data: {
                titulo: body.titulo,
                descripcion: body.descripcion,
                fechaLimite: body.fechaLimite ? new Date(body.fechaLimite) : undefined,
                capituloId: body.capituloId !== undefined ? body.capituloId : undefined,
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

        return NextResponse.json({ hito: hitoActualizado })
    } catch (error) {
        console.error("Error updating hito:", error)
        return NextResponse.json(
            { error: "Error al actualizar hito" },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const hitoId = params.id

        // Verificar que el hito existe y pertenece a una tesis del asesor
        const hito = await prisma.hito.findUnique({
            where: { id: hitoId },
            include: {
                tesis: {
                    select: {
                        asesorId: true,
                    },
                },
            },
        })

        if (!hito || hito.tesis.asesorId !== session.user.id) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Eliminar hito
        await prisma.hito.delete({
            where: { id: hitoId },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error deleting hito:", error)
        return NextResponse.json(
            { error: "Error al eliminar hito" },
            { status: 500 }
        )
    }
}
