import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export const Footer = () => {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Thesis Track & Compare
                        </Link>
                        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                            La plataforma líder para la gestión y seguimiento de tesis de posgrado. Simplificamos el camino hacia tu grado académico.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Plataforma</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/login" className="hover:text-foreground transition-colors">Iniciar Sesión</Link></li>
                            <li><Link href="/register" className="hover:text-foreground transition-colors">Registrarse</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Características</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Precios</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-foreground transition-colors">Privacidad</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Términos</Link></li>
                            <li><Link href="#" className="hover:text-foreground transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Thesis Track & Compare. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-4">
                        <Link href="https://x.com/Draexx" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Twitter className="h-5 w-5" />
                        </Link>
                        <Link href="https://github.com/draexx" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Github className="h-5 w-5" />
                        </Link>
                        <Link href="https://www.linkedin.com/in/pedrocarranza" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Linkedin className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
