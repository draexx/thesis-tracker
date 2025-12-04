"use client"

import { useTheme } from "@/hooks/useTheme"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle() {
    const { theme, toggleTheme, isGamification } = useTheme()

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleTheme}
                        className={`relative overflow-hidden transition-colors duration-500 ${isGamification
                                ? "border-game-primary text-game-primary hover:bg-game-primary/10"
                                : "border-formal-primary text-formal-primary hover:bg-formal-primary/10"
                            }`}
                    >
                        <motion.div
                            initial={false}
                            animate={{
                                y: isGamification ? -30 : 0,
                                opacity: isGamification ? 0 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <span className="text-xl">📊</span>
                        </motion.div>
                        <motion.div
                            initial={false}
                            animate={{
                                y: isGamification ? 0 : 30,
                                opacity: isGamification ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <span className="text-xl">🎮</span>
                        </motion.div>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>
                        Modo: {isGamification ? "Gamificación" : "Formal"}
                        <br />
                        <span className="text-xs text-muted-foreground">
                            Click para cambiar
                        </span>
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
