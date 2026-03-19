import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import type { Profile, Role } from '@/lib/types';

export async function getSessionContext() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, profile: null as Profile | null, supabase };
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return { user, profile: profile as Profile | null, supabase };
}

export async function requireRole(role: Role) {
  const context = await getSessionContext();
  if (!context.user || !context.profile || context.profile.role !== role || !context.profile.active) {
    redirect('/login');
  }
  return context;
}
