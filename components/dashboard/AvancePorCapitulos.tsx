"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Comentario {
    id: string
    contenido: string
    createdAt: Date
    autor: {
        nombre: string
        avatar: string | null
    }
}

interface Capitulo {
    id: string
    numeroCapitulo: number
    titulo: string
    porcentajeCompletado: number
    aprobadoPorAsesor: boolean
    fechaAprobacion: Date | null
    comentarios: Comentario[]
}

interface AvancePorCapitulosProps {
    capitulos: Capitulo[]
    tesisId: string
}

export function AvancePorCapitulos({ capitulos, tesisId }: AvancePorCapitulosProps) {
    const [expandedChapter, setExpandedChapter] = useState<string | null>(null)
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false)
    const [selectedChapter, setSelectedChapter] = useState<Capitulo | null>(null)
    const [porcentaje, setPorcentaje] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    function handleOpenUpdate(capitulo: Capitulo) {
        setSelectedChapter(capitulo)
        setPorcentaje(capitulo.porcentajeCompletado.toString())
        setUpdateDialogOpen(true)
    }

    async function handleUpdate() {
        if (!selectedChapter) return

        const value = parseFloat(porcentaje)

        if (isNaN(value) || value < 0 || value > 100) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "El porcentaje debe estar entre 0 y 100",
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`/api/capitulos/${selectedChapter.id}/porcentaje`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ porcentaje: value }),
            })

            if (!response.ok) {
                throw new Error("Failed to update")
            }

            toast({
                title: "¡Capítulo actualizado!",
                description: `Capítulo ${selectedChapter.numeroCapitulo} ahora está al ${value}%`,
            })

            setUpdateDialogOpen(false)
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el capítulo",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (capitulos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Avance por Capítulos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground py-8">
                        No hay capítulos registrados aún
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Avance por Capítulos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {capitulos.map((capitulo) => (
                        <motion.div
                            key={capitulo.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg p-4 space-y-3"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-semibold">
                                            Capítulo {capitulo.numeroCapitulo}: {capitulo.titulo}
                                        </h3>
                                        {capitulo.aprobadoPorAsesor && (
                                            <Badge variant="default" className="gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Aprobado
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Progress value={capitulo.porcentajeCompletado} className="flex-1" />
                                        <span className="text-sm font-medium min-w-[3rem] text-right">
                                            {capitulo.porcentajeCompletado}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleOpenUpdate(capitulo)}
                                >
                                    Actualizar Progreso
                                </Button>
                                {capitulo.comentarios.length > 0 && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() =>
                                            setExpandedChapter(
                                                expandedChapter === capitulo.id ? null : capitulo.id
                                            )
                                        }
                                    >
                                        {expandedChapter === capitulo.id ? (
                                            <>
                                                <ChevronUp className="w-4 h-4 mr-1" />
                                                Ocultar comentarios
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4 mr-1" />
                                                Ver comentarios ({capitulo.comentarios.length})
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>

                            <AnimatePresence>
                                {expandedChapter === capitulo.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-3 pt-3 border-t"
                                    >
                                        {capitulo.comentarios.map((comentario) => (
                                            <div
                                                key={comentario.id}
                                                className="bg-muted p-3 rounded-md space-y-2"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                                                        {comentario.autor.nombre[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">
                                                            {comentario.autor.nombre}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {formatDistanceToNow(new Date(comentario.createdAt), {
                                                                addSuffix: true,
                                                                locale: es,
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-sm">{comentario.contenido}</p>
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>

            <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar Capítulo</DialogTitle>
                        <DialogDescription>
                            {selectedChapter && (
                                <>
                                    Capítulo {selectedChapter.numeroCapitulo}: {selectedChapter.titulo}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="porcentaje-capitulo" className="text-right">
                                Porcentaje
                            </Label>
                            <Input
                                id="porcentaje-capitulo"
                                type="number"
                                min="0"
                                max="100"
                                value={porcentaje}
                                onChange={(e) => setPorcentaje(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setUpdateDialogOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
