import Link from 'next/link';

export function AppNav({ mode }: { mode: 'internal' | 'partner' }) {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div>
          <span className="font-semibold text-slate-950">SimpleSheet</span>
          <span className="ml-3 text-sm text-slate-500">{mode === 'internal' ? 'Internal workspace' : 'Partner portal'}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {mode === 'internal' ? (
            <>
              <Link href="/internal/campaigns">Campaigns</Link>
              <Link href="/internal/imports">Imports</Link>
            </>
          ) : (
            <Link href="/partner/campaigns">Campaigns</Link>
          )}
          <form action="/api/auth/signout" method="post">
            <button className="rounded-lg border border-slate-300 px-3 py-2 text-slate-700" type="submit">Sign out</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
