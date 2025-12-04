"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const testimonials = [
    {
        name: "Ana García",
        role: "Estudiante de Maestría en Ingeniería",
        content: "TTC cambió por completo mi forma de trabajar. Ver el progreso de mis compañeros me motivó a no quedarme atrás y logré terminar mi tesis 2 meses antes de lo previsto.",
        initials: "AG",
    },
    {
        name: "Dr. Carlos Rodríguez",
        role: "Asesor de Tesis",
        content: "Con 10 tesistas a mi cargo, era imposible hacer un seguimiento detallado. Ahora puedo ver en un solo vistazo quién necesita ayuda y quién va por buen camino.",
        initials: "CR",
    },
    {
        name: "Miguel Torres",
        role: "Graduado de MBA",
        content: "La estructura que te da la plataforma es invaluable. Saber exactamente qué capítulo sigue y tener feedback rápido de mi asesor hizo todo el proceso mucho menos estresante.",
        initials: "MT",
    },
]

export const Testimonials = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Lo que dicen nuestros usuarios
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-slate-50 dark:bg-slate-900/50 border-none shadow-sm">
                            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${testimonial.initials}`} />
                                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
