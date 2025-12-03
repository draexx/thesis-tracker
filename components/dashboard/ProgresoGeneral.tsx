"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface ProgresoGeneralProps {
    tesisId: string
    porcentajeActual: number
}

export function ProgresoGeneral({ tesisId, porcentajeActual }: ProgresoGeneralProps) {
    const [open, setOpen] = useState(false)
    const [porcentaje, setPorcentaje] = useState(porcentajeActual.toString())
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    async function handleUpdate() {
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
            const response = await fetch(`/api/tesis/${tesisId}/porcentaje`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ porcentaje: value }),
            })

            if (!response.ok) {
                throw new Error("Failed to update")
            }

            toast({
                title: "¡Progreso actualizado!",
                description: `Tu progreso ahora es del ${value}%`,
            })

            setOpen(false)
            router.refresh()
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el progreso",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Progreso General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="text-6xl font-bold text-primary mb-2"
                    >
                        {porcentajeActual}%
                    </motion.div>
                    <p className="text-sm text-muted-foreground">Completado</p>
                </div>

                <div className="space-y-2">
                    <Progress value={porcentajeActual} className="h-4" />
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${porcentajeActual}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full">Actualizar Progreso</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Actualizar Progreso General</DialogTitle>
                            <DialogDescription>
                                Ingresa el nuevo porcentaje de avance de tu tesis (0-100)
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="porcentaje" className="text-right">
                                    Porcentaje
                                </Label>
                                <Input
                                    id="porcentaje"
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
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button onClick={handleUpdate} disabled={isLoading}>
                                {isLoading ? "Guardando..." : "Guardar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    )
}
