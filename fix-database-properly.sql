-- Fix Database Schema Properly
-- This script will fix the database schema to match the application

-- First, let's see what columns actually exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Drop and recreate companies table with correct schema
DROP TABLE IF EXISTS companies CASCADE;

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  industry TEXT,
  country TEXT,
  size TEXT,
  type TEXT DEFAULT 'TARGET',
  createdAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Drop and recreate content_items table with correct schema
DROP TABLE IF EXISTS content_items CASCADE;

CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  contentType TEXT NOT NULL,
  source TEXT NOT NULL,
  sourceUrl TEXT,
  cloudStoragePath TEXT,
  fileName TEXT,
  fileSize BIGINT,
  mimeType TEXT,
  status TEXT DEFAULT 'PENDING',
  companyId UUID REFERENCES companies(id) ON DELETE SET NULL,
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(userId);
CREATE INDEX IF NOT EXISTS idx_content_items_company_id ON content_items(companyId);

SELECT 'Database schema fixed successfully!' as result;
