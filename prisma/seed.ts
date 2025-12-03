import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding database...')

    // Hash password for all users
    const hashedPassword = await bcrypt.hash('123456', 10)

    // Create Advisors
    const asesor1 = await prisma.user.upsert({
        where: { email: 'asesor1@ttc.com' },
        update: {},
        create: {
            email: 'asesor1@ttc.com',
            password: hashedPassword,
            nombre: 'Dr. María González',
            rol: 'ASESOR',
            programa: 'Doctorado en Ciencias de la Computación',
            cohorte: 'Profesor',
        },
    })

    const asesor2 = await prisma.user.upsert({
        where: { email: 'asesor2@ttc.com' },
        update: {},
        create: {
            email: 'asesor2@ttc.com',
            password: hashedPassword,
            nombre: 'Dr. Carlos Ramírez',
            rol: 'ASESOR',
            programa: 'Maestría en Ingeniería de Software',
            cohorte: 'Profesor',
        },
    })

    // Create Students
    const estudiante1 = await prisma.user.upsert({
        where: { email: 'estudiante1@ttc.com' },
        update: {},
        create: {
            email: 'estudiante1@ttc.com',
            password: hashedPassword,
            nombre: 'Ana Martínez',
            rol: 'ESTUDIANTE',
            programa: 'Maestría en Ciencias de la Computación',
            cohorte: '2024-1',
        },
    })

    const estudiante2 = await prisma.user.upsert({
        where: { email: 'estudiante2@ttc.com' },
        update: {},
        create: {
            email: 'estudiante2@ttc.com',
            password: hashedPassword,
            nombre: 'Luis Hernández',
            rol: 'ESTUDIANTE',
            programa: 'Maestría en Ciencias de la Computación',
            cohorte: '2024-1',
        },
    })

    const estudiante3 = await prisma.user.upsert({
        where: { email: 'estudiante3@ttc.com' },
        update: {},
        create: {
            email: 'estudiante3@ttc.com',
            password: hashedPassword,
            nombre: 'Carmen Silva',
            rol: 'ESTUDIANTE',
            programa: 'Maestría en Ingeniería de Software',
            cohorte: '2024-2',
        },
    })

    console.log('✅ Usuarios creados')

    // Create thesis for estudiante1
    const tesis1 = await prisma.tesis.upsert({
        where: { estudianteId: estudiante1.id },
        update: {},
        create: {
            titulo: 'Aplicación de Machine Learning en la Detección de Fraudes Financieros',
            estudianteId: estudiante1.id,
            asesorId: asesor1.id,
            porcentajeGeneral: 45,
            estado: 'EN_PROGRESO',
            visibilidadPublica: true,
            plantillaIndice: {
                capitulos: [
                    { numero: 1, titulo: 'Introducción' },
                    { numero: 2, titulo: 'Marco Teórico' },
                    { numero: 3, titulo: 'Metodología' },
                    { numero: 4, titulo: 'Resultados' },
                    { numero: 5, titulo: 'Conclusiones' },
                ],
            },
        },
    })

    console.log('✅ Tesis creada para Ana Martínez')

    // Create chapters for tesis1
    const cap1 = await prisma.capitulo.create({
        data: {
            tesisId: tesis1.id,
            numeroCapitulo: 1,
            titulo: 'Introducción',
            porcentajeCompletado: 100,
            aprobadoPorAsesor: true,
            fechaAprobacion: new Date('2024-10-15'),
            orden: 1,
        },
    })

    const cap2 = await prisma.capitulo.create({
        data: {
            tesisId: tesis1.id,
            numeroCapitulo: 2,
            titulo: 'Marco Teórico',
            porcentajeCompletado: 80,
            aprobadoPorAsesor: false,
            orden: 2,
        },
    })

    const cap3 = await prisma.capitulo.create({
        data: {
            tesisId: tesis1.id,
            numeroCapitulo: 3,
            titulo: 'Metodología',
            porcentajeCompletado: 60,
            aprobadoPorAsesor: false,
            orden: 3,
        },
    })

    const cap4 = await prisma.capitulo.create({
        data: {
            tesisId: tesis1.id,
            numeroCapitulo: 4,
            titulo: 'Resultados',
            porcentajeCompletado: 30,
            aprobadoPorAsesor: false,
            orden: 4,
        },
    })

    const cap5 = await prisma.capitulo.create({
        data: {
            tesisId: tesis1.id,
            numeroCapitulo: 5,
            titulo: 'Conclusiones',
            porcentajeCompletado: 0,
            aprobadoPorAsesor: false,
            orden: 5,
        },
    })

    console.log('✅ Capítulos creados')

    // Create comments
    await prisma.comentario.createMany({
        data: [
            {
                capituloId: cap2.id,
                autorId: asesor1.id,
                contenido: 'Excelente trabajo en la revisión de literatura. Considera agregar más referencias sobre redes neuronales.',
            },
            {
                capituloId: cap2.id,
                autorId: asesor1.id,
                contenido: 'La sección de algoritmos de detección está muy completa. Buen trabajo!',
            },
            {
                capituloId: cap3.id,
                autorId: asesor1.id,
                contenido: 'La metodología está bien estructurada. Asegúrate de detallar más el proceso de validación cruzada.',
            },
        ],
    })

    console.log('✅ Comentarios creados')

    // Create milestones
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)
    const nextMonth = new Date(today)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    await prisma.hito.createMany({
        data: [
            {
                tesisId: tesis1.id,
                capituloId: cap4.id,
                titulo: 'Completar análisis de datos',
                descripcion: 'Finalizar el análisis estadístico de los resultados experimentales',
                fechaLimite: tomorrow,
                completado: false,
            },
            {
                tesisId: tesis1.id,
                capituloId: cap3.id,
                titulo: 'Revisión de metodología con asesor',
                descripcion: 'Reunión para validar el enfoque metodológico',
                fechaLimite: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days
                completado: false,
            },
            {
                tesisId: tesis1.id,
                capituloId: cap5.id,
                titulo: 'Redactar conclusiones preliminares',
                descripcion: 'Primera versión de las conclusiones basadas en resultados actuales',
                fechaLimite: nextWeek,
                completado: false,
            },
            {
                tesisId: tesis1.id,
                titulo: 'Presentación de avances',
                descripcion: 'Presentar avances ante el comité académico',
                fechaLimite: nextMonth,
                completado: false,
            },
            {
                tesisId: tesis1.id,
                capituloId: cap1.id,
                titulo: 'Introducción aprobada',
                descripcion: 'Capítulo de introducción revisado y aprobado',
                fechaLimite: new Date('2024-10-15'),
                completado: true,
                fechaCompletado: new Date('2024-10-15'),
            },
        ],
    })

    console.log('✅ Hitos creados')

    // Create activity records
    await prisma.actividadEstudiante.createMany({
        data: [
            {
                tesisId: tesis1.id,
                tipo: 'ACTUALIZACION_PORCENTAJE',
                descripcion: 'Actualizó el porcentaje general de 40% a 45%',
                valorAnterior: { porcentaje: 40 },
                valorNuevo: { porcentaje: 45 },
                timestamp: new Date(),
            },
            {
                tesisId: tesis1.id,
                tipo: 'ACTUALIZACION_CAPITULO',
                descripcion: 'Actualizó el capítulo 4: Resultados a 30%',
                valorAnterior: { capituloId: cap4.id, porcentaje: 20 },
                valorNuevo: { capituloId: cap4.id, porcentaje: 30 },
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        ],
    })

    console.log('✅ Actividades creadas')

    console.log('\n📧 Usuarios disponibles:')
    console.log('   Asesores:')
    console.log('   - asesor1@ttc.com (Dr. María González)')
    console.log('   - asesor2@ttc.com (Dr. Carlos Ramírez)')
    console.log('   Estudiantes:')
    console.log('   - estudiante1@ttc.com (Ana Martínez) - CON TESIS')
    console.log('   - estudiante2@ttc.com (Luis Hernández)')
    console.log('   - estudiante3@ttc.com (Carmen Silva)')
    console.log('🔑 Contraseña para todos: 123456')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
