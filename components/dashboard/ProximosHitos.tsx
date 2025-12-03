"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"

interface Hito {
    id: string
    titulo: string
    descripcion: string | null
    fechaLimite: Date
    completado: boolean
    fechaCompletado: Date | null
    capitulo: {
        titulo: string
        numeroCapitulo: number
    } | null
}

interface ProximosHitosProps {
    hitos: Hito[]
}

export function ProximosHitos({ hitos }: ProximosHitosProps) {
    const [optimisticHitos, setOptimisticHitos] = useState(hitos)
    const { toast } = useToast()
    const router = useRouter()

    function getDateColor(fechaLimite: Date, completado: boolean) {
        if (completado) return "default"

        const daysUntil = differenceInDays(new Date(fechaLimite), new Date())

        if (daysUntil < 0) return "destructive"
        if (daysUntil < 3) return "destructive"
        if (daysUntil < 7) return "secondary"
        return "default"
    }

    function getDateLabel(fechaLimite: Date, completado: boolean) {
        if (completado) return "Completado"

        const daysUntil = differenceInDays(new Date(fechaLimite), new Date())

        if (daysUntil < 0) return "Vencido"
        if (daysUntil === 0) return "Hoy"
        if (daysUntil === 1) return "Mañana"
        if (daysUntil < 7) return `En ${daysUntil} días`
        return format(new Date(fechaLimite), "d 'de' MMMM", { locale: es })
    }

    async function toggleHito(hitoId: string) {
        // Optimistic update
        setOptimisticHitos((prev) =>
            prev.map((h) =>
                h.id === hitoId
                    ? { ...h, completado: !h.completado, fechaCompletado: !h.completado ? new Date() : null }
                    : h
            )
        )

        try {
            const response = await fetch(`/api/hitos/${hitoId}/completar`, {
                method: "PATCH",
            })

            if (!response.ok) {
                throw new Error("Failed to update")
            }

            const hito = optimisticHitos.find((h) => h.id === hitoId)
            toast({
                title: hito?.completado ? "Hito marcado como pendiente" : "¡Hito completado!",
                description: hito?.titulo,
            })

            router.refresh()
        } catch (error) {
            // Revert optimistic update
            setOptimisticHitos(hitos)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el hito",
            })
        }
    }

    const hitosPendientes = optimisticHitos.filter((h) => !h.completado)
    const hitosCompletados = optimisticHitos.filter((h) => h.completado)

    if (optimisticHitos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Próximos Hitos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No hay hitos registrados aún
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Próximos Hitos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {hitosPendientes.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Pendientes</h3>
                        {hitosPendientes.map((hito) => (
                            <motion.div
                                key={hito.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => toggleHito(hito.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <Circle className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <h4 className="font-semibold">{hito.titulo}</h4>
                                            {hito.descripcion && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {hito.descripcion}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant={getDateColor(hito.fechaLimite, hito.completado)}>
                                                <Calendar className="w-3 h-3 mr-1" />
                                                {getDateLabel(hito.fechaLimite, hito.completado)}
                                            </Badge>
                                            {hito.capitulo && (
                                                <Badge variant="outline">
                                                    Cap. {hito.capitulo.numeroCapitulo}: {hito.capitulo.titulo}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {hitosCompletados.length > 0 && (
                    <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-muted-foreground">Completados</h3>
                        {hitosCompletados.map((hito) => (
                            <motion.div
                                key={hito.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="border rounded-lg p-4 space-y-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                                onClick={() => toggleHito(hito.id)}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div>
                                            <h4 className="font-semibold line-through">{hito.titulo}</h4>
                                            {hito.descripcion && (
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {hito.descripcion}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="default">
                                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                                Completado
                                            </Badge>
                                            {hito.capitulo && (
                                                <Badge variant="outline">
                                                    Cap. {hito.capitulo.numeroCapitulo}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
