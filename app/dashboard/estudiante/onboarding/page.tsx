"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper } from "@/components/auth/Stepper"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

const DEFAULT_CHAPTERS = [
    { numero: 1, titulo: "Introducción" },
    { numero: 2, titulo: "Marco Teórico" },
    { numero: 3, titulo: "Metodología" },
    { numero: 4, titulo: "Resultados" },
    { numero: 5, titulo: "Conclusiones" },
]

export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [tituloTesis, setTituloTesis] = useState("")
    const [nombreAsesor, setNombreAsesor] = useState("")
    const [chapters, setChapters] = useState(DEFAULT_CHAPTERS)
    const [useCustomChapters, setUseCustomChapters] = useState(false)
    const router = useRouter()
    const { toast } = useToast()
    const { data: session } = useSession()

    const steps = ["Información de Tesis", "Estructura de Capítulos"]

    const handleSkip = () => {
        router.push("/dashboard/estudiante")
    }

    const handleChapterChange = (index: number, field: "titulo", value: string) => {
        const newChapters = [...chapters]
        newChapters[index] = { ...newChapters[index], [field]: value }
        setChapters(newChapters)
    }

    const addChapter = () => {
        setChapters([
            ...chapters,
            { numero: chapters.length + 1, titulo: "" },
        ])
    }

    const removeChapter = (index: number) => {
        if (chapters.length > 1) {
            const newChapters = chapters.filter((_, i) => i !== index)
            // Renumber chapters
            setChapters(newChapters.map((ch, i) => ({ ...ch, numero: i + 1 })))
        }
    }

    const handleSubmit = async () => {
        if (!tituloTesis.trim()) {
            toast({
                title: "Error",
                description: "Por favor ingresa el título de tu tesis",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        try {
            // Find advisor if name provided
            let asesorId = session?.user?.id

            if (nombreAsesor.trim()) {
                const asesorResponse = await fetch(`/api/users/search?nombre=${encodeURIComponent(nombreAsesor)}&rol=ASESOR`)
                if (asesorResponse.ok) {
                    const asesores = await asesorResponse.json()
                    if (asesores.length > 0) {
                        asesorId = asesores[0].id
                    }
                }
            }

            // Create thesis
            const response = await fetch("/api/tesis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titulo: tituloTesis,
                    asesorId: asesorId,
                    plantillaIndice: { capitulos: chapters },
                }),
            })

            if (!response.ok) {
                throw new Error("Error al crear la tesis")
            }

            toast({
                title: "¡Tesis creada!",
                description: "Tu tesis ha sido configurada exitosamente",
            })

            router.push("/dashboard/estudiante")
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al crear la tesis",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Configuración Inicial</CardTitle>
                    <CardDescription>
                        Configura tu tesis para comenzar a hacer seguimiento de tu progreso
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Stepper steps={steps} currentStep={currentStep} />

                    <div className="mt-8 space-y-6">
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="tituloTesis">Título de la Tesis *</Label>
                                    <Input
                                        id="tituloTesis"
                                        placeholder="Ingresa el título de tu tesis"
                                        value={tituloTesis}
                                        onChange={(e) => setTituloTesis(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="nombreAsesor">Nombre del Asesor (Opcional)</Label>
                                    <Input
                                        id="nombreAsesor"
                                        placeholder="Buscar asesor por nombre"
                                        value={nombreAsesor}
                                        onChange={(e) => setNombreAsesor(e.target.value)}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Si no encuentras a tu asesor, puedes asignarlo después
                                    </p>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Checkbox
                                        id="useCustomChapters"
                                        checked={useCustomChapters}
                                        onCheckedChange={(checked) => {
                                            setUseCustomChapters(checked as boolean)
                                            if (!checked) {
                                                setChapters(DEFAULT_CHAPTERS)
                                            }
                                        }}
                                    />
                                    <Label htmlFor="useCustomChapters" className="font-normal cursor-pointer">
                                        Personalizar estructura de capítulos
                                    </Label>
                                </div>

                                {!useCustomChapters && (
                                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                            Plantilla por defecto:
                                        </p>
                                        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                            {DEFAULT_CHAPTERS.map((ch) => (
                                                <li key={ch.numero}>
                                                    {ch.numero}. {ch.titulo}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {useCustomChapters && (
                                    <div className="space-y-3">
                                        {chapters.map((chapter, index) => (
                                            <div key={index} className="flex gap-2 items-start">
                                                <div className="flex-1">
                                                    <Label htmlFor={`chapter-${index}`} className="text-xs">
                                                        Capítulo {chapter.numero}
                                                    </Label>
                                                    <Input
                                                        id={`chapter-${index}`}
                                                        placeholder="Título del capítulo"
                                                        value={chapter.titulo}
                                                        onChange={(e) => handleChapterChange(index, "titulo", e.target.value)}
                                                    />
                                                </div>
                                                {chapters.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeChapter(index)}
                                                        className="mt-6"
                                                    >
                                                        Eliminar
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addChapter}
                                            className="w-full"
                                        >
                                            + Agregar Capítulo
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                        <div>
                            {currentStep > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    disabled={isLoading}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Anterior
                                </Button>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleSkip}
                                disabled={isLoading}
                            >
                                Omitir por ahora
                            </Button>

                            {currentStep < 2 ? (
                                <Button
                                    type="button"
                                    onClick={() => setCurrentStep(2)}
                                    disabled={!tituloTesis.trim() || isLoading}
                                >
                                    Siguiente
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creando...
                                        </>
                                    ) : (
                                        "Finalizar"
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
