"use client"

import { formatearTipoActividad } from "@/lib/utils/actividad"
import { TipoActividad } from "@prisma/client"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CheckCircle2, FileEdit, TrendingUp } from "lucide-react"

interface Actividad {
    id: string
    tipo: TipoActividad
    descripcion: string
    timestamp: Date
    valorAnterior?: any
    valorNuevo?: any
}

interface TimelineActividadProps {
    actividades: Actividad[]
}

export function TimelineActividad({ actividades }: TimelineActividadProps) {
    const getIcon = (tipo: TipoActividad) => {
        switch (tipo) {
            case "ACTUALIZACION_PORCENTAJE":
                return <TrendingUp className="h-4 w-4" />
            case "ACTUALIZACION_CAPITULO":
                return <FileEdit className="h-4 w-4" />
            case "COMPLETADO_HITO":
                return <CheckCircle2 className="h-4 w-4" />
        }
    }

    const getColor = (tipo: TipoActividad) => {
        switch (tipo) {
            case "ACTUALIZACION_PORCENTAJE":
                return "bg-blue-500"
            case "ACTUALIZACION_CAPITULO":
                return "bg-purple-500"
            case "COMPLETADO_HITO":
                return "bg-green-500"
        }
    }

    if (actividades.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                No hay actividades registradas
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {actividades.map((actividad, index) => (
                <div key={actividad.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                        <div className={`p-2 rounded-full ${getColor(actividad.tipo)} text-white`}>
                            {getIcon(actividad.tipo)}
                        </div>
                        {index < actividades.length - 1 && (
                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                        )}
                    </div>
                    <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="font-medium text-sm">{actividad.descripcion}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatearTipoActividad(actividad.tipo)}
                                </p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {format(new Date(actividad.timestamp), "d MMM, HH:mm", { locale: es })}
                            </span>
                        </div>
                        {(actividad.valorAnterior || actividad.valorNuevo) && (
                            <div className="mt-2 text-xs bg-muted p-2 rounded">
                                {actividad.valorAnterior && (
                                    <div>Anterior: {JSON.stringify(actividad.valorAnterior)}</div>
                                )}
                                {actividad.valorNuevo && (
                                    <div>Nuevo: {JSON.stringify(actividad.valorNuevo)}</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
