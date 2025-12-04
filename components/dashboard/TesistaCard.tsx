"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getAlertEmoji, getAlertBadgeVariant, getAlertText, type AlertLevel } from "@/lib/utils/alertas"
import { Calendar, Eye } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { BarraProgresoTematica } from "@/components/dashboard/BarraProgresoTematica"

interface TesistaCardProps {
    tesista: {
        id: string
        estudiante: {
            id: string
            nombre: string
            avatar: string | null
            programa: string
            cohorte: string
        }
        titulo: string
        porcentajeGeneral: number
        alerta: AlertLevel
        proximoHito: {
            id: string
            titulo: string
            fechaLimite: Date
        } | null
    }
    onVerDetalles: () => void
}

export function TesistaCard({ tesista, onVerDetalles }: TesistaCardProps) {
    const alertEmoji = getAlertEmoji(tesista.alerta)
    const alertVariant = getAlertBadgeVariant(tesista.alerta)
    const alertText = getAlertText(tesista.alerta)

    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={tesista.estudiante.avatar || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {tesista.estudiante.nombre[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                            {tesista.estudiante.nombre}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            {tesista.estudiante.cohorte} • {tesista.estudiante.programa}
                        </p>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Badge variant={alertVariant} className="gap-1">
                                    <span>{alertEmoji}</span>
                                </Badge>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{alertText}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 cursor-help">
                                {tesista.titulo}
                            </p>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-sm">
                            <p>{tesista.titulo}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">{tesista.porcentajeGeneral}%</span>
                    </div>
                    <BarraProgresoTematica porcentaje={tesista.porcentajeGeneral} />
                </div>

                {tesista.proximoHito && (
                    <div className="flex items-start gap-2 p-2 bg-muted rounded-md">
                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                                {tesista.proximoHito.titulo}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {format(new Date(tesista.proximoHito.fechaLimite), "d 'de' MMMM", { locale: es })}
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <Button
                    onClick={onVerDetalles}
                    variant="outline"
                    className="w-full"
                    size="sm"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                </Button>
            </CardFooter>
        </Card>
    )
}
