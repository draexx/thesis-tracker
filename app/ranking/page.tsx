"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, List, Trophy, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { VistaLista } from "@/components/ranking/VistaLista"
import { VistaPodium } from "@/components/ranking/VistaPodium"
import { EstadisticasRanking } from "@/components/ranking/EstadisticasRanking"

interface RankingEntry {
    id: string
    nombre: string
    avatar: string | null
    titulo: string
    porcentaje: number
    programa: string
    cohorte: string
}

interface Statistics {
    promedio: number
    mediana: number
    tasaProgreso: number
    totalParticipantes: number
}

interface RankingData {
    entries: RankingEntry[]
    statistics: Statistics
    filters: {
        programas: string[]
        cohortes: string[]
    }
}

export default function RankingPublico() {
    const [currentUserId, setCurrentUserId] = useState<string | undefined>()
    const [userRole, setUserRole] = useState<string | undefined>()
    const [data, setData] = useState<RankingData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Filters
    const [programa, setPrograma] = useState("todos")
    const [cohorte, setCohorte] = useState("todos")
    const [search, setSearch] = useState("")

    // View mode
    const [viewMode, setViewMode] = useState<"lista" | "podium">("lista")

    // Gamification mode (persisted in localStorage)
    const [modoGamificacion, setModoGamificacion] = useState(false)

    // Load gamification preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("modoGamificacion")
        if (saved !== null) {
            setModoGamificacion(saved === "true")
        }

        // Try to get current user ID and role from session
        const getUserInfo = async () => {
            try {
                const response = await fetch("/api/auth/session")
                const session = await response.json()
                if (session?.user?.id) {
                    setCurrentUserId(session.user.id)
                    setUserRole(session.user.rol)
                }
            } catch (error) {
                console.error("Error fetching session:", error)
            }
        }
        getUserInfo()
    }, [])

    // Save gamification preference to localStorage
    const toggleGamificacion = () => {
        const newValue = !modoGamificacion
        setModoGamificacion(newValue)
        localStorage.setItem("modoGamificacion", String(newValue))
    }

    // Fetch ranking data
    const fetchRanking = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (programa !== "todos") params.append("programa", programa)
            if (cohorte !== "todos") params.append("cohorte", cohorte)
            if (search) params.append("search", search)

            const response = await fetch(`/api/ranking?${params.toString()}`)
            if (!response.ok) throw new Error("Error al cargar el ranking")

            const result = await response.json()
            setData(result)
            setError(null)
        } catch (err) {
            setError("No se pudo cargar el ranking. Por favor, intenta de nuevo.")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    // Initial fetch
    useEffect(() => {
        fetchRanking()
    }, [])

    // Refetch when filters change
    useEffect(() => {
        fetchRanking()
    }, [programa, cohorte, search])

    // Real-time polling (every 30 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            fetchRanking()
        }, 30000)

        return () => clearInterval(interval)
    }, [programa, cohorte, search])

    if (loading && !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="container mx-auto">
                    <div className="flex items-center justify-center h-96">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Cargando ranking...</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
                <div className="container mx-auto">
                    <Card className="max-w-md mx-auto mt-20">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                                <Button onClick={fetchRanking}>Reintentar</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="container mx-auto space-y-6">
                {/* Back button */}
                {userRole && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button
                            variant="ghost"
                            asChild
                            className="mb-4"
                        >
                            <Link href={userRole === "ESTUDIANTE" ? "/dashboard/estudiante" : "/dashboard/asesor"}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver al Dashboard
                            </Link>
                        </Button>
                    </motion.div>
                )}

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center gap-3">
                        <Trophy className="h-10 w-10 text-yellow-500" />
                        Ranking de Tesis
                    </h1>
                    <p className="text-muted-foreground">
                        Compara tu progreso con otros estudiantes
                    </p>
                </motion.div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filtros</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                            {/* Program selector */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Programa
                                </label>
                                <Select value={programa} onValueChange={setPrograma}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todos los programas" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todos</SelectItem>
                                        {data?.filters.programas.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Cohorte selector */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Cohorte
                                </label>
                                <Select value={cohorte} onValueChange={setCohorte}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Todas las cohortes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Todas</SelectItem>
                                        {data?.filters.cohortes.map((c) => (
                                            <SelectItem key={c} value={c}>
                                                {c}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Search */}
                            <div className="lg:col-span-2">
                                <label className="text-sm font-medium mb-2 block">
                                    Buscar estudiante
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Nombre del estudiante..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            {/* View mode toggle */}
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium">Vista</label>
                                <div className="flex gap-2">
                                    <Button
                                        variant={viewMode === "lista" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("lista")}
                                        className="flex-1"
                                    >
                                        <List className="h-4 w-4 mr-1" />
                                        Lista
                                    </Button>
                                    <Button
                                        variant={viewMode === "podium" ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setViewMode("podium")}
                                        className="flex-1"
                                    >
                                        <Trophy className="h-4 w-4 mr-1" />
                                        Podium
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Gamification toggle */}
                        <div className="mt-4 flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                                <span className="text-sm font-medium">
                                    Modo Gamificación
                                </span>
                                {modoGamificacion && (
                                    <Badge variant="secondary" className="ml-2">
                                        Activo
                                    </Badge>
                                )}
                            </div>
                            <Button
                                variant={modoGamificacion ? "default" : "outline"}
                                size="sm"
                                onClick={toggleGamificacion}
                            >
                                {modoGamificacion ? "Desactivar" : "Activar"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Statistics */}
                {data && (
                    <EstadisticasRanking
                        promedio={data.statistics.promedio}
                        mediana={data.statistics.mediana}
                        tasaProgreso={data.statistics.tasaProgreso}
                        totalParticipantes={data.statistics.totalParticipantes}
                    />
                )}

                {/* Ranking view */}
                {data && data.entries.length > 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            {viewMode === "lista" ? (
                                <VistaLista
                                    entries={data.entries}
                                    currentUserId={currentUserId}
                                    modoGamificacion={modoGamificacion}
                                />
                            ) : (
                                <VistaPodium
                                    entries={data.entries}
                                    currentUserId={currentUserId}
                                    modoGamificacion={modoGamificacion}
                                />
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardContent className="py-12">
                            <div className="text-center text-muted-foreground">
                                <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No se encontraron resultados con los filtros aplicados.</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
