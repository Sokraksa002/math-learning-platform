-- Add quiz option storage for exercises so the seed data matches the Prisma schema.
ALTER TABLE "exercises"
ADD COLUMN "choices" JSONB NOT NULL DEFAULT '[]'::jsonb;