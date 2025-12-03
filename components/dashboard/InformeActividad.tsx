"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { obtenerEstadisticasActividad, formatearTipoActividad } from "@/lib/utils/actividad"
import { ActividadEstudiante } from "@prisma/client"
import { Activity, Calendar, TrendingUp, Zap } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface InformeActividadProps {
    actividades: ActividadEstudiante[]
}

export function InformeActividad({ actividades }: InformeActividadProps) {
    const stats = obtenerEstadisticasActividad(actividades)

    const metrics = [
        {
            title: "Total de Actualizaciones",
            value: stats.total,
            icon: Activity,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Promedio Semanal",
            value: stats.promedioSemanal,
            icon: TrendingUp,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20",
        },
        {
            title: "Últimos 30 Días",
            value: stats.frecuencia30Dias,
            icon: Zap,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            title: "Última Actualización",
            value: stats.ultimaActividad
                ? format(new Date(stats.ultimaActividad), "d MMM", { locale: es })
                : "N/A",
            icon: Calendar,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
    ]

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {metrics.map((metric) => {
                    const Icon = metric.icon
                    return (
                        <Card key={metric.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {metric.title}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                                    <Icon className={`h-4 w-4 ${metric.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{metric.value}</div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            {stats.tipoMasFrecuente && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Tipo de Actividad Más Frecuente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium">
                            {formatearTipoActividad(stats.tipoMasFrecuente)}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
