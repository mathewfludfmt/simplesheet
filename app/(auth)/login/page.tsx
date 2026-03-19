import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

async function signIn(formData: FormData) {
  'use server';
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', (await supabase.auth.getUser()).data.user?.id ?? '').single();
  redirect(profile?.role === 'partner' ? '/partner/campaigns' : '/internal/campaigns');
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user, profile } = await getSessionContext();
  if (user && profile) redirect(profile.role === 'partner' ? '/partner/campaigns' : '/internal/campaigns');
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <form action={signIn} className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">SimpleSheet</p>
          <h1 className="mt-2 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-slate-600">Use Supabase Auth credentials for internal or partner access.</p>
        </div>
        {params.error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{params.error}</p> : null}
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="email" type="email" required />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" name="password" type="password" required />
        </label>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white" type="submit">Sign in</button>
      </form>
    </main>
  );
}
