insert into public.profiles (id, email, role, partner_name)
values
  ('11111111-1111-1111-1111-111111111111', 'internal@example.com', 'internal', null),
  ('22222222-2222-2222-2222-222222222222', 'partner@example.com', 'partner', 'Roster Media')
on conflict (id) do nothing;

insert into public.campaigns (
  id, campaign_number, status, updated_source_at, first_class_date, second_class_date, estimated_income,
  venue, zip_codes, reg_url, digital_package, partner_visible, partner_status, notes, digital,
  manual_budget, display_budget, social_budget, last_imported_at
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'CMP-100', 'Live', now(), current_date + 7, current_date + 14, 120000,
   'Chicago', '60601,60602', 'https://example.com/reg/cmp-100', 'Premium Digital', true, 'Creative approved',
   'Partner-safe launch note', true, 100000, 30000, 15000, now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'CMP-200', 'Planning', now(), current_date + 21, current_date + 28, 90000,
   'Dallas', '75201', null, 'Starter', false, null, 'Internal note only', false, 75000, 20000, 12000, now())
on conflict (campaign_number) do nothing;
