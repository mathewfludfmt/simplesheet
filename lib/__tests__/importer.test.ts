import { describe, expect, it } from 'vitest';
import { normalizeCampaignRow } from '@/lib/importer/parser';
import { runCampaignImport } from '@/lib/importer/upsert';
import type { Campaign } from '@/lib/types';

function campaign(overrides: Partial<Campaign>): Campaign {
  return {
    id: '1',
    campaign_number: 'CMP-100',
    status: 'Live',
    updated_source_at: null,
    topo_date: null,
    first_class_date: null,
    second_class_date: null,
    list_size: null,
    brochure: null,
    age: null,
    ipa: null,
    estimated_income: null,
    premium_income: null,
    networth: null,
    zip_codes: null,
    reg_url: null,
    file_manager_link: null,
    venue: null,
    digital_package: null,
    digital: true,
    notes: 'keep me',
    ended: false,
    partner_visible: false,
    partner_status: null,
    manual_budget: 10,
    display_budget: 11,
    social_budget: 12,
    created_at: '',
    updated_at: '',
    last_imported_at: null,
    ...overrides,
  };
}

describe('normalizeCampaignRow', () => {
  it('rejects rows missing campaign number', () => {
    const result = normalizeCampaignRow({ Status: 'Live' }, 2);
    expect(result.error).toContain('Missing CampaignNumber');
  });
});

describe('runCampaignImport', () => {
  it('inserts new campaigns and updates existing imported fields only', async () => {
    const inserted: Array<Record<string, unknown>> = [];
    const updated: Array<Record<string, unknown>> = [];
    const errors: Array<Record<string, unknown>> = [];

    const repository = {
      async createImportRun() { return { id: 'run-1' }; },
      async findByCampaignNumbers() { return new Map([[ 'CMP-100', campaign({}) ]]); },
      async insertCampaigns(rows: Array<Record<string, unknown>>) { inserted.push(...rows); return rows.length; },
      async updateCampaigns(rows: Array<Record<string, unknown>>) { updated.push(...rows); return rows.length; },
      async completeImportRun() {},
      async addImportErrors(rows: Array<Record<string, unknown>>) { errors.push(...rows); },
    };

    const parsedRows = [
      normalizeCampaignRow({ CampaignNumber: 'CMP-100', Status: 'Updated', EstimatedIncome: '99' }, 2),
      normalizeCampaignRow({ CampaignNumber: 'CMP-200', Status: 'New', EstimatedIncome: '55' }, 3),
      normalizeCampaignRow({ Status: 'Bad row' }, 4),
    ];

    const summary = await runCampaignImport(repository, 'sample.xlsx', 'user-1', parsedRows);

    expect(summary.inserted).toBe(1);
    expect(summary.updated).toBe(1);
    expect(summary.failed).toBe(1);
    expect(inserted[0].campaign_number).toBe('CMP-200');
    expect(updated[0].campaign_number).toBe('CMP-100');
    expect(updated[0].notes).toBeUndefined();
    expect(errors).toHaveLength(1);
  });
});
