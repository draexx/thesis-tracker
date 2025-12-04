"use client"

import { motion } from "framer-motion"
import { BarChart3, Users, GraduationCap } from "lucide-react"

const features = [
    {
        icon: BarChart3,
        title: "Monitoreo Personal",
        description: "Visualiza tu progreso por capítulos, actualiza tus avances y mantén un registro detallado de tu evolución académica.",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        icon: Users,
        title: "Comparación Social",
        description: "Compárate con tus compañeros de cohorte y encuentra la motivación necesaria para seguir adelante y no quedarte atrás.",
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        icon: GraduationCap,
        title: "Supervisión Inteligente",
        description: "Tu asesor recibe alertas automáticas y puede gestionar a todos sus tesistas desde un dashboard centralizado y eficiente.",
        color: "text-green-500",
        bg: "bg-green-500/10",
    },
]

export const Features = () => {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Todo lo que necesitas para tu tesis
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Herramientas diseñadas específicamente para optimizar el proceso de investigación y redacción de tesis de posgrado.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="bg-background rounded-2xl p-8 shadow-sm border hover:shadow-md transition-shadow"
                        >
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
