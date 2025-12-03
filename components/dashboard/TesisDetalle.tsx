"use client"

import { useState } from "react"
import useSWR, { mutate } from "swr"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { TimelineActividad } from "./TimelineActividad"
import { InformeActividad } from "./InformeActividad"
import { CheckCircle2, Loader2, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TesisDetalleProps {
    tesisId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TesisDetalle({ tesisId, open, onOpenChange }: TesisDetalleProps) {
    const { toast } = useToast()
    const [comentarioTexto, setComentarioTexto] = useState<Record<string, string>>({})
    const [nuevoHito, setNuevoHito] = useState({
        titulo: "",
        descripcion: "",
        fechaLimite: "",
    })
    const [porcentajeAsesor, setPorcentajeAsesor] = useState("")
    const [justificacion, setJustificacion] = useState("")
    const [loading, setLoading] = useState<Record<string, boolean>>({})

    const { data, error, isLoading } = useSWR(
        tesisId ? `/api/tesis/${tesisId}/detalle` : null,
        fetcher
    )

    const tesis = data?.tesis

    const handleAprobarCapitulo = async (capituloId: string) => {
        setLoading({ ...loading, [capituloId]: true })
        try {
            const res = await fetch(`/api/capitulos/${capituloId}/aprobar`, {
                method: "PATCH",
            })
            if (!res.ok) throw new Error()
            toast({ title: "Capítulo aprobado exitosamente" })
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({ title: "Error al aprobar capítulo", variant: "destructive" })
        } finally {
            setLoading({ ...loading, [capituloId]: false })
        }
    }

    const handleAgregarComentario = async (capituloId: string) => {
        const contenido = comentarioTexto[capituloId]
        if (!contenido?.trim()) return

        setLoading({ ...loading, [`comment-${capituloId}`]: true })
        try {
            const res = await fetch("/api/comentarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ capituloId, contenido }),
            })
            if (!res.ok) throw new Error()
            toast({ title: "Comentario agregado" })
            setComentarioTexto({ ...comentarioTexto, [capituloId]: "" })
            mutate(`/api/tesis/${tesisId}/detalle`)
        } catch (error) {
            toast({ title: "Error al agregar comentario", variant: "destructive" })
        } finally {
            setLoading({ ...loading, [`comment-${capituloId}`]: false })
        }
    }

    const handleCrearHito = async () => {
        if (!nuevoHito.titulo || !nuevoHito.fechaLimite) {
            toast({ title: "Completa los campos requeridos", variant: "destructive" })
            return
        }

        setLoading({ ...loading, nuevoHito: true })
        try {
            const res = await fetch("/api/hitos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...nuevoHito, tesisId }),
            })
            if (!res.ok) throw new Error()
            toast({ title: "Hito creado exitosamente" })
            setNuevoHito({ titulo: "", descripcion: "", fechaLimite: "" })
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({ title: "Error al crear hito", variant: "destructive" })
        } finally {
            setLoading({ ...loading, nuevoHito: false })
        }
    }

    const handleEliminarHito = async (hitoId: string) => {
        if (!confirm("¿Eliminar este hito?")) return

        setLoading({ ...loading, [`delete-${hitoId}`]: true })
        try {
            const res = await fetch(`/api/hitos/${hitoId}`, { method: "DELETE" })
            if (!res.ok) throw new Error()
            toast({ title: "Hito eliminado" })
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({ title: "Error al eliminar hito", variant: "destructive" })
        } finally {
            setLoading({ ...loading, [`delete-${hitoId}`]: false })
        }
    }

    const handleActualizarPorcentaje = async () => {
        const porcentaje = parseFloat(porcentajeAsesor)
        if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100 || !justificacion) {
            toast({ title: "Datos inválidos", variant: "destructive" })
            return
        }

        setLoading({ ...loading, porcentaje: true })
        try {
            const res = await fetch(`/api/tesis/${tesisId}/porcentaje-asesor`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ porcentaje, justificacion }),
            })
            if (!res.ok) throw new Error()
            toast({ title: "Porcentaje actualizado" })
            setPorcentajeAsesor("")
            setJustificacion("")
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({ title: "Error al actualizar porcentaje", variant: "destructive" })
        } finally {
            setLoading({ ...loading, porcentaje: false })
        }
    }

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isLoading ? "Cargando..." : tesis?.titulo || "Detalle de Tesis"}
                    </DialogTitle>
                </DialogHeader>

                {isLoading && (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="text-center py-8 text-red-600">
                        Error al cargar los detalles
                    </div>
                )}

                {tesis && (
                    <Tabs defaultValue="capitulos" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="capitulos">Capítulos</TabsTrigger>
                            <TabsTrigger value="hitos">Hitos</TabsTrigger>
                            <TabsTrigger value="actividad">Actividad</TabsTrigger>
                            <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
                        </TabsList>

                        <TabsContent value="capitulos" className="space-y-4">
                            {tesis.capitulos.map((cap: any) => (
                                <div key={cap.id} className="border rounded-lg p-4 space-y-3">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-medium">
                                                Capítulo {cap.numeroCapitulo}: {cap.titulo}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {cap.porcentajeCompletado}% completado
                                            </p>
                                        </div>
                                        {cap.aprobadoPorAsesor ? (
                                            <Badge variant="secondary" className="gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Aprobado
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => handleAprobarCapitulo(cap.id)}
                                                disabled={loading[cap.id]}
                                            >
                                                {loading[cap.id] ? "Aprobando..." : "Aprobar"}
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Textarea
                                            placeholder="Agregar comentario..."
                                            value={comentarioTexto[cap.id] || ""}
                                            onChange={(e) =>
                                                setComentarioTexto({
                                                    ...comentarioTexto,
                                                    [cap.id]: e.target.value,
                                                })
                                            }
                                            rows={2}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => handleAgregarComentario(cap.id)}
                                            disabled={loading[`comment-${cap.id}`]}
                                        >
                                            Agregar Comentario
                                        </Button>
                                    </div>

                                    {cap.comentarios.length > 0 && (
                                        <details className="text-sm">
                                            <summary className="cursor-pointer text-muted-foreground">
                                                Ver {cap.comentarios.length} comentarios
                                            </summary>
                                            <div className="mt-2 space-y-2">
                                                {cap.comentarios.map((com: any) => (
                                                    <div key={com.id} className="bg-muted p-2 rounded">
                                                        <p className="font-medium text-xs">
                                                            {com.autor.nombre} ({com.autor.rol})
                                                        </p>
                                                        <p className="text-sm mt-1">{com.contenido}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </details>
                                    )}
                                </div>
                            ))}
                        </TabsContent>

                        <TabsContent value="hitos" className="space-y-4">
                            <div className="border rounded-lg p-4 space-y-3">
                                <h4 className="font-medium">Crear Nuevo Hito</h4>
                                <div className="space-y-2">
                                    <Input
                                        placeholder="Título del hito"
                                        value={nuevoHito.titulo}
                                        onChange={(e) =>
                                            setNuevoHito({ ...nuevoHito, titulo: e.target.value })
                                        }
                                    />
                                    <Textarea
                                        placeholder="Descripción (opcional)"
                                        value={nuevoHito.descripcion}
                                        onChange={(e) =>
                                            setNuevoHito({ ...nuevoHito, descripcion: e.target.value })
                                        }
                                    />
                                    <Input
                                        type="date"
                                        value={nuevoHito.fechaLimite}
                                        onChange={(e) =>
                                            setNuevoHito({ ...nuevoHito, fechaLimite: e.target.value })
                                        }
                                    />
                                    <Button
                                        onClick={handleCrearHito}
                                        disabled={loading.nuevoHito}
                                        className="w-full"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {loading.nuevoHito ? "Creando..." : "Crear Hito"}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {tesis.hitos.map((hito: any) => (
                                    <div key={hito.id} className="border rounded-lg p-3 flex items-start justify-between">
                                        <div>
                                            <h5 className="font-medium">{hito.titulo}</h5>
                                            <p className="text-sm text-muted-foreground">
                                                {format(new Date(hito.fechaLimite), "d 'de' MMMM, yyyy", { locale: es })}
                                            </p>
                                            {hito.completado && (
                                                <Badge variant="secondary" className="mt-1">Completado</Badge>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleEliminarHito(hito.id)}
                                            disabled={loading[`delete-${hito.id}`]}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="actividad" className="space-y-4">
                            <InformeActividad actividades={tesis.actividades} />
                            <TimelineActividad actividades={tesis.actividades} />
                        </TabsContent>

                        <TabsContent value="ajustes" className="space-y-4">
                            <div className="border rounded-lg p-4 space-y-3">
                                <h4 className="font-medium">Actualizar Porcentaje General</h4>
                                <p className="text-sm text-muted-foreground">
                                    Porcentaje actual: {tesis.porcentajeGeneral}%
                                </p>
                                <div className="space-y-2">
                                    <Label>Nuevo Porcentaje</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={porcentajeAsesor}
                                        onChange={(e) => setPorcentajeAsesor(e.target.value)}
                                        placeholder="0-100"
                                    />
                                    <Label>Justificación (requerida)</Label>
                                    <Textarea
                                        value={justificacion}
                                        onChange={(e) => setJustificacion(e.target.value)}
                                        placeholder="Explica el motivo del ajuste..."
                                        rows={3}
                                    />
                                    <Button
                                        onClick={handleActualizarPorcentaje}
                                        disabled={loading.porcentaje}
                                        className="w-full"
                                    >
                                        {loading.porcentaje ? "Actualizando..." : "Actualizar Porcentaje"}
                                    </Button>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}
