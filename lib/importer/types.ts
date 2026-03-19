import type { Campaign } from '@/lib/types';

export type ImportedCampaignFields = Pick<
  Campaign,
  | 'campaign_number'
  | 'status'
  | 'updated_source_at'
  | 'topo_date'
  | 'first_class_date'
  | 'second_class_date'
  | 'list_size'
  | 'brochure'
  | 'age'
  | 'ipa'
  | 'estimated_income'
  | 'premium_income'
  | 'networth'
  | 'zip_codes'
  | 'reg_url'
  | 'file_manager_link'
  | 'venue'
  | 'digital_package'
>;

export interface ParsedImportRow {
  rowNumber: number;
  raw: Record<string, unknown>;
  campaignNumber: string | null;
  data?: ImportedCampaignFields;
  error?: string;
}

export interface ImportSummary {
  processed: number;
  inserted: number;
  updated: number;
  failed: number;
  errors: ParsedImportRow[];
}
