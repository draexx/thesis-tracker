import { ActividadEstudiante } from "@prisma/client"

export interface Badge {
    id: string
    icon: string
    title: string
    description: string
    condition: (progress: number, activities: ActividadEstudiante[]) => boolean
}

export const BADGES: Badge[] = [
    {
        id: "primer-capitulo",
        icon: "🎯",
        title: "Primer Paso",
        description: "Alcanza el 25% de progreso en tu tesis",
        condition: (progress) => progress >= 25
    },
    {
        id: "media-tesis",
        icon: "📚",
        title: "Medio Camino",
        description: "Alcanza el 50% de progreso",
        condition: (progress) => progress >= 50
    },
    {
        id: "casi-listo",
        icon: "🚀",
        title: "Casi Listo",
        description: "Alcanza el 75% de progreso",
        condition: (progress) => progress >= 75
    },
    {
        id: "tesis-completa",
        icon: "🎓",
        title: "Maestro de Tesis",
        description: "Completa el 100% de tu tesis",
        condition: (progress) => progress >= 100
    },
    {
        id: "racha-actividad",
        icon: "⚡",
        title: "Imparable",
        description: "Realiza al menos 5 actualizaciones",
        condition: (_, activities) => activities.length >= 5
    }
]

export function getUnlockedBadges(progress: number, activities: ActividadEstudiante[]) {
    return BADGES.filter(badge => badge.condition(progress, activities))
}
