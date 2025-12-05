import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Ranking de Tesis",
    description: "Compara tu progreso de tesis con otros estudiantes. Visualiza estadísticas y rankings en tiempo real.",
    openGraph: {
        title: "Ranking de Tesis - TTC",
        description: "Compara tu progreso de tesis con otros estudiantes",
        type: "website",
    },
}

export default function RankingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
