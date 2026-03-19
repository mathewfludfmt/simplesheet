import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">SimpleSheet MVP</p>
        <h1 className="text-4xl font-bold text-slate-950">Campaign tracking without Smartsheet overhead.</h1>
        <p className="text-lg text-slate-600">
          Internal teams import Excel campaign rosters, preserve manual fields, and share partner-safe updates in a
          dedicated portal.
        </p>
      </div>
      <div className="flex gap-4">
        <Link className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white" href="/login">
          Sign in
        </Link>
        <Link className="rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700" href="/partner/campaigns">
          Partner portal
        </Link>
      </div>
    </main>
  );
}
