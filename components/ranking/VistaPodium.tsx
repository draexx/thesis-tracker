"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import confetti from "canvas-confetti"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal } from "lucide-react"
import { BarraProgreso } from "./BarraProgreso"

interface RankingEntry {
    id: string
    nombre: string
    avatar: string | null
    titulo: string
    porcentaje: number
    programa: string
    cohorte: string
}

interface VistaPodiumProps {
    entries: RankingEntry[]
    currentUserId?: string
    modoGamificacion?: boolean
}

export function VistaPodium({ entries, currentUserId, modoGamificacion = false }: VistaPodiumProps) {
    const top3 = entries.slice(0, 3)
    const rest = entries.slice(3)

    useEffect(() => {
        // Confetti for #1
        if (top3.length > 0) {
            const duration = 3000
            const end = Date.now() + duration

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ["#FFD700", "#FFA500", "#FF6347"],
                })
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ["#FFD700", "#FFA500", "#FF6347"],
                })

                if (Date.now() < end) {
                    requestAnimationFrame(frame)
                }
            }

            // Start confetti after a short delay
            const timeout = setTimeout(() => {
                frame()
            }, 500)

            return () => clearTimeout(timeout)
        }
    }, [top3.length])

    const podiumHeights = {
        1: "h-48", // First place (center)
        2: "h-36", // Second place (left)
        3: "h-28", // Third place (right)
    }

    const podiumColors = {
        1: "from-yellow-400 to-yellow-600",
        2: "from-gray-300 to-gray-500",
        3: "from-amber-600 to-amber-800",
    }

    const podiumOrder = [
        top3[1], // Second place (left)
        top3[0], // First place (center)
        top3[2], // Third place (right)
    ]

    const positions = [2, 1, 3]

    return (
        <div className="space-y-8">
            {/* Podium */}
            <div className="flex items-end justify-center gap-4 px-4">
                {podiumOrder.map((entry, index) => {
                    if (!entry) return null
                    const position = positions[index]
                    const isCurrentUser = entry.id === currentUserId

                    return (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, type: "spring" }}
                            className="flex flex-col items-center"
                        >
                            {/* Avatar and info */}
                            <div className="mb-4 text-center">
                                <div className="relative inline-block mb-2">
                                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                                        <AvatarImage src={entry.avatar || undefined} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                            {entry.nombre[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    {position === 1 && (
                                        <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1.5 shadow-lg">
                                            <Trophy className="h-5 w-5 text-yellow-900" />
                                        </div>
                                    )}
                                    {position !== 1 && (
                                        <div className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg">
                                            <Medal
                                                className={`h-5 w-5 ${position === 2
                                                        ? "text-gray-500"
                                                        : "text-amber-700"
                                                    }`}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="font-bold text-sm max-w-[120px] truncate">
                                    {entry.nombre}
                                    {isCurrentUser && (
                                        <Badge variant="outline" className="ml-1 text-xs">
                                            Tú
                                        </Badge>
                                    )}
                                </div>
                                <div className="text-xs text-muted-foreground mb-2">
                                    {entry.porcentaje}%
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {entry.programa}
                                </Badge>
                            </div>

                            {/* Podium base */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                transition={{ delay: 0.5 + index * 0.2 }}
                                className={`w-32 ${podiumHeights[position as 1 | 2 | 3]} bg-gradient-to-b ${podiumColors[position as 1 | 2 | 3]
                                    } rounded-t-lg shadow-xl flex items-center justify-center relative overflow-hidden ${isCurrentUser ? "ring-4 ring-blue-500" : ""
                                    }`}
                            >
                                <div className="absolute inset-0 bg-white/10" />
                                <span className="text-5xl font-bold text-white drop-shadow-lg relative z-10">
                                    {position}
                                </span>
                            </motion.div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Rest of participants */}
            {rest.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold mb-4 text-center">
                        Otros Participantes
                    </h3>
                    <div className="space-y-2">
                        {rest.map((entry, index) => {
                            const position = index + 4
                            const isCurrentUser = entry.id === currentUserId

                            return (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 + index * 0.05 }}
                                    className={`bg-white dark:bg-gray-800 rounded-lg p-3 shadow flex items-center gap-3 ${isCurrentUser ? "border-2 border-blue-500" : ""
                                        }`}
                                >
                                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                                        #{position}
                                    </div>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={entry.avatar || undefined} />
                                        <AvatarFallback className="bg-primary text-primary-foreground">
                                            {entry.nombre[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium truncate">
                                            {entry.nombre}
                                            {isCurrentUser && (
                                                <Badge variant="outline" className="ml-2">
                                                    Tú
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate">
                                            {entry.titulo}
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <BarraProgreso
                                            porcentaje={entry.porcentaje}
                                            modoGamificacion={modoGamificacion}
                                        />
                                    </div>
                                    <Badge variant="secondary" className="hidden sm:inline-flex">
                                        {entry.programa}
                                    </Badge>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
