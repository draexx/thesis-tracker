import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { Navbar } from "@/components/layout/Navbar"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { ProgresoGeneral } from "@/components/dashboard/ProgresoGeneral"
import { AvancePorCapitulos } from "@/components/dashboard/AvancePorCapitulos"
import { ProximosHitos } from "@/components/dashboard/ProximosHitos"

export default async function EstudianteDashboard() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    if (session.user.rol !== "ESTUDIANTE") {
        redirect("/asesor")
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
        return (
            <>
                <Navbar
                    userName={session.user.nombre || "Usuario"}
                    userEmail={session.user.email || ""}
                    userRole={session.user.rol}
                />
                <div className="container mx-auto p-6">
                    <DashboardHeader
                        user={session.user}
                        tesis={null}
                    />
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">No tienes una tesis asignada</h2>
                        <p className="text-muted-foreground">
                            Contacta a tu asesor para que te asigne una tesis.
                        </p>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar
                userName={session.user.nombre || "Usuario"}
                userEmail={session.user.email || ""}
                userRole={session.user.rol}
            />
            <div className="container mx-auto p-6 space-y-6">
                <DashboardHeader
                    user={session.user}
                    tesis={tesis}
                />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="md:col-span-1">
                        <ProgresoGeneral
                            tesisId={tesis.id}
                            porcentajeActual={tesis.porcentajeGeneral}
                        />
                    </div>

                    <div className="md:col-span-1 lg:col-span-2">
                        <AvancePorCapitulos
                            capitulos={tesis.capitulos}
                            tesisId={tesis.id}
                        />
                    </div>

                    <div className="md:col-span-2 lg:col-span-3">
                        <ProximosHitos hitos={tesis.hitos} />
                    </div>
                </div>
            </div>
        </>
    )
}
