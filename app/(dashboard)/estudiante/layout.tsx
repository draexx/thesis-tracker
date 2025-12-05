import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard Estudiante",
    description: "Gestiona el progreso de tu tesis, actualiza capítulos y revisa feedback de tu asesor",
    robots: {
        index: false,
        follow: false,
    },
}

export default function EstudianteLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
