-- Check what columns actually exist in your database
-- Run this first to see what we're working with

-- Check companies table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'companies' 
ORDER BY ordinal_position;

-- Check content_items table columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'content_items' 
ORDER BY ordinal_position;

-- Check if tables exist at all
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('companies', 'content_items', 'business_insights', 'transcriptions', 'consistency_reports', 'gap_analysis_reports')
ORDER BY table_name;
