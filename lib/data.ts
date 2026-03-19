import { createAdminClient } from '@/lib/supabase/admin';
import type { Campaign, CampaignImportRun, CampaignManualUpdate } from '@/lib/types';
import type { CampaignRepository } from '@/lib/importer/upsert';

export async function listInternalCampaigns(filters: Record<string, string | undefined>) {
  const supabase = createAdminClient();
  let query = supabase.from('campaigns').select('*').order('updated_at', { ascending: false });

  if (filters.search) query = query.ilike('campaign_number', `%${filters.search}%`);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.ended) query = query.eq('ended', filters.ended === 'true');
  if (filters.partner_visible) query = query.eq('partner_visible', filters.partner_visible === 'true');
  if (filters.venue) query = query.ilike('venue', `%${filters.venue}%`);
  if (filters.start_date) query = query.gte('first_class_date', filters.start_date);
  if (filters.end_date) query = query.lte('second_class_date', filters.end_date);

  const { data, error } = await query;
  if (error) throw error;
  return data as Campaign[];
}

export async function listPartnerCampaigns() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('partner_campaigns')
    .select('*')
    .order('first_class_date', { ascending: true });
  if (error) throw error;
  return data as Array<Partial<Campaign>>;
}

export async function getCampaignById(id: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('campaigns').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Campaign;
}

export async function updateCampaignManualFields(id: string, payload: CampaignManualUpdate) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('campaigns')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function listImportRuns() {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from('campaign_import_runs').select('*').order('uploaded_at', { ascending: false });
  if (error) throw error;
  return data as CampaignImportRun[];
}

export function createCampaignRepository(): CampaignRepository {
  const supabase = createAdminClient();

  return {
    async findByCampaignNumbers(campaignNumbers) {
      const { data, error } = await supabase.from('campaigns').select('*').in('campaign_number', campaignNumbers);
      if (error) throw error;
      return new Map((data as Campaign[]).map((row) => [row.campaign_number, row]));
    },
    async insertCampaigns(rows) {
      const { data, error } = await supabase.from('campaigns').insert(rows).select('id');
      if (error) throw error;
      return data.length;
    },
    async updateCampaigns(rows) {
      await Promise.all(
        rows.map(async (row) => {
          const { campaign_number, ...payload } = row;
          const { error } = await supabase.from('campaigns').update(payload).eq('campaign_number', campaign_number as string);
          if (error) throw error;
        }),
      );
      return rows.length;
    },
    async createImportRun(payload) {
      const { data, error } = await supabase.from('campaign_import_runs').insert(payload).select('id').single();
      if (error) throw error;
      return data;
    },
    async completeImportRun(importRunId, payload) {
      const { error } = await supabase.from('campaign_import_runs').update(payload).eq('id', importRunId);
      if (error) throw error;
    },
    async addImportErrors(errors) {
      const { error } = await supabase.from('campaign_import_errors').insert(errors);
      if (error) throw error;
    },
  };
}
