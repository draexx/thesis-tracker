import * as z from "zod"

export const registroSchema = z.object({
    // Paso 1 - Información Básica
    email: z.string().email("Email inválido"),
    password: z
        .string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmarPassword: z.string(),

    // Paso 2 - Perfil
    nombre: z.string().min(2, "Nombre muy corto"),
    rol: z.enum(["ESTUDIANTE", "ASESOR"]),
    programa: z.string().min(1, "Selecciona un programa"),
    cohorte: z.string().min(1, "Ingresa tu cohorte"),

    // Paso 3 - Campos opcionales (Estudiante)
    tituloTesis: z.string().optional(),
    nombreAsesor: z.string().optional(),
    visibilidadPublica: z.boolean().optional(),

    // Paso 3 - Campos opcionales (Asesor)
    institucion: z.string().optional(),
    departamento: z.string().optional(),
}).refine((data) => data.password === data.confirmarPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarPassword"],
})

export type RegistroFormData = z.infer<typeof registroSchema>
