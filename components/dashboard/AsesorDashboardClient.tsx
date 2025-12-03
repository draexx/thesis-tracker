"use client"

import { useState, useMemo } from "react"
import useSWR from "swr"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { TesistaCard } from "@/components/dashboard/TesistaCard"
import { TesisDetalle } from "@/components/dashboard/TesisDetalle"
import { Search, Users, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { AlertLevel } from "@/lib/utils/alertas"
import { Skeleton } from "@/components/ui/skeleton"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function AsesorDashboardClient() {
    const [search, setSearch] = useState("")
    const [programaFilter, setProgramaFilter] = useState("todos")
    const [cohorteFilter, setCohorteFilter] = useState("todos")
    const [alertaFilter, setAlertaFilter] = useState<"todos" | AlertLevel>("todos")
    const [sortBy, setSortBy] = useState<"alerta" | "progreso" | "actividad">("alerta")
    const [selectedTesisId, setSelectedTesisId] = useState<string | null>(null)

    const { data, error, isLoading } = useSWR("/api/asesor/tesistas", fetcher, {
        refreshInterval: 30000, // Refresh every 30 seconds
    })

    const tesistas = data?.tesistas || []

    // Get unique programs and cohortes
    const programas = useMemo(() => {
        if (!tesistas) return []
        const unique = new Set(tesistas.map((t: any) => t?.estudiante?.programa).filter(Boolean))
        return Array.from(unique) as string[]
    }, [tesistas])

    const cohortes = useMemo(() => {
        if (!tesistas) return []
        const unique = new Set(tesistas.map((t: any) => t?.estudiante?.cohorte).filter(Boolean))
        return Array.from(unique) as string[]
    }, [tesistas])

    // Filter and sort tesistas
    const filteredTesistas = useMemo(() => {
        if (!tesistas) return []

        let filtered = tesistas.filter((t: any) => {
            if (!t || !t.estudiante) return false

            const nombre = t.estudiante.nombre || ""
            const titulo = t.titulo || ""
            const programa = t.estudiante.programa || ""
            const cohorte = t.estudiante.cohorte || ""
            const alerta = t.alerta || "verde"

            const matchSearch =
                nombre.toLowerCase().includes(search.toLowerCase()) ||
                titulo.toLowerCase().includes(search.toLowerCase())
            const matchPrograma =
                programaFilter === "todos" || programa === programaFilter
            const matchCohorte =
                cohorteFilter === "todos" || cohorte === cohorteFilter
            const matchAlerta = alertaFilter === "todos" || alerta === alertaFilter

            return matchSearch && matchPrograma && matchCohorte && matchAlerta
        })

        // Sort
        filtered.sort((a: any, b: any) => {
            if (sortBy === "alerta") {
                const order = { rojo: 0, amarillo: 1, verde: 2 }
                const alertaA = a.alerta || "verde"
                const alertaB = b.alerta || "verde"
                return order[alertaA as keyof typeof order] - order[alertaB as keyof typeof order]
            } else if (sortBy === "progreso") {
                return (b.porcentajeGeneral || 0) - (a.porcentajeGeneral || 0)
            } else {
                // actividad
                const aTime = a.ultimaActividad ? new Date(a.ultimaActividad).getTime() : 0
                const bTime = b.ultimaActividad ? new Date(b.ultimaActividad).getTime() : 0
                return bTime - aTime
            }
        })

        return filtered
    }, [tesistas, search, programaFilter, cohorteFilter, alertaFilter, sortBy])

    // Calculate stats
    const stats = useMemo(() => {
        if (!tesistas) return { total: 0, rojos: 0, amarillos: 0, verdes: 0 }

        const total = tesistas.length
        const rojos = tesistas.filter((t: any) => t?.alerta === "rojo").length
        const amarillos = tesistas.filter((t: any) => t?.alerta === "amarillo").length
        const verdes = tesistas.filter((t: any) => t?.alerta === "verde").length

        return { total, rojos, amarillos, verdes }
    }, [tesistas])

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas Rojas</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">{stats.rojos}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Alertas Amarillas</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">{stats.amarillos}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Buen Estado</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{stats.verdes}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={programaFilter} onValueChange={setProgramaFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Programa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los programas</SelectItem>
                                {programas.map((p) => (
                                    <SelectItem key={p} value={p}>
                                        {p}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={cohorteFilter} onValueChange={setCohorteFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Cohorte" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todas las cohortes</SelectItem>
                                {cohortes.map((c) => (
                                    <SelectItem key={c} value={c}>
                                        {c}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={alertaFilter} onValueChange={(v) => setAlertaFilter(v as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todos">Todos los estados</SelectItem>
                                <SelectItem value="rojo">🔴 Rojo</SelectItem>
                                <SelectItem value="amarillo">🟡 Amarillo</SelectItem>
                                <SelectItem value="verde">🟢 Verde</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="alerta">Por alerta</SelectItem>
                                <SelectItem value="progreso">Por progreso</SelectItem>
                                <SelectItem value="actividad">Por actividad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Grid of students */}
            {isLoading && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            )}

            {error && (
                <Card>
                    <CardContent className="py-8 text-center text-red-600">
                        Error al cargar los estudiantes. Por favor intente recargar la página.
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && filteredTesistas.length === 0 && (
                <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No se encontraron estudiantes con los filtros aplicados
                    </CardContent>
                </Card>
            )}

            {!isLoading && !error && filteredTesistas.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTesistas.map((tesista: any) => (
                        <TesistaCard
                            key={tesista.id}
                            tesista={tesista}
                            onVerDetalles={() => setSelectedTesisId(tesista.id)}
                        />
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <TesisDetalle
                tesisId={selectedTesisId}
                open={selectedTesisId !== null}
                onOpenChange={(open) => !open && setSelectedTesisId(null)}
            />
        </div>
    )
}
