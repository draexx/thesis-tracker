import { ActividadEstudiante, TipoActividad } from "@prisma/client"

/**
 * Calcula la frecuencia de actualizaciones en un período
 */
export function calcularFrecuenciaActualizaciones(
    actividades: ActividadEstudiante[],
    dias: number = 30
): number {
    const ahora = new Date()
    const fechaInicio = new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000)

    return actividades.filter(
        (act) => new Date(act.timestamp) >= fechaInicio
    ).length
}

/**
 * Calcula el promedio de actualizaciones por semana
 */
export function calcularPromedioSemanal(actividades: ActividadEstudiante[]): number {
    const frecuencia = calcularFrecuenciaActualizaciones(actividades, 30)
    return Number((frecuencia / 4.3).toFixed(1)) // 4.3 semanas en 30 días
}

/**
 * Obtiene el tipo de actividad más frecuente
 */
export function obtenerActividadMasFrecuente(
    actividades: ActividadEstudiante[]
): TipoActividad | null {
    if (actividades.length === 0) return null

    const conteo: Record<TipoActividad, number> = {
        ACTUALIZACION_PORCENTAJE: 0,
        ACTUALIZACION_CAPITULO: 0,
        COMPLETADO_HITO: 0,
    }

    actividades.forEach((act) => {
        conteo[act.tipo]++
    })

    const masFrecuente = Object.entries(conteo).reduce((a, b) =>
        a[1] > b[1] ? a : b
    )

    return masFrecuente[0] as TipoActividad
}

/**
 * Formatea el tipo de actividad para mostrar
 */
export function formatearTipoActividad(tipo: TipoActividad): string {
    switch (tipo) {
        case "ACTUALIZACION_PORCENTAJE":
            return "Actualización de porcentaje"
        case "ACTUALIZACION_CAPITULO":
            return "Actualización de capítulo"
        case "COMPLETADO_HITO":
            return "Hito completado"
    }
}

/**
 * Obtiene estadísticas de actividad
 */
export function obtenerEstadisticasActividad(actividades: ActividadEstudiante[]) {
    const total = actividades.length
    const ultimaActividad = actividades[0]?.timestamp || null
    const promedioSemanal = calcularPromedioSemanal(actividades)
    const tipoMasFrecuente = obtenerActividadMasFrecuente(actividades)
    const frecuencia30Dias = calcularFrecuenciaActualizaciones(actividades, 30)

    return {
        total,
        ultimaActividad,
        promedioSemanal,
        tipoMasFrecuente,
        frecuencia30Dias,
    }
}

/**
 * Agrupa actividades por día para gráficos
 */
export function agruparActividadesPorDia(
    actividades: ActividadEstudiante[],
    dias: number = 30
): Array<{ fecha: string; cantidad: number }> {
    const ahora = new Date()
    const resultado: Array<{ fecha: string; cantidad: number }> = []

    for (let i = dias - 1; i >= 0; i--) {
        const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000)
        const fechaStr = fecha.toISOString().split("T")[0]

        const cantidad = actividades.filter((act) => {
            const actFecha = new Date(act.timestamp).toISOString().split("T")[0]
            return actFecha === fechaStr
        }).length

        resultado.push({ fecha: fechaStr, cantidad })
    }

    return resultado
}
