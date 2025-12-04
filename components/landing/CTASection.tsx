"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export const CTASection = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
                    {/* Decorative circles */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                            ¿Listo para llevar tu tesis al siguiente nivel?
                        </h2>
                        <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
                            Únete a cientos de estudiantes y asesores que ya están optimizando su trabajo académico con Thesis Track & Compare.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" variant="secondary" className="text-lg px-8 h-12 rounded-full w-full sm:w-auto" asChild>
                                <Link href="/register">
                                    Crear cuenta gratis <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                        </div>
                        <p className="mt-4 text-sm text-primary-foreground/60">
                            No requiere tarjeta de crédito • Plan gratuito disponible
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
