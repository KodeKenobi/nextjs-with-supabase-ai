-- Step 2: Create Indexes (CORRECTED for camelCase columns)
-- Run this AFTER step1-create-tables.sql succeeds

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(name);
CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items("userId");
CREATE INDEX IF NOT EXISTS idx_content_items_company_id ON content_items("companyId");
CREATE INDEX IF NOT EXISTS idx_business_insights_user_id ON business_insights("userId");
CREATE INDEX IF NOT EXISTS idx_business_insights_company_id ON business_insights("companyId");
CREATE INDEX IF NOT EXISTS idx_consistency_reports_user_id ON consistency_reports("userId");
CREATE INDEX IF NOT EXISTS idx_gap_analysis_reports_user_id ON gap_analysis_reports("userId");
