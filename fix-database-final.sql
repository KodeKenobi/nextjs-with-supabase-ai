-- Final Database Fix
-- This will fix the updatedAt column issue

-- First, let's see what columns actually exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Add the missing updatedAt column if it doesn't exist
ALTER TABLE companies ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITHOUT TIME ZONE;

-- Set default value for updatedAt
ALTER TABLE companies ALTER COLUMN "updatedAt" SET DEFAULT NOW();

-- Update existing records to have updatedAt
UPDATE companies SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;

-- Make updatedAt NOT NULL
ALTER TABLE companies ALTER COLUMN "updatedAt" SET NOT NULL;

-- Do the same for content_items
ALTER TABLE content_items ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITHOUT TIME ZONE;
ALTER TABLE content_items ALTER COLUMN "updatedAt" SET DEFAULT NOW();
UPDATE content_items SET "updatedAt" = NOW() WHERE "updatedAt" IS NULL;
ALTER TABLE content_items ALTER COLUMN "updatedAt" SET NOT NULL;

SELECT 'Database updatedAt columns fixed successfully!' as result;
