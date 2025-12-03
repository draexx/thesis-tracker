import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { calcularAlerta } from "@/lib/utils/alertas"
import { calcularFrecuenciaActualizaciones } from "@/lib/utils/actividad"

export async function GET() {
    try {
        const session = await auth()

        if (!session?.user || session.user.rol !== "ASESOR") {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        // Obtener todas las tesis del asesor
        const tesis = await prisma.tesis.findMany({
            where: {
                asesorId: session.user.id,
            },
            include: {
                estudiante: {
                    select: {
                        id: true,
                        nombre: true,
                        avatar: true,
                        programa: true,
                        cohorte: true,
                    },
                },
                actividades: {
                    orderBy: {
                        timestamp: "desc",
                    },
                    take: 100, // Últimas 100 actividades para cálculos
                },
                hitos: {
                    where: {
                        completado: false,
                    },
                    orderBy: {
                        fechaLimite: "asc",
                    },
                    take: 1, // Solo el próximo hito
                },
            },
        })

        // Transformar datos y calcular alertas
        const tesistas = tesis.map((t) => {
            const alerta = calcularAlerta(t as any)
            const frecuencia30Dias = calcularFrecuenciaActualizaciones(t.actividades, 30)
            const proximoHito = t.hitos[0] || null

            return {
                id: t.id,
                estudiante: {
                    id: t.estudiante.id,
                    nombre: t.estudiante.nombre,
                    avatar: t.estudiante.avatar,
                    programa: t.estudiante.programa,
                    cohorte: t.estudiante.cohorte,
                },
                titulo: t.titulo,
                porcentajeGeneral: t.porcentajeGeneral,
                estado: t.estado,
                alerta,
                ultimaActividad: t.actividades[0]?.timestamp || null,
                frecuenciaActividad: frecuencia30Dias,
                proximoHito: proximoHito
                    ? {
                        id: proximoHito.id,
                        titulo: proximoHito.titulo,
                        fechaLimite: proximoHito.fechaLimite,
                    }
                    : null,
            }
        })

        return NextResponse.json({ tesistas })
    } catch (error) {
        console.error("Error fetching tesistas:", error)
        return NextResponse.json(
            { error: "Error al obtener tesistas" },
            { status: 500 }
        )
    }
}
