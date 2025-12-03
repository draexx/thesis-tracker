import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/layout/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AsesorDashboard() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    if (session.user.rol !== "ASESOR") {
        redirect("/dashboard/estudiante")
    }

    return (
        <>
            <Navbar
                userName={session.user.nombre || "Usuario"}
                userEmail={session.user.email || ""}
                userRole={session.user.rol}
            />
            <div className="container mx-auto p-6 space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Dashboard del Asesor
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300">
                        Bienvenido, {session.user.nombre}
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tesis Asignadas</CardTitle>
                            <CardDescription>
                                Estudiantes bajo tu supervisión
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-primary">0</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Próximamente: Lista de tesis asignadas
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Capítulos Pendientes</CardTitle>
                            <CardDescription>
                                Requieren tu revisión
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-yellow-600">0</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Próximamente: Capítulos por aprobar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Comentarios</CardTitle>
                            <CardDescription>
                                Feedback proporcionado
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-4xl font-bold text-green-600">0</p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Próximamente: Historial de comentarios
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Funcionalidades Próximas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Ver lista de estudiantes asignados
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Revisar y aprobar capítulos
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Dejar comentarios en capítulos
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Ver actividad reciente de estudiantes
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Gestionar hitos y deadlines
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
