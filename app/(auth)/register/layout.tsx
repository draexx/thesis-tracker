import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Crear Cuenta",
    description: "Regístrate en Thesis Track & Compare y comienza a gestionar tu tesis",
}

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
