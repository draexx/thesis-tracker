import { Tesis, ActividadEstudiante, Hito } from "@prisma/client"

export type AlertLevel = "rojo" | "amarillo" | "verde"

interface TesisConActividades extends Tesis {
    actividades: ActividadEstudiante[]
    hitos: Hito[]
}

/**
 * Calcula el nivel de alerta para una tesis basado en:
 * - Última actividad
 * - Porcentaje de progreso
 * - Hitos próximos
 */
export function calcularAlerta(tesis: TesisConActividades): AlertLevel {
    const ahora = new Date()
    const ultimaActividad = tesis.actividades[0]?.timestamp

    // Calcular días desde última actividad
    const diasSinActividad = ultimaActividad
        ? Math.floor((ahora.getTime() - new Date(ultimaActividad).getTime()) / (1000 * 60 * 60 * 24))
        : 999

    // Verificar hitos próximos (dentro de 7 días)
    const hitoProximo = tesis.hitos.find((hito) => {
        if (hito.completado) return false
        const diasHastaHito = Math.floor(
            (new Date(hito.fechaLimite).getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24)
        )
        return diasHastaHito >= 0 && diasHastaHito <= 7
    })

    // 🔴 ROJO: Sin actividad > 14 días O porcentaje < 30% con hito próximo
    if (diasSinActividad > 14) {
        return "rojo"
    }
    if (tesis.porcentajeGeneral < 30 && hitoProximo) {
        return "rojo"
    }

    // 🟡 AMARILLO: Sin actividad 7-14 días O porcentaje 30-50%
    if (diasSinActividad >= 7 && diasSinActividad <= 14) {
        return "amarillo"
    }
    if (tesis.porcentajeGeneral >= 30 && tesis.porcentajeGeneral < 50) {
        return "amarillo"
    }

    // 🟢 VERDE: Actividad reciente y buen progreso
    return "verde"
}

/**
 * Obtiene el emoji correspondiente al nivel de alerta
 */
export function getAlertEmoji(nivel: AlertLevel): string {
    switch (nivel) {
        case "rojo":
            return "🔴"
        case "amarillo":
            return "🟡"
        case "verde":
            return "🟢"
    }
}

/**
 * Obtiene el color de badge para el nivel de alerta
 */
export function getAlertBadgeVariant(nivel: AlertLevel): "destructive" | "default" | "secondary" {
    switch (nivel) {
        case "rojo":
            return "destructive"
        case "amarillo":
            return "default"
        case "verde":
            return "secondary"
    }
}

/**
 * Obtiene el texto descriptivo del nivel de alerta
 */
export function getAlertText(nivel: AlertLevel): string {
    switch (nivel) {
        case "rojo":
            return "Requiere atención urgente"
        case "amarillo":
            return "Requiere seguimiento"
        case "verde":
            return "Progreso adecuado"
    }
}
