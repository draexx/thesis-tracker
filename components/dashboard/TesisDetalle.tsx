"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, MessageSquare, Plus, Trash2, AlertTriangle, Save } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import useSWR, { mutate } from "swr"
import { useToast } from "@/hooks/use-toast"
import { InformeActividad } from "@/components/dashboard/InformeActividad"
import { TimelineActividad } from "@/components/dashboard/TimelineActividad"
import { Logros } from "@/components/dashboard/Logros"

interface TesisDetalleProps {
    tesisId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function TesisDetalle({ tesisId, open, onOpenChange }: TesisDetalleProps) {
    const { toast } = useToast()
    const { data, isLoading } = useSWR(
        tesisId ? `/api/tesis/${tesisId}/detalle` : null,
        fetcher
    )
    const [nuevoComentario, setNuevoComentario] = useState("")
    const [capituloSeleccionado, setCapituloSeleccionado] = useState<string | null>(null)

    // Estado para nuevo hito
    const [nuevoHitoTitulo, setNuevoHitoTitulo] = useState("")
    const [nuevoHitoFecha, setNuevoHitoFecha] = useState("")

    // Estado para ajuste de porcentaje
    const [nuevoPorcentaje, setNuevoPorcentaje] = useState<number>(0)
    const [justificacionPorcentaje, setJustificacionPorcentaje] = useState("")

    const tesis = data?.tesis

    const handleAprobarCapitulo = async (capituloId: string) => {
        try {
            const res = await fetch(`/api/capitulos/${capituloId}/aprobar`, {
                method: "PATCH",
            })
            if (!res.ok) throw new Error("Error al aprobar capítulo")

            toast({
                title: "Capítulo aprobado",
                description: "El capítulo ha sido marcado como aprobado.",
            })
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo aprobar el capítulo.",
                variant: "destructive",
            })
        }
    }

    const handleEnviarComentario = async (capituloId: string) => {
        if (!nuevoComentario.trim()) return

        try {
            const res = await fetch("/api/comentarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    capituloId,
                    contenido: nuevoComentario,
                }),
            })
            if (!res.ok) throw new Error("Error al enviar comentario")

            setNuevoComentario("")
            setCapituloSeleccionado(null)
            toast({
                title: "Comentario enviado",
                description: "Tu comentario ha sido agregado exitosamente.",
            })
            mutate(`/api/tesis/${tesisId}/detalle`)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo enviar el comentario.",
                variant: "destructive",
            })
        }
    }

    const handleCrearHito = async () => {
        if (!nuevoHitoTitulo || !nuevoHitoFecha) return

        try {
            const res = await fetch("/api/hitos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tesisId,
                    titulo: nuevoHitoTitulo,
                    fechaLimite: nuevoHitoFecha,
                }),
            })
            if (!res.ok) throw new Error("Error al crear hito")

            setNuevoHitoTitulo("")
            setNuevoHitoFecha("")
            toast({
                title: "Hito creado",
                description: "El nuevo hito ha sido asignado.",
            })
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo crear el hito.",
                variant: "destructive",
            })
        }
    }

    const handleEliminarHito = async (hitoId: string) => {
        try {
            const res = await fetch(`/api/hitos/${hitoId}`, {
                method: "DELETE",
            })
            if (!res.ok) throw new Error("Error al eliminar hito")

            toast({
                title: "Hito eliminado",
                description: "El hito ha sido eliminado correctamente.",
            })
            mutate(`/api/tesis/${tesisId}/detalle`)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo eliminar el hito.",
                variant: "destructive",
            })
        }
    }

    const handleActualizarPorcentaje = async () => {
        if (!justificacionPorcentaje) {
            toast({
                title: "Requerido",
                description: "Debes ingresar una justificación para el cambio.",
                variant: "destructive",
            })
            return
        }

        try {
            const res = await fetch(`/api/tesis/${tesisId}/porcentaje-asesor`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    porcentaje: nuevoPorcentaje,
                    justificacion: justificacionPorcentaje,
                }),
            })
            if (!res.ok) throw new Error("Error al actualizar porcentaje")

            setJustificacionPorcentaje("")
            toast({
                title: "Porcentaje actualizado",
                description: "El progreso general ha sido modificado.",
            })
            mutate(`/api/tesis/${tesisId}/detalle`)
            mutate("/api/asesor/tesistas")
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el porcentaje.",
                variant: "destructive",
            })
        }
    }

    if (!tesis) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={tesis.estudiante.avatar || undefined} />
                            <AvatarFallback>{tesis.estudiante.nombre[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-2xl">{tesis.estudiante.nombre}</DialogTitle>
                            <DialogDescription className="text-base mt-1">
                                {tesis.titulo}
                            </DialogDescription>
                            <div className="flex gap-2 mt-2">
                                <Badge variant="outline">{tesis.estudiante.programa}</Badge>
                                <Badge variant="secondary">{tesis.estudiante.cohorte}</Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <Tabs defaultValue="capitulos" className="flex-1 flex flex-col min-h-0">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="capitulos">Capítulos</TabsTrigger>
                        <TabsTrigger value="hitos">Hitos</TabsTrigger>
                        <TabsTrigger value="actividad">Actividad</TabsTrigger>
                        <TabsTrigger value="ajustes">Ajustes</TabsTrigger>
                    </TabsList>

                    <ScrollArea className="flex-1 p-4">
                        <TabsContent value="capitulos" className="space-y-4 mt-0">
                            {tesis.capitulos.map((capitulo: any) => (
                                <Card key={capitulo.id}>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg">
                                                Capítulo {capitulo.numeroCapitulo}: {capitulo.titulo}
                                            </CardTitle>
                                            {capitulo.aprobadoPorAsesor ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">
                                                    <CheckCircle className="w-3 h-3 mr-1" /> Aprobado
                                                </Badge>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAprobarCapitulo(capitulo.id)}
                                                >
                                                    Aprobar
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex justify-between text-sm text-muted-foreground">
                                                <span>Progreso: {capitulo.porcentajeCompletado}%</span>
                                                <span>Última mod: {format(new Date(capitulo.updatedAt), "dd/MM/yyyy")}</span>
                                            </div>

                                            {/* Sección de Comentarios */}
                                            <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                                <h4 className="font-medium text-sm flex items-center gap-2">
                                                    <MessageSquare className="w-4 h-4" /> Comentarios
                                                </h4>
                                                {capitulo.comentarios.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {capitulo.comentarios.map((comentario: any) => (
                                                            <div key={comentario.id} className="bg-background p-3 rounded shadow-sm text-sm">
                                                                <div className="flex justify-between mb-1">
                                                                    <span className="font-semibold">{comentario.autor.nombre}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {format(new Date(comentario.createdAt), "dd/MM HH:mm")}
                                                                    </span>
                                                                </div>
                                                                <p>{comentario.contenido}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground italic">No hay comentarios aún.</p>
                                                )}

                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Escribe un comentario..."
                                                        value={capituloSeleccionado === capitulo.id ? nuevoComentario : ""}
                                                        onChange={(e) => {
                                                            setCapituloSeleccionado(capitulo.id)
                                                            setNuevoComentario(e.target.value)
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter" && !e.shiftKey) {
                                                                e.preventDefault()
                                                                handleEnviarComentario(capitulo.id)
                                                            }
                                                        }}
                                                    />
                                                    <Button
                                                        size="icon"
                                                        disabled={!nuevoComentario.trim() || capituloSeleccionado !== capitulo.id}
                                                        onClick={() => handleEnviarComentario(capitulo.id)}
                                                    >
                                                        <MessageSquare className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </TabsContent>

                        <TabsContent value="hitos" className="space-y-4 mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Nuevo Hito</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-3 items-end">
                                        <div className="space-y-2">
                                            <Label>Título</Label>
                                            <Input
                                                value={nuevoHitoTitulo}
                                                onChange={(e) => setNuevoHitoTitulo(e.target.value)}
                                                placeholder="Ej: Entrega Borrador Cap. 1"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Fecha Límite</Label>
                                            <Input
                                                type="date"
                                                value={nuevoHitoFecha}
                                                onChange={(e) => setNuevoHitoFecha(e.target.value)}
                                            />
                                        </div>
                                        <Button onClick={handleCrearHito} disabled={!nuevoHitoTitulo || !nuevoHitoFecha}>
                                            <Plus className="w-4 h-4 mr-2" /> Crear Hito
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                {tesis.hitos.map((hito: any) => (
                                    <div
                                        key={hito.id}
                                        className="flex items-center justify-between p-4 border rounded-lg bg-card"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${hito.completado ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                {hito.completado ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <p className="font-medium">{hito.titulo}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Vence: {format(new Date(hito.fechaLimite), "d 'de' MMMM, yyyy", { locale: es })}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            onClick={() => handleEliminarHito(hito.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="actividad" className="space-y-4 mt-0">
                            <Logros progress={tesis.porcentajeGeneral} activities={tesis.actividades} />
                            <InformeActividad actividades={tesis.actividades} />
                            <TimelineActividad actividades={tesis.actividades} />
                        </TabsContent>

                        <TabsContent value="ajustes" className="space-y-4 mt-0">
                            <Card className="border-destructive/50">
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                                        <AlertTriangle className="w-5 h-5" />
                                        Zona de Ajuste Manual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        Como asesor, puedes anular el cálculo automático del porcentaje de avance si consideras que no refleja la realidad.
                                        Esta acción quedará registrada en el historial.
                                    </p>

                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label>Nuevo Porcentaje General (0-100)</Label>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={nuevoPorcentaje}
                                                onChange={(e) => setNuevoPorcentaje(Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Justificación del cambio (Requerido)</Label>
                                            <Textarea
                                                placeholder="Explique por qué está ajustando manualmente el porcentaje..."
                                                value={justificacionPorcentaje}
                                                onChange={(e) => setJustificacionPorcentaje(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            variant="destructive"
                                            onClick={handleActualizarPorcentaje}
                                            disabled={!justificacionPorcentaje}
                                        >
                                            <Save className="w-4 h-4 mr-2" /> Guardar Cambio Manual
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
