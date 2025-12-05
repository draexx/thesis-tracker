"use client"

import { mutate } from "swr"


import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Plus, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

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

const asignarTesisSchema = z.object({
    emailEstudiante: z.string().email("Email inválido"),
    tituloTesis: z.string().min(5, "El título debe tener al menos 5 caracteres"),
})

type AsignarTesisFormData = z.infer<typeof asignarTesisSchema>

export function AsignarTesisDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AsignarTesisFormData>({
        resolver: zodResolver(asignarTesisSchema),
    })

    const onSubmit = async (data: AsignarTesisFormData) => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/tesis/asignar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al asignar tesis")
            }

            toast({
                title: "Tesis asignada",
                description: "El estudiante ha sido vinculado exitosamente.",
            })
            mutate("/api/asesor/tesistas")
            setOpen(false)
            reset()
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error desconocido",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    Asignar Nuevo Estudiante
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Asignar Tesis</DialogTitle>
                    <DialogDescription>
                        Ingresa el email del estudiante registrado para asignarle una nueva tesis bajo tu supervisión.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="emailEstudiante">Email del Estudiante</Label>
                            <Input
                                id="emailEstudiante"
                                placeholder="estudiante@ejemplo.com"
                                {...register("emailEstudiante")}
                                className={errors.emailEstudiante ? "border-red-500" : ""}
                            />
                            {errors.emailEstudiante && (
                                <p className="text-sm text-red-500">{errors.emailEstudiante.message}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tituloTesis">Título Provisional</Label>
                            <Input
                                id="tituloTesis"
                                placeholder="Título de la tesis"
                                {...register("tituloTesis")}
                                className={errors.tituloTesis ? "border-red-500" : ""}
                            />
                            {errors.tituloTesis && (
                                <p className="text-sm text-red-500">{errors.tituloTesis.message}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Asignando...
                                </>
                            ) : (
                                "Asignar Tesis"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
