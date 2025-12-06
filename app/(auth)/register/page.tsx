"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Stepper } from "@/components/auth/Stepper"
import { registroSchema, type RegistroFormData } from "@/lib/validations/auth"
import { useToast } from "@/hooks/use-toast"

const PROGRAMAS = [
    "Maestría en Ciencias",
    "Maestría en Ingeniería",
    "Doctorado en Ciencias",
    "Doctorado en Ingeniería",
    "Otro",
]

export default function RegisterPage() {
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)
    const [customPrograma, setCustomPrograma] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        trigger,
    } = useForm<RegistroFormData>({
        resolver: zodResolver(registroSchema),
        defaultValues: {
            visibilidadPublica: true,
        },
    })

    const rol = watch("rol")
    const programa = watch("programa")
    const password = watch("password")

    const steps = ["Información Básica", "Perfil", rol === "ESTUDIANTE" ? "Configuración" : "Datos Adicionales"]

    const validateStep = async (step: number): Promise<boolean> => {
        let fieldsToValidate: (keyof RegistroFormData)[] = []

        switch (step) {
            case 1:
                fieldsToValidate = ["email", "password", "confirmarPassword"]
                break
            case 2:
                fieldsToValidate = ["nombre", "rol", "programa", "cohorte"]
                break
            case 3:
                // Step 3 fields are optional
                return true
        }

        const result = await trigger(fieldsToValidate)
        return result
    }

    const nextStep = async () => {
        const isValid = await validateStep(currentStep)
        if (isValid && currentStep < 3) {
            setCurrentStep(currentStep + 1)
        }
    }

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const onSubmit = async (data: RegistroFormData) => {
        setIsLoading(true)

        try {
            // Use custom programa if "Otro" was selected
            const finalData = {
                ...data,
                programa: data.programa === "Otro" ? customPrograma : data.programa,
            }

            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalData),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.error || "Error al registrar usuario")
            }

            // Auto-login
            const signInResult = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            })

            if (signInResult?.error) {
                toast({
                    title: "Cuenta creada",
                    description: "Por favor inicia sesión manualmente",
                })
                router.push("/login")
                return
            }

            toast({
                title: "¡Cuenta creada!",
                description: "Bienvenido a TTC",
            })

            // Redirect based on role and thesis status
            if (data.rol === "ESTUDIANTE") {
                if (result.hasThesis) {
                    router.push("/estudiante")
                } else {
                    router.push("/estudiante/onboarding")
                }
            } else {
                router.push("/asesor")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Error al crear cuenta",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <div className="mb-4">
                        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                            Thesis Track & Compare
                        </Link>
                    </div>
                    <CardTitle className="text-2xl">Crea tu cuenta en TTC</CardTitle>
                    <CardDescription>
                        Completa los siguientes pasos para comenzar a gestionar tu tesis
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Stepper steps={steps} currentStep={currentStep} />

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 mt-8"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                    >
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        {...register("email")}
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Mínimo 8 caracteres"
                                            {...register("password")}
                                            className={errors.password ? "border-red-500" : ""}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Debe contener al menos 8 caracteres, 1 mayúscula y 1 número
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="confirmarPassword">Confirmar Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmarPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Repite tu contraseña"
                                            {...register("confirmarPassword")}
                                            className={errors.confirmarPassword ? "border-red-500" : ""}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmarPassword && (
                                        <p className="text-sm text-red-500 mt-1">{errors.confirmarPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Profile */}
                        {currentStep === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre Completo</Label>
                                    <Input
                                        id="nombre"
                                        placeholder="Juan Pérez"
                                        {...register("nombre")}
                                        className={errors.nombre ? "border-red-500" : ""}
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label>Rol</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setValue("rol", value as "ESTUDIANTE" | "ASESOR")}
                                        className="flex gap-4 mt-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="ESTUDIANTE" id="estudiante" />
                                            <Label htmlFor="estudiante" className="font-normal cursor-pointer">
                                                Estudiante
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="ASESOR" id="asesor" />
                                            <Label htmlFor="asesor" className="font-normal cursor-pointer">
                                                Asesor
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.rol && (
                                        <p className="text-sm text-red-500 mt-1">{errors.rol.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="programa">Programa Académico</Label>
                                    <Select onValueChange={(value) => setValue("programa", value)}>
                                        <SelectTrigger className={errors.programa ? "border-red-500" : ""}>
                                            <SelectValue placeholder="Selecciona tu programa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PROGRAMAS.map((prog) => (
                                                <SelectItem key={prog} value={prog}>
                                                    {prog}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.programa && (
                                        <p className="text-sm text-red-500 mt-1">{errors.programa.message}</p>
                                    )}
                                </div>

                                {programa === "Otro" && (
                                    <div>
                                        <Label htmlFor="customPrograma">Especifica tu programa</Label>
                                        <Input
                                            id="customPrograma"
                                            placeholder="Nombre del programa"
                                            value={customPrograma}
                                            onChange={(e) => setCustomPrograma(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div>
                                    <Label htmlFor="cohorte">Cohorte</Label>
                                    <Input
                                        id="cohorte"
                                        placeholder="Ej: 2024-1"
                                        {...register("cohorte")}
                                        className={errors.cohorte ? "border-red-500" : ""}
                                    />
                                    {errors.cohorte && (
                                        <p className="text-sm text-red-500 mt-1">{errors.cohorte.message}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Step 3: Student Configuration */}
                        {currentStep === 3 && rol === "ESTUDIANTE" && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="tituloTesis">Título de la Tesis (Opcional)</Label>
                                    <Input
                                        id="tituloTesis"
                                        placeholder="Puedes agregarlo después"
                                        {...register("tituloTesis")}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Puedes configurar esto más tarde desde tu dashboard
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="nombreAsesor">Nombre del Asesor (Opcional)</Label>
                                    <Input
                                        id="nombreAsesor"
                                        placeholder="Nombre de tu asesor"
                                        {...register("nombreAsesor")}
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="visibilidadPublica"
                                        defaultChecked={true}
                                        onCheckedChange={(checked) => setValue("visibilidadPublica", checked as boolean)}
                                    />
                                    <Label htmlFor="visibilidadPublica" className="font-normal cursor-pointer">
                                        Acepto que mi progreso sea visible en el ranking público
                                    </Label>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Advisor Configuration */}
                        {currentStep === 3 && rol === "ASESOR" && (
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="institucion">Institución (Opcional)</Label>
                                    <Input
                                        id="institucion"
                                        placeholder="Universidad o institución"
                                        {...register("institucion")}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="departamento">Departamento (Opcional)</Label>
                                    <Input
                                        id="departamento"
                                        placeholder="Departamento o facultad"
                                        {...register("departamento")}
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                    <p className="text-sm text-blue-900 dark:text-blue-100">
                                        💡 Podrás agregar tesistas desde tu dashboard después de registrarte
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            {currentStep > 1 && (
                                <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Anterior
                                </Button>
                            )}

                            {currentStep < 3 ? (
                                <Button type="button" onClick={nextStep} className="ml-auto" disabled={isLoading}>
                                    Siguiente
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button type="submit" className="ml-auto" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creando cuenta...
                                        </>
                                    ) : (
                                        "Crear Cuenta"
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        ¿Ya tienes cuenta?{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Inicia sesión
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
