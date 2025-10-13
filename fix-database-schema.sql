-- Fix Database Schema Migration
-- This script adds missing columns to existing tables
-- Run this in your Supabase SQL Editor

-- First, let's check what columns actually exist and add missing ones

-- Fix companies table - add missing timestamp columns if they don't exist
DO $$ 
BEGIN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'created_at') THEN
        ALTER TABLE companies ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'companies' AND column_name = 'updated_at') THEN
        ALTER TABLE companies ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Fix content_items table - add missing columns
DO $$ 
BEGIN
    -- Add user_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'content_items' AND column_name = 'user_id') THEN
        ALTER TABLE content_items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'content_items' AND column_name = 'created_at') THEN
        ALTER TABLE content_items ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'content_items' AND column_name = 'updated_at') THEN
        ALTER TABLE content_items ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add processed_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'content_items' AND column_name = 'processed_at') THEN
        ALTER TABLE content_items ADD COLUMN processed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Fix business_insights table - add missing columns
DO $$ 
BEGIN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_insights' AND column_name = 'created_at') THEN
        ALTER TABLE business_insights ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'business_insights' AND column_name = 'updated_at') THEN
        ALTER TABLE business_insights ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Fix transcriptions table - add missing columns
DO $$ 
BEGIN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transcriptions' AND column_name = 'created_at') THEN
        ALTER TABLE transcriptions ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transcriptions' AND column_name = 'updated_at') THEN
        ALTER TABLE transcriptions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Fix consistency_reports table - add missing columns
DO $$ 
BEGIN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'consistency_reports' AND column_name = 'created_at') THEN
        ALTER TABLE consistency_reports ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'consistency_reports' AND column_name = 'updated_at') THEN
        ALTER TABLE consistency_reports ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Fix gap_analysis_reports table - add missing columns
DO $$ 
BEGIN
    -- Add created_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gap_analysis_reports' AND column_name = 'created_at') THEN
        ALTER TABLE gap_analysis_reports ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
    
    -- Add updated_at column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'gap_analysis_reports' AND column_name = 'updated_at') THEN
        ALTER TABLE gap_analysis_reports ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_company_id ON content_items(company_id);
CREATE INDEX IF NOT EXISTS idx_business_insights_user_id ON business_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_business_insights_company_id ON business_insights(company_id);
CREATE INDEX IF NOT EXISTS idx_consistency_reports_user_id ON consistency_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_gap_analysis_reports_user_id ON gap_analysis_reports(user_id);

-- Update existing records to have proper timestamps
UPDATE companies SET 
    created_at = NOW() 
WHERE created_at IS NULL;

UPDATE companies SET 
    updated_at = NOW() 
WHERE updated_at IS NULL;

UPDATE content_items SET 
    created_at = NOW() 
WHERE created_at IS NULL;

UPDATE content_items SET 
    updated_at = NOW() 
WHERE updated_at IS NULL;

-- Make user_id NOT NULL for content_items if it's currently nullable
-- First, set a default user for existing records (you may need to adjust this)
-- UPDATE content_items SET user_id = (SELECT id FROM auth.users LIMIT 1) WHERE user_id IS NULL;

-- Then make it NOT NULL (uncomment when ready)
-- ALTER TABLE content_items ALTER COLUMN user_id SET NOT NULL;

SELECT 'Database schema migration completed successfully!' as result;
