"use client"

import { motion } from "framer-motion"

const steps = [
    {
        number: "01",
        title: "Regístrate",
        description: "Crea tu cuenta como estudiante o asesor y configura tu perfil académico en segundos.",
    },
    {
        number: "02",
        title: "Configura tu Tesis",
        description: "Define la estructura de capítulos y establece tus objetivos iniciales.",
    },
    {
        number: "03",
        title: "Actualiza Progreso",
        description: "Registra tus avances regularmente y sube evidencias de tu trabajo.",
    },
    {
        number: "04",
        title: "Recibe Feedback",
        description: "Obtén retroalimentación de tu asesor y compara tu ritmo con tus pares.",
    },
]

export const HowItWorks = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Cómo funciona
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Un proceso simple y estructurado para llevar tu investigación del plan a la defensa.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 z-0" />

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-background md:bg-transparent p-6 md:p-0 rounded-xl border md:border-0 shadow-sm md:shadow-none"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-6 shadow-lg ring-4 ring-background">
                                        {step.number}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
