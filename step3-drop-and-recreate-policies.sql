-- Step 3: Drop and Recreate RLS Policies (CORRECTED)
-- Run this AFTER step2-create-indexes.sql succeeds

-- Enable Row Level Security (RLS)
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE consistency_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE gap_analysis_reports ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (ignore errors)
DROP POLICY IF EXISTS "Users can view own content" ON content_items;
DROP POLICY IF EXISTS "Users can insert own content" ON content_items;
DROP POLICY IF EXISTS "Users can update own content" ON content_items;
DROP POLICY IF EXISTS "Users can delete own content" ON content_items;

DROP POLICY IF EXISTS "Users can view own insights" ON business_insights;
DROP POLICY IF EXISTS "Users can insert own insights" ON business_insights;
DROP POLICY IF EXISTS "Users can update own insights" ON business_insights;
DROP POLICY IF EXISTS "Users can delete own insights" ON business_insights;

DROP POLICY IF EXISTS "Users can view own consistency reports" ON consistency_reports;
DROP POLICY IF EXISTS "Users can insert own consistency reports" ON consistency_reports;
DROP POLICY IF EXISTS "Users can update own consistency reports" ON consistency_reports;
DROP POLICY IF EXISTS "Users can delete own consistency reports" ON consistency_reports;

DROP POLICY IF EXISTS "Users can view own gap analysis reports" ON gap_analysis_reports;
DROP POLICY IF EXISTS "Users can insert own gap analysis reports" ON gap_analysis_reports;
DROP POLICY IF EXISTS "Users can update own gap analysis reports" ON gap_analysis_reports;
DROP POLICY IF EXISTS "Users can delete own gap analysis reports" ON gap_analysis_reports;

DROP POLICY IF EXISTS "Companies are viewable by all" ON companies;

DROP POLICY IF EXISTS "Users can view transcriptions of own content" ON transcriptions;
DROP POLICY IF EXISTS "Users can insert transcriptions for own content" ON transcriptions;
DROP POLICY IF EXISTS "Users can update transcriptions of own content" ON transcriptions;
DROP POLICY IF EXISTS "Users can delete transcriptions of own content" ON transcriptions;

-- Create RLS policies (users can only access their own data)
-- Using camelCase column names as they exist in the database
CREATE POLICY "Users can view own content" ON content_items FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can insert own content" ON content_items FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can update own content" ON content_items FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "Users can delete own content" ON content_items FOR DELETE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view own insights" ON business_insights FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can insert own insights" ON business_insights FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can update own insights" ON business_insights FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "Users can delete own insights" ON business_insights FOR DELETE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view own consistency reports" ON consistency_reports FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can insert own consistency reports" ON consistency_reports FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can update own consistency reports" ON consistency_reports FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "Users can delete own consistency reports" ON consistency_reports FOR DELETE USING (auth.uid()::text = "userId");

CREATE POLICY "Users can view own gap analysis reports" ON gap_analysis_reports FOR SELECT USING (auth.uid()::text = "userId");
CREATE POLICY "Users can insert own gap analysis reports" ON gap_analysis_reports FOR INSERT WITH CHECK (auth.uid()::text = "userId");
CREATE POLICY "Users can update own gap analysis reports" ON gap_analysis_reports FOR UPDATE USING (auth.uid()::text = "userId");
CREATE POLICY "Users can delete own gap analysis reports" ON gap_analysis_reports FOR DELETE USING (auth.uid()::text = "userId");

-- Companies are public for now (can be restricted later)
CREATE POLICY "Companies are viewable by all" ON companies FOR SELECT USING (true);

-- Transcriptions follow content items
CREATE POLICY "Users can view transcriptions of own content" ON transcriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM content_items WHERE content_items.id = transcriptions."contentItemId" AND auth.uid()::text = content_items."userId")
);
CREATE POLICY "Users can insert transcriptions for own content" ON transcriptions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM content_items WHERE content_items.id = transcriptions."contentItemId" AND auth.uid()::text = content_items."userId")
);
CREATE POLICY "Users can update transcriptions of own content" ON transcriptions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM content_items WHERE content_items.id = transcriptions."contentItemId" AND auth.uid()::text = content_items."userId")
);
CREATE POLICY "Users can delete transcriptions of own content" ON transcriptions FOR DELETE USING (
  EXISTS (SELECT 1 FROM content_items WHERE content_items.id = transcriptions."contentItemId" AND auth.uid()::text = content_items."userId")
);
