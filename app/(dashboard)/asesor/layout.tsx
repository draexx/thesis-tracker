import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard Asesor",
    description: "Supervisa el progreso de tus tesistas, aprueba capítulos y proporciona feedback",
    robots: {
        index: false,
        follow: false,
    },
}

export default function AsesorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
