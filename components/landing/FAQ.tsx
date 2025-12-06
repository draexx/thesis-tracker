"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
    {
        question: "¿Cómo funciona el sistema de ranking?",
        answer: "El ranking compara tu progreso de tesis con otros estudiantes de tu programa y cohorte. Se actualiza en tiempo real basándose en el porcentaje de avance de cada capítulo. Puedes optar por ocultar tu perfil del ranking si prefieres privacidad."
    },
    {
        question: "¿Mi asesor puede ver todo mi progreso?",
        answer: "Sí, tu asesor tiene acceso completo a tu progreso, incluyendo el porcentaje de cada capítulo, comentarios, hitos y actividad reciente. Esto facilita la comunicación y permite que te brinde retroalimentación oportuna."
    },
    {
        question: "¿Es seguro compartir mi tesis en la plataforma?",
        answer: "Absolutamente. Solo tú y tu asesor asignado tienen acceso al contenido de tu tesis. El ranking público solo muestra tu nombre, programa y porcentaje de avance, sin revelar detalles del contenido de tu investigación."
    },
    {
        question: "¿Puedo cambiar de asesor?",
        answer: "El cambio de asesor debe ser gestionado por un administrador del sistema o tu coordinador de posgrado. Contacta al soporte técnico o a tu institución para realizar este cambio."
    },
    {
        question: "¿Qué pasa si no actualizo mi progreso regularmente?",
        answer: "Tu asesor recibirá alertas si detecta inactividad prolongada. Además, el sistema calcula tu frecuencia de actualizaciones para ayudar a identificar posibles retrasos. Mantener tu progreso actualizado mejora la comunicación con tu asesor."
    },
    {
        question: "¿Puedo agregar o eliminar capítulos de mi tesis?",
        answer: "Sí, tu asesor puede gestionar la estructura de capítulos de tu tesis después de asignarla. Puede agregar nuevos capítulos, editar títulos o eliminar secciones según evolucione tu investigación."
    },
    {
        question: "¿La plataforma es gratuita?",
        answer: "Sí, Thesis Track & Compare es completamente gratuita para estudiantes y asesores. Nuestro objetivo es facilitar el proceso de elaboración de tesis sin barreras económicas."
    },
    {
        question: "¿Qué navegadores son compatibles?",
        answer: "La plataforma funciona en todos los navegadores modernos: Chrome, Firefox, Safari y Edge. Recomendamos mantener tu navegador actualizado para la mejor experiencia."
    }
]

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-foreground mb-4">
                        Preguntas Frecuentes
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Encuentra respuestas a las dudas más comunes sobre nuestra plataforma
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            className="border rounded-lg overflow-hidden bg-card"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                            >
                                <span className="font-semibold text-foreground pr-8">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${openIndex === index ? "rotate-180" : ""
                                        }`}
                                />
                            </button>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? "auto" : 0,
                                    opacity: openIndex === index ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-6 pb-4 text-muted-foreground">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
