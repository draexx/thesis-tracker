import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Iniciar Sesión",
    description: "Accede a tu cuenta de Thesis Track & Compare",
}

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
