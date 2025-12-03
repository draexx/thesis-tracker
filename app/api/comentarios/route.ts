import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function POST(request: NextRequest) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const body = await request.json()
        const { capituloId, contenido } = body

        if (!capituloId || !contenido) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            )
        }

        // Verificar que el capítulo existe
        const capitulo = await prisma.capitulo.findUnique({
            where: { id: capituloId },
            include: {
                tesis: {
                    select: {
                        id: true,
                        asesorId: true,
                        estudianteId: true,
                    },
                },
            },
        })

        if (!capitulo) {
            return NextResponse.json({ error: "Capítulo no encontrado" }, { status: 404 })
        }

        // Verificar que el usuario tiene acceso (asesor o estudiante de la tesis)
        const tieneAcceso =
            capitulo.tesis.asesorId === session.user.id ||
            capitulo.tesis.estudianteId === session.user.id

        if (!tieneAcceso) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        // Crear comentario
        const comentario = await prisma.comentario.create({
            data: {
                capituloId,
                autorId: session.user.id,
                contenido,
            },
            include: {
                autor: {
                    select: {
                        nombre: true,
                        avatar: true,
                        rol: true,
                    },
                },
            },
        })

        // Crear actividad si es el asesor quien comenta
        if (session.user.rol === "ASESOR") {
            await prisma.actividadEstudiante.create({
                data: {
                    tesisId: capitulo.tesis.id,
                    tipo: "ACTUALIZACION_CAPITULO",
                    descripcion: `Nuevo comentario del asesor en Capítulo ${capitulo.numeroCapitulo}`,
                },
            })
        }

        return NextResponse.json({ comentario })
    } catch (error) {
        console.error("Error creating comentario:", error)
        return NextResponse.json(
            { error: "Error al crear comentario" },
            { status: 500 }
        )
    }
}
