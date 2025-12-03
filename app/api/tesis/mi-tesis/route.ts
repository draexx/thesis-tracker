import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
        }

        if (session.user.rol !== "ESTUDIANTE") {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        // Fetch thesis with all related data
        const tesis = await prisma.tesis.findUnique({
            where: {
                estudianteId: session.user.id,
            },
            include: {
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                        avatar: true,
                    },
                },
                asesor: {
                    select: {
                        id: true,
                        nombre: true,
                        email: true,
                    },
                },
                capitulos: {
                    orderBy: {
                        orden: 'asc',
                    },
                    include: {
                        comentarios: {
                            include: {
                                autor: {
                                    select: {
                                        nombre: true,
                                        avatar: true,
                                    },
                                },
                            },
                            orderBy: {
                                createdAt: 'desc',
                            },
                        },
                    },
                },
                hitos: {
                    orderBy: {
                        fechaLimite: 'asc',
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
                        timestamp: 'desc',
                    },
                    take: 10,
                },
            },
        })

        if (!tesis) {
            return NextResponse.json({ message: "Thesis not found" }, { status: 404 })
        }

        return NextResponse.json(tesis)
    } catch (error) {
        console.error("Error fetching thesis:", error)
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )
    }
}
