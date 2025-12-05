"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, Pencil, Trash2, X, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { mutate } from "swr"

import { Button } from "@/components/ui/button"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const chapterSchema = z.object({
    titulo: z.string().min(3, "El título debe tener al menos 3 caracteres"),
    numeroCapitulo: z.coerce.number().int().positive("Debe ser un número positivo"),
})

type ChapterFormData = z.infer<typeof chapterSchema>

interface Capitulo {
    id: string
    numeroCapitulo: number
    titulo: string
}

interface GestionarCapitulosDialogProps {
    tesisId: string
    capitulos: Capitulo[]
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function GestionarCapitulosDialog({
    tesisId,
    capitulos,
    open: controlledOpen,
    onOpenChange: setControlledOpen,
}: GestionarCapitulosDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? setControlledOpen : setInternalOpen

    const [editingId, setEditingId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<ChapterFormData>({
        resolver: zodResolver(chapterSchema) as any,
    })

    const onAdd = async (data: ChapterFormData) => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/capitulos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, tesisId }),
            })

            if (!res.ok) throw new Error("Error al crear capítulo")

            toast({ title: "Capítulo creado" })
            reset()
            mutate(`/api/tesis/${tesisId}/detalle`)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo crear el capítulo",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onEdit = async (data: ChapterFormData) => {
        if (!editingId) return
        setIsLoading(true)
        try {
            const res = await fetch(`/api/capitulos/${editingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!res.ok) throw new Error("Error al actualizar capítulo")

            toast({ title: "Capítulo actualizado" })
            setEditingId(null)
            reset()
            mutate(`/api/tesis/${tesisId}/detalle`)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo actualizar el capítulo",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async (id: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/capitulos/${id}`, {
                method: "DELETE",
            })

            if (!res.ok) throw new Error("Error al eliminar capítulo")

            toast({ title: "Capítulo eliminado" })
            mutate(`/api/tesis/${tesisId}/detalle`)
        } catch (error) {
            toast({
                title: "Error",
                description: "No se pudo eliminar el capítulo",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const startEditing = (cap: Capitulo) => {
        setEditingId(cap.id)
        setValue("titulo", cap.titulo)
        setValue("numeroCapitulo", cap.numeroCapitulo)
    }

    const cancelEditing = () => {
        setEditingId(null)
        reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {!isControlled && (
                <DialogTrigger asChild>
                    <Button variant="outline">Gestionar Capítulos</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Gestionar Capítulos</DialogTitle>
                    <DialogDescription>
                        Agrega, edita o elimina los capítulos de esta tesis.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Formulario (Crear / Editar) */}
                    <div className="p-4 border rounded-lg bg-muted/30">
                        <h4 className="text-sm font-medium mb-3">
                            {editingId ? "Editar Capítulo" : "Nuevo Capítulo"}
                        </h4>
                        <form
                            onSubmit={handleSubmit(editingId ? onEdit : onAdd)}
                            className="flex gap-4 items-end"
                        >
                            <div className="w-20">
                                <Label htmlFor="numero" className="text-xs">
                                    Número
                                </Label>
                                <Input
                                    id="numero"
                                    type="number"
                                    placeholder="#"
                                    {...register("numeroCapitulo")}
                                    className="h-9"
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="titulo" className="text-xs">
                                    Título
                                </Label>
                                <Input
                                    id="titulo"
                                    placeholder="Nombre del capítulo"
                                    {...register("titulo")}
                                    className="h-9"
                                />
                            </div>
                            <div className="flex gap-2">
                                {editingId && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={cancelEditing}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading}>
                                    {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                </Button>
                            </div>
                        </form>
                        {(errors.titulo || errors.numeroCapitulo) && (
                            <p className="text-xs text-red-500 mt-2">
                                {errors.titulo?.message || errors.numeroCapitulo?.message}
                            </p>
                        )}
                    </div>

                    {/* Lista de Capítulos */}
                    <ScrollArea className="h-[300px] border rounded-md p-4">
                        {capitulos.length === 0 ? (
                            <p className="text-center text-muted-foreground text-sm py-8">
                                No hay capítulos asignados.
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {capitulos
                                    .slice()
                                    .sort((a, b) => a.numeroCapitulo - b.numeroCapitulo)
                                    .map((cap) => (
                                        <div
                                            key={cap.id}
                                            className={`flex items-center justify-between p-3 rounded-lg border ${editingId === cap.id ? "bg-accent border-primary" : "bg-card"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                                                    {cap.numeroCapitulo}
                                                </div>
                                                <span className="font-medium text-sm">{cap.titulo}</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                    onClick={() => startEditing(cap)}
                                                    disabled={editingId !== null && editingId !== cap.id}
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>

                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                                            disabled={editingId !== null}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>¿Eliminar capítulo?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Esta acción no se puede deshacer. Se borrarán todos los comentarios asociados a este capítulo y se recalculará el progreso global.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-destructive hover:bg-destructive/90"
                                                                onClick={() => onDelete(cap.id)}
                                                            >
                                                                Eliminar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen && setOpen(false)}>
                        Cerrar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
