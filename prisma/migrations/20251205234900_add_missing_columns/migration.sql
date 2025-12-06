-- Add missing columns to Tesis table
ALTER TABLE "Tesis" ADD COLUMN IF NOT EXISTS "porcentajeGeneral" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "Tesis" ADD COLUMN IF NOT EXISTS "plantillaIndice" JSONB NOT NULL DEFAULT '[]';
