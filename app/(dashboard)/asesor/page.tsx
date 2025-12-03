import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/layout/Navbar"
import { AsesorDashboardClient } from "@/components/dashboard/AsesorDashboardClient"

export default async function AsesorDashboard() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    if (session.user.rol !== "ASESOR") {
        redirect("/estudiante")
    }

    return (
        <>
            <Navbar
                userName={session.user.nombre || "Usuario"}
                userEmail={session.user.email || ""}
                userRole={session.user.rol}
            />
            <div className="container mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard del Asesor
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mt-1">
                        Gestiona y supervisa el progreso de tus estudiantes
                    </p>
                </div>

                <AsesorDashboardClient />
            </div>
        </>
    )
}
