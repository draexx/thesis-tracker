"use client"

import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BarraProgreso } from "./BarraProgreso"
import { Trophy } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

interface RankingEntry {
    id: string
    nombre: string
    avatar: string | null
    titulo: string
    porcentaje: number
    programa: string
    cohorte: string
}

interface VistaListaProps {
    entries: RankingEntry[]
    currentUserId?: string
    modoGamificacion?: boolean
}

const ITEMS_PER_PAGE = 20

export function VistaLista({ entries, currentUserId, modoGamificacion = false }: VistaListaProps) {
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentEntries = entries.slice(startIndex, endIndex)

    const getMedal = (position: number) => {
        if (position === 1) return "🥇"
        if (position === 2) return "🥈"
        if (position === 3) return "🥉"
        return null
    }

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    return (
        <div className="space-y-4">
            {/* Desktop view */}
            <div className="hidden md:block">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Posición
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Estudiante
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Título de Tesis
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Progreso
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Programa
                                </th>
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={container}
                            initial="hidden"
                            animate="show"
                            className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700"
                        >
                            {currentEntries.map((entry, index) => {
                                const globalPosition = startIndex + index + 1
                                const isCurrentUser = entry.id === currentUserId
                                const medal = getMedal(globalPosition)

                                return (
                                    <motion.tr
                                        key={entry.id}
                                        variants={item}
                                        className={
                                            isCurrentUser
                                                ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
                                                : ""
                                        }
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {medal && (
                                                    <span className="text-2xl">{medal}</span>
                                                )}
                                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    #{globalPosition}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={entry.avatar || undefined} />
                                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                                        {entry.nombre[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {entry.nombre}
                                                        {isCurrentUser && (
                                                            <Badge variant="outline" className="ml-2">
                                                                Tú
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {entry.cohorte}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs cursor-help">
                                                            {entry.titulo}
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className="max-w-md">
                                                        <p>{entry.titulo}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </td>
                                        <td className="px-6 py-4">
                                            <BarraProgreso
                                                porcentaje={entry.porcentaje}
                                                modoGamificacion={modoGamificacion}
                                                className="w-48"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <Badge variant="secondary">{entry.programa}</Badge>
                                        </td>
                                    </motion.tr>
                                )
                            })}
                        </motion.tbody>
                    </table>
                </div>
            </div>

            {/* Mobile view */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="md:hidden space-y-3"
            >
                {currentEntries.map((entry, index) => {
                    const globalPosition = startIndex + index + 1
                    const isCurrentUser = entry.id === currentUserId
                    const medal = getMedal(globalPosition)

                    return (
                        <motion.div
                            key={entry.id}
                            variants={item}
                            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${isCurrentUser ? "border-2 border-blue-500" : ""
                                }`}
                        >
                            <div className="flex items-start gap-3 mb-3">
                                <div className="flex flex-col items-center">
                                    {medal && <span className="text-xl mb-1">{medal}</span>}
                                    <span className="text-xs font-medium text-gray-500">
                                        #{globalPosition}
                                    </span>
                                </div>
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={entry.avatar || undefined} />
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        {entry.nombre[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {entry.nombre}
                                        {isCurrentUser && (
                                            <Badge variant="outline" className="ml-2">
                                                Tú
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {entry.cohorte}
                                    </div>
                                    <Badge variant="secondary" className="mt-1">
                                        {entry.programa}
                                    </Badge>
                                </div>
                            </div>
                            <div className="mb-2">
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                                    {entry.titulo}
                                </p>
                            </div>
                            <BarraProgreso
                                porcentaje={entry.porcentaje}
                                modoGamificacion={modoGamificacion}
                            />
                        </motion.div>
                    )
                })}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-10"
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </Button>
                </div>
            )}
        </div>
    )
}
