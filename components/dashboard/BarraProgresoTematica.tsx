"use client"

import { useTheme } from "@/hooks/useTheme"
import { motion } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import confetti from "canvas-confetti"

interface BarraProgresoTematicaProps {
    porcentaje: number
    className?: string
}

export function BarraProgresoTematica({ porcentaje, className }: BarraProgresoTematicaProps) {
    const { isGamification } = useTheme()
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => setProgress(porcentaje), 100)
        return () => clearTimeout(timer)
    }, [porcentaje])

    useEffect(() => {
        if (isGamification && progress === 100) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
            })
        }
    }, [progress, isGamification])

    if (!isGamification) {
        return (
            <div className={className}>
                <Progress value={progress} className="h-2 bg-gray-200 dark:bg-gray-700" />
            </div>
        )
    }

    return (
        <div className={`relative ${className}`}>
            <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden border border-gray-300 dark:border-gray-700 shadow-inner">
                <motion.div
                    className="h-full bg-gradient-to-r from-game-primary via-game-secondary to-game-accent relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-white/30 animate-pulse-slow" />
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('/stripes.png')] opacity-20 animate-slide-up" />
                    </div>
                    {progress >= 100 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-1 top-1/2 -translate-y-1/2"
                        >
                            🌟
                        </motion.div>
                    )}
                </motion.div>
            </div>
            <div className="flex justify-between text-xs mt-1 font-bold text-game-primary">
                <span>Nivel {Math.floor(progress / 25) + 1}</span>
                <span>{Math.round(progress)}% XP</span>
            </div>
        </div>
    )
}
