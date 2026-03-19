import { AppNav } from '@/components/nav';
import { CampaignTable } from '@/components/campaign-table';
import { Card, PageShell } from '@/components/ui';
import { requireRole } from '@/lib/auth';
import { listInternalCampaigns } from '@/lib/data';

export default async function InternalCampaignsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  await requireRole('internal');
  const filters = await searchParams;
  const campaigns = await listInternalCampaigns(filters);

  return (
    <>
      <AppNav mode="internal" />
      <PageShell
        title="Campaign dashboard"
        description="Search, filter, and edit manual campaign fields while protecting imported source data."
        action={<a className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white" href="/internal/imports">Import workbook</a>}
      >
        <Card>
          <form className="grid gap-3 md:grid-cols-6">
            <input className="rounded-lg border border-slate-300 px-3 py-2" name="search" placeholder="Campaign number" defaultValue={filters.search} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" name="status" placeholder="Status" defaultValue={filters.status} />
            <select className="rounded-lg border border-slate-300 px-3 py-2" name="ended" defaultValue={filters.ended ?? ''}><option value="">Ended?</option><option value="true">Ended</option><option value="false">Active</option></select>
            <select className="rounded-lg border border-slate-300 px-3 py-2" name="partner_visible" defaultValue={filters.partner_visible ?? ''}><option value="">Partner visible?</option><option value="true">Yes</option><option value="false">No</option></select>
            <input className="rounded-lg border border-slate-300 px-3 py-2" name="venue" placeholder="Venue" defaultValue={filters.venue} />
            <button className="rounded-lg bg-slate-900 px-4 py-2 text-white" type="submit">Apply filters</button>
          </form>
        </Card>
        <Card className="p-0">{campaigns.length ? <CampaignTable campaigns={campaigns} mode="internal" /> : <div className="p-6 text-sm text-slate-500">No campaigns match the current filters.</div>}</Card>
      </PageShell>
    </>
  );
}
