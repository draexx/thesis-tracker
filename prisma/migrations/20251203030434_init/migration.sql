-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ESTUDIANTE', 'ASESOR');

-- CreateEnum
CREATE TYPE "EstadoTesis" AS ENUM ('EN_PROGRESO', 'FINALIZADA', 'SUSPENDIDA');

-- CreateEnum
CREATE TYPE "TipoActividad" AS ENUM ('ACTUALIZACION_PORCENTAJE', 'ACTUALIZACION_CAPITULO', 'COMPLETADO_HITO');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "programa" TEXT NOT NULL,
    "cohorte" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tesis" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "asesorId" TEXT NOT NULL,
    "porcentajeGeneral" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "plantillaIndice" JSONB NOT NULL,
    "visibilidadPublica" BOOLEAN NOT NULL DEFAULT true,
    "estado" "EstadoTesis" NOT NULL DEFAULT 'EN_PROGRESO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Capitulo" (
    "id" TEXT NOT NULL,
    "tesisId" TEXT NOT NULL,
    "numeroCapitulo" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "porcentajeCompletado" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "aprobadoPorAsesor" BOOLEAN NOT NULL DEFAULT false,
    "fechaAprobacion" TIMESTAMP(3),
    "orden" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Capitulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comentario" (
    "id" TEXT NOT NULL,
    "capituloId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hito" (
    "id" TEXT NOT NULL,
    "tesisId" TEXT NOT NULL,
    "capituloId" TEXT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaLimite" TIMESTAMP(3) NOT NULL,
    "completado" BOOLEAN NOT NULL DEFAULT false,
    "fechaCompletado" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActividadEstudiante" (
    "id" TEXT NOT NULL,
    "tesisId" TEXT NOT NULL,
    "tipo" "TipoActividad" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "valorAnterior" JSONB,
    "valorNuevo" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActividadEstudiante_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tesis_estudianteId_key" ON "Tesis"("estudianteId");

-- CreateIndex
CREATE INDEX "Tesis_estudianteId_idx" ON "Tesis"("estudianteId");

-- CreateIndex
CREATE INDEX "Tesis_asesorId_idx" ON "Tesis"("asesorId");

-- CreateIndex
CREATE INDEX "Capitulo_tesisId_idx" ON "Capitulo"("tesisId");

-- CreateIndex
CREATE INDEX "Comentario_capituloId_idx" ON "Comentario"("capituloId");

-- CreateIndex
CREATE INDEX "Hito_tesisId_idx" ON "Hito"("tesisId");

-- CreateIndex
CREATE INDEX "ActividadEstudiante_tesisId_idx" ON "ActividadEstudiante"("tesisId");

-- AddForeignKey
ALTER TABLE "Tesis" ADD CONSTRAINT "Tesis_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tesis" ADD CONSTRAINT "Tesis_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Capitulo" ADD CONSTRAINT "Capitulo_tesisId_fkey" FOREIGN KEY ("tesisId") REFERENCES "Tesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_capituloId_fkey" FOREIGN KEY ("capituloId") REFERENCES "Capitulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hito" ADD CONSTRAINT "Hito_tesisId_fkey" FOREIGN KEY ("tesisId") REFERENCES "Tesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hito" ADD CONSTRAINT "Hito_capituloId_fkey" FOREIGN KEY ("capituloId") REFERENCES "Capitulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActividadEstudiante" ADD CONSTRAINT "ActividadEstudiante_tesisId_fkey" FOREIGN KEY ("tesisId") REFERENCES "Tesis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
