import Link from 'next/link';
import type { Campaign } from '@/lib/types';
import { campaignHighlights, formatCurrency } from '@/lib/utils';
import { Badge } from './ui';

export function CampaignTable({ campaigns, mode }: { campaigns: Campaign[]; mode: 'internal' | 'partner' }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead>
          <tr className="text-left text-slate-500">
            {['Campaign', 'Status', 'Dates', 'Venue', 'Budgets', 'Flags'].map((heading) => (
              <th key={heading} className="px-4 py-3 font-medium">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {campaigns.map((campaign) => {
            const highlights = campaignHighlights(campaign);
            return (
              <tr key={campaign.id} className="align-top">
                <td className="px-4 py-4">
                  {mode === 'internal' ? (
                    <Link className="font-semibold text-slate-950" href={`/internal/campaigns/${campaign.id}`}>{campaign.campaign_number}</Link>
                  ) : (
                    <span className="font-semibold text-slate-950">{campaign.campaign_number}</span>
                  )}
                  <p className="mt-1 text-slate-500">{campaign.digital_package ?? 'No package assigned'}</p>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    {highlights.isActive && <Badge tone="green">Live</Badge>}
                    {highlights.isEnded && <Badge tone="gray">Ended</Badge>}
                    {highlights.missingData && <Badge tone="red">Needs review</Badge>}
                    {highlights.upcomingSoon && <Badge tone="yellow">Upcoming soon</Badge>}
                    <Badge tone="blue">{campaign.status ?? 'Unknown'}</Badge>
                  </div>
                  {mode === 'partner' && campaign.partner_status ? <p className="mt-2 text-slate-600">Partner: {campaign.partner_status}</p> : null}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>1st Class: {campaign.first_class_date ?? '—'}</p>
                  <p>2nd Class: {campaign.second_class_date ?? '—'}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>{campaign.venue ?? '—'}</p>
                  <p>{campaign.zip_codes ?? '—'}</p>
                </td>
                <td className="px-4 py-4 text-slate-600">
                  <p>Source est.: {formatCurrency(campaign.estimated_income)}</p>
                  {mode === 'internal' ? (
                    <>
                      <p>Manual: {formatCurrency(campaign.manual_budget)}</p>
                      <p>Display/Social: {formatCurrency(campaign.display_budget)} / {formatCurrency(campaign.social_budget)}</p>
                    </>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {mode === 'internal' ? (
                    <>
                      <p>Partner visible: {campaign.partner_visible ? 'Yes' : 'No'}</p>
                      <p>Digital: {campaign.digital ? 'Yes' : 'No'}</p>
                    </>
                  ) : (
                    <p>{campaign.partner_status ?? campaign.notes ?? 'No partner note'}</p>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
