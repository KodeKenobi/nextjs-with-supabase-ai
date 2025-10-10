-- Step 1: Create Tables Only
-- Run this first in Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DO $$ BEGIN
    CREATE TYPE content_type AS ENUM ('AUDIO', 'VIDEO', 'BLOG_ARTICLE', 'DOCUMENT', 'TEXT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE content_source AS ENUM ('FILE_UPLOAD', 'YOUTUBE_URL', 'BLOG_URL', 'DIRECT_INPUT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE processing_status AS ENUM ('PENDING', 'TRANSCRIBING', 'ANALYZING', 'COMPLETED', 'FAILED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE insight_category AS ENUM ('BUSINESS_MODEL', 'MARKETING', 'OPERATIONS', 'FINANCIAL', 'STRATEGIC', 'CUSTOMER', 'PRODUCT', 'COMPETITIVE', 'RISKS', 'OPPORTUNITIES');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE company_type AS ENUM ('SUPPLIER', 'COMPETITOR', 'PARTNER', 'TARGET', 'CUSTOMER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  trading_name TEXT,
  description TEXT,
  industry TEXT,
  sector TEXT,
  founded_year INTEGER,
  headquarters TEXT,
  country TEXT,
  size TEXT,
  type company_type DEFAULT 'SUPPLIER',
  revenue TEXT,
  market_cap TEXT,
  employee_count TEXT,
  legal_status TEXT,
  stock_symbol TEXT,
  ceo TEXT,
  key_executives JSONB,
  founders TEXT,
  board_members JSONB,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  facebook TEXT,
  instagram TEXT,
  youtube TEXT,
  other_social JSONB,
  phone TEXT,
  email TEXT,
  address TEXT,
  support_email TEXT,
  sales_email TEXT,
  press_contact TEXT,
  glassdoor_rating DECIMAL,
  google_rating DECIMAL,
  trustpilot_score DECIMAL,
  bbb_rating TEXT,
  yelp_rating DECIMAL,
  industry_reviews JSONB,
  business_model TEXT,
  products JSONB,
  target_market TEXT,
  geographic_presence JSONB,
  languages JSONB,
  key_partners JSONB,
  major_clients JSONB,
  suppliers JSONB,
  competitors JSONB,
  acquisitions JSONB,
  subsidiaries JSONB,
  market_share TEXT,
  competitive_advantage TEXT,
  industry_ranking TEXT,
  growth_stage TEXT,
  market_trends JSONB,
  recent_news JSONB,
  press_releases JSONB,
  media_mentions JSONB,
  awards JSONB,
  speaking_engagements JSONB,
  technology_stack JSONB,
  patents JSONB,
  rd_investment TEXT,
  innovation_areas JSONB,
  tech_partnerships JSONB,
  esg_score TEXT,
  sustainability_initiatives JSONB,
  corporate_values JSONB,
  diversity_inclusion JSONB,
  social_impact JSONB,
  office_locations JSONB,
  remote_work_policy TEXT,
  work_culture TEXT,
  benefits JSONB,
  hiring_status TEXT,
  swot_analysis JSONB,
  risk_factors JSONB,
  growth_strategy TEXT,
  investment_thesis TEXT,
  due_diligence_notes JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content items table
CREATE TABLE IF NOT EXISTS content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content_type content_type NOT NULL,
  source content_source NOT NULL,
  source_url TEXT,
  cloud_storage_path TEXT,
  file_name TEXT,
  file_size BIGINT,
  mime_type TEXT,
  duration INTEGER,
  status processing_status DEFAULT 'PENDING',
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Transcriptions table
CREATE TABLE IF NOT EXISTS transcriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  language TEXT,
  confidence DECIMAL,
  word_count INTEGER,
  content_item_id UUID UNIQUE NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business insights table
CREATE TABLE IF NOT EXISTS business_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category insight_category NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  confidence DECIMAL,
  priority priority DEFAULT 'MEDIUM',
  tags TEXT,
  source_quote TEXT,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_item_id UUID NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Consistency reports table
CREATE TABLE IF NOT EXISTS consistency_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contradictions JSONB,
  total_contradictions INTEGER DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gap analysis reports table
CREATE TABLE IF NOT EXISTS gap_analysis_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  gaps JSONB,
  total_gaps INTEGER DEFAULT 0,
  priority_gaps INTEGER DEFAULT 0,
  recommendations JSONB,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
