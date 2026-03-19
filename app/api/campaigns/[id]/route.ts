import { NextResponse } from 'next/server';
import { getSessionContext } from '@/lib/auth';
import { updateCampaignManualFields } from '@/lib/data';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { user, profile } = await getSessionContext();
  if (!user || !profile || profile.role !== 'internal') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const payload = await request.json();
  const updated = await updateCampaignManualFields((await params).id, payload);
  return NextResponse.json(updated);
}
