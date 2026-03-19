import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addDays, differenceInCalendarDays, parseISO } from 'date-fns';
import type { Campaign } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isSoon(date: string | null, days = 14) {
  if (!date) return false;
  const diff = differenceInCalendarDays(parseISO(date), new Date());
  return diff >= 0 && diff <= days;
}

export function formatCurrency(value: number | null) {
  if (value === null || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

export function campaignHighlights(campaign: Campaign) {
  return {
    isActive:
      ['live', 'active', 'in progress', 'launching'].includes((campaign.status ?? '').toLowerCase()) && !campaign.ended,
    isEnded: campaign.ended,
    missingData: !campaign.reg_url || !campaign.venue || !campaign.first_class_date,
    upcomingSoon: isSoon(campaign.first_class_date) || isSoon(campaign.second_class_date),
    reviewDate: addDays(new Date(), 14).toISOString(),
  };
}
