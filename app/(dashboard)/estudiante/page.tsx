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
                    <div className="md:col-span-1 relative">
                        <div className="absolute -top-2 -right-2 z-10">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300 border border-blue-400">Beta</span>
                        </div>
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

                    {/* Placeholder: Sugerencias */}
                    <div className="md:col-span-2 lg:col-span-3 mt-4">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-100 dark:border-purple-900 rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600 dark:text-purple-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                </div>
                                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">📢 Sugerencias y Feedback</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                ¿Encontraste un error o tienes una idea para mejorar TTC? Tu opinión nos ayuda a construir una mejor herramienta.
                            </p>
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    placeholder="Escribe tu sugerencia aquí..."
                                    className="flex-1 px-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm font-medium transition-colors">
                                    Enviar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
