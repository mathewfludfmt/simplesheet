import { cn } from '@/lib/utils';

export function PageShell({ title, description, children, action }: { title: string; description: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">{title}</h1>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </main>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn('rounded-2xl border border-slate-200 bg-white p-6 shadow-sm', className)}>{children}</section>;
}

export function Badge({ tone, children }: { tone: 'green' | 'gray' | 'yellow' | 'red' | 'blue'; children: React.ReactNode }) {
  const tones = {
    green: 'bg-green-100 text-green-800',
    gray: 'bg-slate-100 text-slate-700',
    yellow: 'bg-amber-100 text-amber-900',
    red: 'bg-rose-100 text-rose-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  return <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}
