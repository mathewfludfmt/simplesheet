import type { ParsedImportRow, ImportSummary } from './types';
import type { Campaign } from '@/lib/types';

export interface CampaignRepository {
  findByCampaignNumbers(campaignNumbers: string[]): Promise<Map<string, Campaign>>;
  insertCampaigns(rows: Array<Record<string, unknown>>): Promise<number>;
  updateCampaigns(rows: Array<Record<string, unknown>>): Promise<number>;
  createImportRun(payload: Record<string, unknown>): Promise<{ id: string }>;
  completeImportRun(importRunId: string, payload: Record<string, unknown>): Promise<void>;
  addImportErrors(errors: Array<Record<string, unknown>>): Promise<void>;
}

export async function runCampaignImport(
  repository: CampaignRepository,
  filename: string,
  uploadedBy: string | null,
  parsedRows: ParsedImportRow[],
): Promise<ImportSummary & { importRunId: string }> {
  const importRun = await repository.createImportRun({ filename, uploaded_by: uploadedBy, status: 'processing' });

  const errors = parsedRows.filter((row) => row.error);
  const validRows = parsedRows.filter((row): row is ParsedImportRow & { data: NonNullable<ParsedImportRow['data']> } => !row.error && !!row.data);

  const existingMap = await repository.findByCampaignNumbers(validRows.map((row) => row.campaignNumber!));

  const inserts: Array<Record<string, unknown>> = [];
  const updates: Array<Record<string, unknown>> = [];

  for (const row of validRows) {
    const payload = { ...row.data, last_imported_at: new Date().toISOString() };
    if (existingMap.has(row.campaignNumber!)) {
      updates.push(payload);
    } else {
      inserts.push(payload);
    }
  }

  const inserted = inserts.length ? await repository.insertCampaigns(inserts) : 0;
  const updated = updates.length ? await repository.updateCampaigns(updates) : 0;

  if (errors.length) {
    await repository.addImportErrors(
      errors.map((row) => ({
        import_run_id: importRun.id,
        row_number: row.rowNumber,
        campaign_number: row.campaignNumber,
        error_message: row.error,
        raw_row_json: row.raw,
      })),
    );
  }

  const summary = {
    processed: parsedRows.length,
    inserted,
    updated,
    failed: errors.length,
    errors,
    importRunId: importRun.id,
  };

  await repository.completeImportRun(importRun.id, {
    rows_processed: summary.processed,
    rows_inserted: summary.inserted,
    rows_updated: summary.updated,
    rows_failed: summary.failed,
    status: errors.length ? 'completed_with_errors' : 'completed',
    summary_json: summary,
  });

  return summary;
}
