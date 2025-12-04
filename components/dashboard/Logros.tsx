"use client"

import { BADGES, getUnlockedBadges } from "@/lib/utils/badges"
import { ActividadEstudiante } from "@prisma/client"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "@/hooks/useTheme"

interface LogrosProps {
    progress: number
    activities: ActividadEstudiante[]
}

export function Logros({ progress, activities }: LogrosProps) {
    const { isGamification } = useTheme()
    const unlockedBadges = getUnlockedBadges(progress, activities)
    const unlockedIds = new Set(unlockedBadges.map(b => b.id))

    if (!isGamification) return null

    return (
        <Card className="border-game-primary/20 bg-gradient-to-br from-white to-purple-50 dark:from-gray-950 dark:to-gray-900">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-game-primary">
                    <span>🏆</span> Logros Desbloqueados
                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                        {unlockedBadges.length} / {BADGES.length}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {BADGES.map((badge) => {
                        const isUnlocked = unlockedIds.has(badge.id)
                        return (
                            <TooltipProvider key={badge.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <motion.div
                                            className={`aspect-square rounded-xl flex items-center justify-center text-3xl border-2 cursor-help relative overflow-hidden ${isUnlocked
                                                    ? "bg-white dark:bg-gray-800 border-game-primary shadow-lg shadow-game-primary/20"
                                                    : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 grayscale opacity-50"
                                                }`}
                                            whileHover={{ scale: 1.05 }}
                                            initial={false}
                                            animate={{
                                                scale: isUnlocked ? 1 : 0.9,
                                                opacity: isUnlocked ? 1 : 0.5
                                            }}
                                        >
                                            {badge.icon}
                                            {isUnlocked && (
                                                <motion.div
                                                    className="absolute inset-0 bg-game-primary/10"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                        </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-center">
                                            <p className="font-bold text-game-primary">{badge.title}</p>
                                            <p className="text-xs">{badge.description}</p>
                                            {!isUnlocked && (
                                                <p className="text-xs text-muted-foreground mt-1 italic">
                                                    Bloqueado
                                                </p>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
