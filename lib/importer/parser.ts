import * as XLSX from 'xlsx';
import { isValid, parse, parseISO } from 'date-fns';
import { SOURCE_TO_DB_FIELD_MAP } from './mapping';
import type { ImportedCampaignFields, ParsedImportRow } from './types';

function cleanString(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  return String(value).trim() || null;
}

function parseNumber(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(num) ? num : null;
}

function parseDateValue(value: unknown) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return null;
    return new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)).toISOString().slice(0, 10);
  }
  const raw = String(value).trim();
  const attempts = [parseISO(raw), parse(raw, 'M/d/yyyy', new Date()), parse(raw, 'M/d/yy', new Date())];
  const valid = attempts.find((item) => isValid(item));
  return valid ? valid.toISOString().slice(0, 10) : null;
}

function parseDateTimeValue(value: unknown) {
  const date = parseDateValue(value);
  return date ? `${date}T00:00:00.000Z` : null;
}

export function normalizeCampaignRow(raw: Record<string, unknown>, rowNumber: number): ParsedImportRow {
  const campaignNumber = cleanString(raw.CampaignNumber);
  if (!campaignNumber) {
    return { rowNumber, raw, campaignNumber: null, error: 'Missing CampaignNumber.' };
  }

  const data: ImportedCampaignFields = {
    campaign_number: campaignNumber,
    status: cleanString(raw.Status),
    updated_source_at: parseDateTimeValue(raw.Updated),
    topo_date: parseDateValue(raw.ToPODate),
    first_class_date: parseDateValue(raw.FirstClassDate),
    second_class_date: parseDateValue(raw.SecondClassDate),
    list_size: parseNumber(raw.ITQuantity),
    brochure: cleanString(raw.Brochure),
    age: cleanString(raw.Age),
    ipa: cleanString(raw.IPA),
    estimated_income: parseNumber(raw.EstimatedIncome),
    premium_income: parseNumber(raw.PremiumIncome),
    networth: cleanString(raw.Networth),
    zip_codes: cleanString(raw.ZipCodes),
    reg_url: cleanString(raw.RegURL),
    file_manager_link: cleanString(raw.FileManagerLink),
    venue: cleanString(raw.Venue1),
    digital_package: cleanString(raw.DigitalPackage),
  };

  return { rowNumber, raw, campaignNumber, data };
}

export function parseCampaignWorkbook(buffer: Buffer | ArrayBuffer | Uint8Array) {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheet = workbook.Sheets.Campaigns;
  if (!sheet) {
    throw new Error('Campaigns worksheet not found.');
  }
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: null });
  return rows.map((row, index) => normalizeCampaignRow(row, index + 2));
}

export { SOURCE_TO_DB_FIELD_MAP };
