export type Lead = {
  id: string;
  created_at: string;
  source: string;
  sender_name: string;
  raw_message: string;
  category: "Brand Deal" | "Fan Message" | "Spam" | "Collaboration" | "Uncategorized" | string;
  urgency: "High" | "Medium" | "Low" | string;
  status: "New" | "Reviewed" | "Replied" | "Archived" | string;
};

export type Deal = {
  id: string;
  created_at: string;
  lead_id: string;
  brand_name: string;
  budget: number;
  campaign_dates: string;
  deliverables: string[];
  creator_requirements: string;
  payment_terms: string;
  category: string;
  urgency: "High" | "Medium" | "Low" | string;
  deal_score: number; // 1-10
  status: "Pending" | "Matched" | "Closed" | "Lost" | string;
};

export type Creator = {
  id: string;
  name: string;
  niche: string[];
  followers_count: number;
  language: string;
  content_format: string[];
  audience_gender: string;
  audience_age_range: string;
  min_rate: number;
  max_rate: number;
  instagram_handle: string;
  engagement_rate: number;
  past_brands: string[];
};
