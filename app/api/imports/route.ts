import { NextResponse } from 'next/server';
import { getSessionContext } from '@/lib/auth';
import { parseCampaignWorkbook } from '@/lib/importer/parser';
import { runCampaignImport } from '@/lib/importer/upsert';
import { createCampaignRepository } from '@/lib/data';

export async function POST(request: Request) {
  const { user, profile } = await getSessionContext();
  if (!user || !profile || profile.role !== 'internal') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File upload is required.' }, { status: 400 });
  }

  try {
    const parsedRows = parseCampaignWorkbook(Buffer.from(await file.arrayBuffer()));
    const summary = await runCampaignImport(createCampaignRepository(), file.name, user.id, parsedRows);
    return NextResponse.redirect(new URL(`/internal/imports?importRunId=${summary.importRunId}`, request.url));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Import failed.' }, { status: 400 });
  }
}
