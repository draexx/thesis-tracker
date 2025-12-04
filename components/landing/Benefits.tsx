"use client"

import { Check } from "lucide-react"

const studentBenefits = [
    "Mantén el enfoque con objetivos claros y fechas límite",
    "Motivación a través de comparación sana con tu cohorte",
    "Historial completo y organizado de tu progreso",
    "Comunicación directa y centralizada con tu asesor",
]

const advisorBenefits = [
    "Dashboard centralizado de todos tus tesistas",
    "Alertas automáticas de estudiantes en riesgo de retraso",
    "Herramientas de aprobación y comentarios ágiles",
    "Informes de actividad detallados y métricas de rendimiento",
]

export const Benefits = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Students Column */}
                    <div className="bg-background rounded-2xl p-8 shadow-sm border">
                        <h3 className="text-2xl font-bold mb-2 text-blue-600">Para Estudiantes</h3>
                        <p className="text-muted-foreground mb-8">
                            Toma el control de tu investigación y avanza con confianza hacia tu grado.
                        </p>
                        <ul className="space-y-4">
                            {studentBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                        <Check className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <span className="text-foreground">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Advisors Column */}
                    <div className="bg-background rounded-2xl p-8 shadow-sm border">
                        <h3 className="text-2xl font-bold mb-2 text-purple-600">Para Asesores</h3>
                        <p className="text-muted-foreground mb-8">
                            Optimiza tu tiempo y mejora la calidad de la supervisión de tus tesistas.
                        </p>
                        <ul className="space-y-4">
                            {advisorBenefits.map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <div className="mt-1 h-5 w-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                                        <Check className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-foreground">{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    )
}
