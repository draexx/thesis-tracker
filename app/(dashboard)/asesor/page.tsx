import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { Navbar } from "@/components/layout/Navbar"
import { AsesorDashboardClient } from "@/components/dashboard/AsesorDashboardClient"
import { AsignarTesisDialog } from "@/components/dashboard/AsignarTesisDialog"

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
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Dashboard del Asesor
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Gestiona y supervisa el progreso de tus estudiantes
                        </p>
                    </div>
                    <AsignarTesisDialog />
                </div>

                <AsesorDashboardClient />

                {/* Placeholder: Gestión de Archivos */}
                <div className="mt-8 border rounded-lg p-6 bg-gray-50 dark:bg-gray-900/50 border-dashed border-gray-300 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            🚧 Gestión de Archivos y Versiones <span className="text-xs font-normal bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full dark:bg-yellow-900/30 dark:text-yellow-300">Próximamente</span>
                        </h2>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 w-8 h-8"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                Esta función permitirá a los asesores revisar documentos directamente en la plataforma, con control de versiones y anotaciones en línea.
                            </p>
                            <div className="flex gap-2 justify-center md:justify-start">
                                <button disabled className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-md cursor-not-allowed text-sm font-medium flex items-center gap-2" title="Esta función estará disponible en la próxima versión">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                    Subir Documento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
