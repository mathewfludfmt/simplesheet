export type Role = 'internal' | 'partner';

export interface Profile {
  id: string;
  email: string;
  role: Role;
  partner_name: string | null;
  active: boolean;
  created_at: string;
}

export interface Campaign {
  id: string;
  campaign_number: string;
  status: string | null;
  updated_source_at: string | null;
  topo_date: string | null;
  first_class_date: string | null;
  second_class_date: string | null;
  list_size: number | null;
  brochure: string | null;
  age: string | null;
  ipa: string | null;
  estimated_income: number | null;
  premium_income: number | null;
  networth: string | null;
  zip_codes: string | null;
  reg_url: string | null;
  file_manager_link: string | null;
  venue: string | null;
  digital_package: string | null;
  digital: boolean;
  notes: string | null;
  ended: boolean;
  partner_visible: boolean;
  partner_status: string | null;
  manual_budget: number | null;
  display_budget: number | null;
  social_budget: number | null;
  created_at: string;
  updated_at: string;
  last_imported_at: string | null;
}

export interface CampaignImportRun {
  id: string;
  filename: string;
  uploaded_by: string | null;
  uploaded_at: string;
  rows_processed: number;
  rows_inserted: number;
  rows_updated: number;
  rows_failed: number;
  status: string;
  summary_json: Record<string, unknown> | null;
}

export interface CampaignImportError {
  id: string;
  import_run_id: string;
  row_number: number | null;
  campaign_number: string | null;
  error_message: string;
  raw_row_json: Record<string, unknown> | null;
  created_at: string;
}

export type CampaignManualUpdate = Pick<
  Campaign,
  'digital' | 'notes' | 'ended' | 'partner_visible' | 'partner_status' | 'manual_budget' | 'display_budget' | 'social_budget'
>;
