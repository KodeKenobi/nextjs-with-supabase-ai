export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    company_name?: string;
  };
}

export interface Company {
  id: string;
  name: string;
  trading_name?: string;
  description?: string;
  industry?: string;
  sector?: string;
  founded_year?: number;
  headquarters?: string;
  country?: string;
  size?: string;
  type?: "SUPPLIER" | "COMPETITOR" | "PARTNER" | "TARGET" | "CUSTOMER";
  revenue?: string;
  market_cap?: string;
  employee_count?: string;
  legal_status?: string;
  stock_symbol?: string;
  ceo?: string;
  key_executives?: unknown;
  founders?: string;
  board_members?: unknown;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  other_social?: unknown;
  phone?: string;
  email?: string;
  address?: string;
  support_email?: string;
  sales_email?: string;
  press_contact?: string;
  glassdoor_rating?: number;
  google_rating?: number;
  trustpilot_score?: number;
  bbb_rating?: string;
  yelp_rating?: number;
  industry_reviews?: unknown;
  business_model?: string;
  products?: unknown;
  target_market?: string;
  geographic_presence?: unknown;
  languages?: unknown;
  key_partners?: unknown;
  major_clients?: unknown;
  suppliers?: unknown;
  competitors?: unknown;
  acquisitions?: unknown;
  subsidiaries?: unknown;
  market_share?: string;
  competitive_advantage?: string;
  industry_ranking?: string;
  growth_stage?: string;
  market_trends?: unknown;
  recent_news?: unknown;
  press_releases?: unknown;
  media_mentions?: unknown;
  awards?: unknown;
  speaking_engagements?: unknown;
  technology_stack?: unknown;
  patents?: unknown;
  rd_investment?: string;
  innovation_areas?: unknown;
  tech_partnerships?: unknown;
  esg_score?: string;
  sustainability_initiatives?: unknown;
  corporate_values?: unknown;
  diversity_inclusion?: unknown;
  social_impact?: unknown;
  office_locations?: unknown;
  remote_work_policy?: string;
  work_culture?: string;
  benefits?: unknown;
  hiring_status?: string;
  swot_analysis?: unknown;
  risk_factors?: unknown;
  growth_strategy?: string;
  investment_thesis?: unknown;
  due_diligence_notes?: unknown;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description?: string;
  content_type: "AUDIO" | "VIDEO" | "BLOG_ARTICLE" | "DOCUMENT" | "TEXT";
  source: "FILE_UPLOAD" | "YOUTUBE_URL" | "BLOG_URL" | "DIRECT_INPUT";
  source_url?: string;
  cloud_storage_path?: string;
  file_name?: string;
  file_size?: number;
  mime_type?: string;
  duration?: number;
  status: "PENDING" | "TRANSCRIBING" | "ANALYZING" | "COMPLETED" | "FAILED";
  company_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
}

export interface Transcription {
  id: string;
  content: string;
  language?: string;
  confidence?: number;
  word_count?: number;
  content_item_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessInsight {
  id: string;
  category:
    | "BUSINESS_MODEL"
    | "MARKETING"
    | "OPERATIONS"
    | "FINANCIAL"
    | "STRATEGIC"
    | "CUSTOMER"
    | "PRODUCT"
    | "COMPETITIVE"
    | "RISKS"
    | "OPPORTUNITIES";
  title: string;
  content: string;
  confidence?: number;
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  tags?: string;
  source_quote?: string;
  company_id?: string;
  user_id: string;
  content_item_id: string;
  created_at: string;
  updated_at: string;
}

export interface ConsistencyReport {
  id: string;
  title: string;
  description: string;
  contradictions?: unknown;
  total_contradictions: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface GapAnalysisReport {
  id: string;
  title: string;
  description: string;
  gaps?: unknown;
  total_gaps: number;
  priority_gaps: number;
  recommendations?: unknown;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  totalContent: number;
  totalInsights: number;
  processedContent: number;
  pendingContent: number;
}
