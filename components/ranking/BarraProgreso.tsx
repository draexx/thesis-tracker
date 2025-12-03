"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface BarraProgresoProps {
    porcentaje: number
    modoGamificacion?: boolean
    className?: string
}

export function BarraProgreso({ porcentaje, modoGamificacion = false, className }: BarraProgresoProps) {
    const [displayValue, setDisplayValue] = useState(0)

    // Animate number counter
    useEffect(() => {
        if (modoGamificacion) {
            const duration = 1000
            const steps = 60
            const increment = porcentaje / steps
            let current = 0

            const timer = setInterval(() => {
                current += increment
                if (current >= porcentaje) {
                    setDisplayValue(porcentaje)
                    clearInterval(timer)
                } else {
                    setDisplayValue(Math.floor(current))
                }
            }, duration / steps)

            return () => clearInterval(timer)
        } else {
            setDisplayValue(porcentaje)
        }
    }, [porcentaje, modoGamificacion])

    // Color based on percentage
    const getColor = () => {
        if (porcentaje >= 75) return "from-green-500 to-emerald-600"
        if (porcentaje >= 50) return "from-yellow-500 to-amber-600"
        if (porcentaje >= 25) return "from-orange-500 to-red-600"
        return "from-red-500 to-rose-600"
    }

    if (modoGamificacion) {
        return (
            <div className={cn("relative w-full", className)}>
                <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${porcentaje}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                            "h-full bg-gradient-to-r relative overflow-hidden",
                            getColor()
                        )}
                    >
                        {/* Pulse animation */}
                        <motion.div
                            animate={{
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-white/20"
                        />

                        {/* Shine effect */}
                        <motion.div
                            animate={{
                                x: ["-100%", "200%"],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear",
                                repeatDelay: 1,
                            }}
                            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        />
                    </motion.div>
                </div>

                {/* Animated percentage text */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <span className="text-sm font-bold text-white drop-shadow-lg">
                        {displayValue}%
                    </span>
                </motion.div>
            </div>
        )
    }

    // Formal mode
    return (
        <div className={cn("relative w-full", className)}>
            <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"
                />
            </div>
            <div className="absolute inset-0 flex items-center justify-end pr-2">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-200">
                    {porcentaje}%
                </span>
            </div>
        </div>
    )
}
