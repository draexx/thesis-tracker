import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const tesisId = params.id

        // Obtener tesis con todos los detalles
        const tesis = await prisma.tesis.findUnique({
            where: { id: tesisId },
            include: {
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar: true,
                        programa: true,
                        cohorte: true,
                    },
                },
                asesor: {
                    select: {
                        id: true,
                        nombre: true,
                    },
                },
                capitulos: {
                    orderBy: {
                        orden: "asc",
                    },
                    include: {
                        comentarios: {
                            include: {
                                autor: {
                                    select: {
                                        nombre: true,
                                        avatar: true,
                                        rol: true,
                                    },
                                },
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                        },
                    },
                },
                hitos: {
                    orderBy: {
                        fechaLimite: "asc",
                    },
                    include: {
                        capitulo: {
                            select: {
                                titulo: true,
                                numeroCapitulo: true,
                            },
                        },
                    },
                },
                actividades: {
                    orderBy: {
                        timestamp: "desc",
                    },
                    take: 50, // Últimas 50 actividades
                },
            },
        })

        if (!tesis) {
            return NextResponse.json({ error: "Tesis no encontrada" }, { status: 404 })
        }

        // Verificar que el usuario tenga acceso (es el asesor o el estudiante)
        const esAsesor = session.user.rol === "ASESOR" && tesis.asesorId === session.user.id
        const esEstudiante = session.user.rol === "ESTUDIANTE" && tesis.estudianteId === session.user.id

        if (!esAsesor && !esEstudiante) {
            return NextResponse.json({ error: "No autorizado" }, { status: 403 })
        }

        return NextResponse.json({ tesis })
    } catch (error) {
        console.error("Error fetching tesis detalle:", error)
        return NextResponse.json(
            { error: "Error al obtener detalle de tesis" },
            { status: 500 }
        )
    }
}
