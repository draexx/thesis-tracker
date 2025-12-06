"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp, Award, BookOpen } from "lucide-react"

const stats = [
    {
        icon: Users,
        value: "500+",
        label: "Tesistas Activos",
        color: "text-blue-600 dark:text-blue-400"
    },
    {
        icon: TrendingUp,
        value: "95%",
        label: "Tasa de Graduación",
        color: "text-green-600 dark:text-green-400"
    },
    {
        icon: Award,
        value: "1,200+",
        label: "Capítulos Aprobados",
        color: "text-purple-600 dark:text-purple-400"
    },
    {
        icon: BookOpen,
        value: "50+",
        label: "Programas de Posgrado",
        color: "text-orange-600 dark:text-orange-400"
    }
]

export const Statistics = () => {
    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Impulsando el Éxito Académico
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Miles de estudiantes y asesores confían en nuestra plataforma para gestionar sus tesis de posgrado
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-lg mb-4">
                                <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            </div>
                            <div className="text-4xl font-bold text-foreground mb-2">
                                {stat.value}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
