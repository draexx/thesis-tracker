"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Target, Award } from "lucide-react"

interface EstadisticasRankingProps {
    promedio: number
    mediana: number
    tasaProgreso: number
    totalParticipantes: number
}

export function EstadisticasRanking({
    promedio,
    mediana,
    tasaProgreso,
    totalParticipantes,
}: EstadisticasRankingProps) {
    const stats = [
        {
            title: "Promedio General",
            value: `${promedio.toFixed(1)}%`,
            icon: TrendingUp,
            color: "text-blue-600 dark:text-blue-400",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
        },
        {
            title: "Mediana",
            value: `${mediana.toFixed(1)}%`,
            icon: Target,
            color: "text-purple-600 dark:text-purple-400",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
        },
        {
            title: "Tasa de Progreso",
            value: `${tasaProgreso.toFixed(1)}%`,
            icon: Award,
            color: "text-green-600 dark:text-green-400",
            bgColor: "bg-green-100 dark:bg-green-900/20",
            subtitle: "Estudiantes > 50%",
        },
        {
            title: "Participantes",
            value: totalParticipantes.toString(),
            icon: Users,
            color: "text-orange-600 dark:text-orange-400",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
        },
    ]

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon
                return (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            {stat.subtitle && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.subtitle}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
