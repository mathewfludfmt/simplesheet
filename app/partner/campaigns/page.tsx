import { AppNav } from '@/components/nav';
import { CampaignTable } from '@/components/campaign-table';
import { Card, PageShell } from '@/components/ui';
import { requireRole } from '@/lib/auth';
import { listPartnerCampaigns } from '@/lib/data';
import type { Campaign } from '@/lib/types';

export default async function PartnerCampaignsPage() {
  await requireRole('partner');
  const campaigns = await listPartnerCampaigns();

  return (
    <>
      <AppNav mode="partner" />
      <PageShell title="Partner campaigns" description="Read-only visibility into partner-approved campaigns and statuses.">
        <Card className="p-0">
          {campaigns.length ? <CampaignTable campaigns={campaigns as Campaign[]} mode="partner" /> : <div className="p-6 text-sm text-slate-500">No partner-visible campaigns are available.</div>}
        </Card>
      </PageShell>
    </>
  );
}
