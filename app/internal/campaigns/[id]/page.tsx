import { AppNav } from '@/components/nav';
import { Card, PageShell } from '@/components/ui';
import { requireRole } from '@/lib/auth';
import { getCampaignById } from '@/lib/data';

async function updateCampaign(id: string, formData: FormData) {
  'use server';
  const { updateCampaignManualFields } = await import('@/lib/data');
  await updateCampaignManualFields(id, {
    digital: formData.get('digital') === 'on',
    notes: String(formData.get('notes') || '') || null,
    ended: formData.get('ended') === 'on',
    partner_visible: formData.get('partner_visible') === 'on',
    partner_status: String(formData.get('partner_status') || '') || null,
    manual_budget: formData.get('manual_budget') ? Number(formData.get('manual_budget')) : null,
    display_budget: formData.get('display_budget') ? Number(formData.get('display_budget')) : null,
    social_budget: formData.get('social_budget') ? Number(formData.get('social_budget')) : null,
  });
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  await requireRole('internal');
  const { id } = await params;
  const campaign = await getCampaignById(id);

  return (
    <>
      <AppNav mode="internal" />
      <PageShell title={`Campaign ${campaign.campaign_number}`} description="Manual/internal fields are editable here. Imported fields are read-only and refreshed by Excel uploads.">
        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <Card>
            <dl className="grid gap-4 md:grid-cols-2">
              {Object.entries({
                Status: campaign.status,
                Venue: campaign.venue,
                'First class date': campaign.first_class_date,
                'Second class date': campaign.second_class_date,
                'Source estimate': campaign.estimated_income,
                'Registration URL': campaign.reg_url,
                'Digital package': campaign.digital_package,
                'File manager': campaign.file_manager_link,
              }).map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm font-medium text-slate-500">{label}</dt>
                  <dd className="mt-1 text-sm text-slate-900">{value ? String(value) : '—'}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card>
            <form action={updateCampaign.bind(null, id)} className="space-y-4">
              <label className="flex items-center gap-2"><input name="digital" type="checkbox" defaultChecked={campaign.digital} /> Digital</label>
              <label className="flex items-center gap-2"><input name="ended" type="checkbox" defaultChecked={campaign.ended} /> Ended</label>
              <label className="flex items-center gap-2"><input name="partner_visible" type="checkbox" defaultChecked={campaign.partner_visible} /> Visible to partner</label>
              <label className="block text-sm font-medium">Partner status<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="partner_status" defaultValue={campaign.partner_status ?? ''} /></label>
              <label className="block text-sm font-medium">Internal notes<textarea className="mt-1 min-h-32 w-full rounded-lg border border-slate-300 px-3 py-2" name="notes" defaultValue={campaign.notes ?? ''} /></label>
              <label className="block text-sm font-medium">Manual budget<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="manual_budget" type="number" step="0.01" defaultValue={campaign.manual_budget ?? ''} /></label>
              <label className="block text-sm font-medium">Display budget<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="display_budget" type="number" step="0.01" defaultValue={campaign.display_budget ?? ''} /></label>
              <label className="block text-sm font-medium">Social budget<input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="social_budget" type="number" step="0.01" defaultValue={campaign.social_budget ?? ''} /></label>
              <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white" type="submit">Save manual fields</button>
            </form>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
