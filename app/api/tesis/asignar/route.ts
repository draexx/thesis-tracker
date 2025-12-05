import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { z } from "zod"

const asignarSchema = z.object({
    emailEstudiante: z.string().email(),
    tituloTesis: z.string().min(5),
})

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json(
                { error: "No autorizado. Solo los asesores pueden asignar tesis." },
                { status: 401 }
            )
        }

        const body = await req.json()
        const result = asignarSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: result.error.issues },
                { status: 400 }
            )
        }

        const { emailEstudiante, tituloTesis } = result.data

        // 1. Buscar estudiante
        const estudiante = await prisma.user.findUnique({
            where: { email: emailEstudiante },
        })

        if (!estudiante) {
            return NextResponse.json(
                { error: "No se encontró un usuario con ese email." },
                { status: 404 }
            )
        }

        if (estudiante.rol !== "ESTUDIANTE") {
            return NextResponse.json(
                { error: "El usuario encontrado no es un estudiante." },
                { status: 400 }
            )
        }

        // 2. Verificar si ya tiene tesis
        const tesisExistente = await prisma.tesis.findUnique({
            where: { estudianteId: estudiante.id },
        })

        if (tesisExistente) {
            return NextResponse.json(
                { error: "Este estudiante ya tiene una tesis asignada." },
                { status: 409 }
            )
        }

        // 3. Crear tesis
        // Necesitamos una estructura de capítulos por defecto
        const plantillaIndiceDefault = [
            { numero: 1, titulo: "Introducción" },
            { numero: 2, titulo: "Marco Teórico" },
            { numero: 3, titulo: "Metodología" },
            { numero: 4, titulo: "Resultados" },
            { numero: 5, titulo: "Discusión y Conclusiones" },
        ]

        const nuevaTesis = await prisma.tesis.create({
            data: {
                titulo: tituloTesis,
                estudianteId: estudiante.id,
                asesorId: session.user.id,
                plantillaIndice: plantillaIndiceDefault,
                capitulos: {
                    create: plantillaIndiceDefault.map((cap, index) => ({
                        numeroCapitulo: cap.numero,
                        titulo: cap.titulo,
                        orden: index + 1,
                    })),
                },
                hitos: {
                    create: [
                        {
                            titulo: "Entrega de Anteproyecto",
                            fechaLimite: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 días
                        },
                    ],
                },
            },
        })

        return NextResponse.json({
            success: true,
            tesisId: nuevaTesis.id,
            message: "Tesis asignada correctamente",
        })
    } catch (error) {
        console.error("Error al asignar tesis:", error)
        return NextResponse.json(
            { error: "Error interno del servidor al asignar tesis" },
            { status: 500 }
        )
    }
}
