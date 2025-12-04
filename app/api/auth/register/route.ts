import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/prisma/client"
import { registroSchema } from "@/lib/validations/auth"
import * as z from "zod"

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const validated = registroSchema.parse(body)

        // Verificar si el email ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: validated.email },
        })

        if (existingUser) {
            return NextResponse.json(
                { error: "Este email ya está registrado" },
                { status: 400 }
            )
        }

        // Hashear contraseña
        const hashedPassword = await hash(validated.password, 12)

        // Crear usuario
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                nombre: validated.nombre,
                rol: validated.rol,
                programa: validated.programa,
                cohorte: validated.cohorte,
            },
        })

        // Si es estudiante y proporcionó info de tesis, crearla
        if (validated.rol === "ESTUDIANTE" && validated.tituloTesis) {
            // Buscar asesor por nombre si se proporcionó
            let asesorId = user.id // Por defecto, asignar al mismo usuario temporalmente

            if (validated.nombreAsesor) {
                const asesor = await prisma.user.findFirst({
                    where: {
                        nombre: {
                            contains: validated.nombreAsesor,
                            mode: "insensitive",
                        },
                        rol: "ASESOR",
                    },
                })
                if (asesor) {
                    asesorId = asesor.id
                }
            }

            await prisma.tesis.create({
                data: {
                    titulo: validated.tituloTesis,
                    estudianteId: user.id,
                    asesorId: asesorId,
                    porcentajeGeneral: 0,
                    visibilidadPublica: validated.visibilidadPublica ?? true,
                    estado: "EN_PROGRESO",
                    plantillaIndice: {
                        capitulos: [
                            { numero: 1, titulo: "Introducción" },
                            { numero: 2, titulo: "Marco Teórico" },
                            { numero: 3, titulo: "Metodología" },
                            { numero: 4, titulo: "Resultados" },
                            { numero: 5, titulo: "Conclusiones" },
                        ],
                    },
                },
            })
        }

        return NextResponse.json(
            {
                message: "Usuario registrado exitosamente",
                userId: user.id,
                hasThesis: validated.rol === "ESTUDIANTE" && !!validated.tituloTesis,
            },
            { status: 201 }
        )
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { error: "Datos inválidos", details: error.errors },
                { status: 400 }
            )
        }

        console.error("Error en registro:", error)
        return NextResponse.json(
            { error: "Error al registrar usuario" },
            { status: 500 }
        )
    }
}
