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
  key_executives?: any;
  founders?: string;
  board_members?: any;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  other_social?: any;
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
  industry_reviews?: any;
  business_model?: string;
  products?: any;
  target_market?: string;
  geographic_presence?: any;
  languages?: any;
  key_partners?: any;
  major_clients?: any;
  suppliers?: any;
  competitors?: any;
  acquisitions?: any;
  subsidiaries?: any;
  market_share?: string;
  competitive_advantage?: string;
  industry_ranking?: string;
  growth_stage?: string;
  market_trends?: any;
  recent_news?: any;
  press_releases?: any;
  media_mentions?: any;
  awards?: any;
  speaking_engagements?: any;
  technology_stack?: any;
  patents?: any;
  rd_investment?: string;
  innovation_areas?: any;
  tech_partnerships?: any;
  esg_score?: string;
  sustainability_initiatives?: any;
  corporate_values?: any;
  diversity_inclusion?: any;
  social_impact?: any;
  office_locations?: any;
  remote_work_policy?: string;
  work_culture?: string;
  benefits?: any;
  hiring_status?: string;
  swot_analysis?: any;
  risk_factors?: any;
  growth_strategy?: string;
  investment_thesis?: any;
  due_diligence_notes?: any;
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
  contradictions?: any;
  total_contradictions: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface GapAnalysisReport {
  id: string;
  title: string;
  description: string;
  gaps?: any;
  total_gaps: number;
  priority_gaps: number;
  recommendations?: any;
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
