"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export const Hero = () => {
    return (
        <section className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-28 pb-16">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[100px]" />
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium text-muted-foreground mb-6 bg-background/50 backdrop-blur-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                        Nueva plataforma para tesistas
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl"
                    >
                        Thesis Track & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Compare</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
                    >
                        Gestiona tu tesis de posgrado, compara tu progreso y mantén a tu asesor informado en tiempo real. La herramienta definitiva para alcanzar tu grado.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <Button size="lg" className="text-lg px-8 h-12 rounded-full" asChild>
                            <Link href="/register">
                                Comenzar Ahora <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="text-lg px-8 h-12 rounded-full" asChild>
                            <Link href="/login">
                                Iniciar Sesión
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="mt-16 relative w-full max-w-5xl"
                    >
                        <div className="relative rounded-xl border bg-background/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[16/9] sm:aspect-[2/1] lg:aspect-[16/9]">
                            {/* Mockup Placeholder - In a real app, this would be an image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <div className="w-full max-w-3xl mx-auto space-y-4">
                                        <div className="h-4 w-3/4 bg-slate-300 dark:bg-slate-700 rounded mx-auto animate-pulse"></div>
                                        <div className="grid grid-cols-3 gap-4 mt-8">
                                            <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded animate-pulse delay-75"></div>
                                            <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded animate-pulse delay-150"></div>
                                            <div className="h-32 bg-slate-300 dark:bg-slate-700 rounded animate-pulse delay-200"></div>
                                        </div>
                                        <div className="h-64 bg-slate-300 dark:bg-slate-700 rounded mt-8 animate-pulse delay-300"></div>
                                    </div>
                                    <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Dashboard Interactivo</p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badges */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 md:top-10 md:-right-10 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-xl border border-slate-100 dark:border-slate-700 hidden sm:block"
                        >
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">Capítulo 2 Aprobado</p>
                                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
