import { AppNav } from '@/components/nav';
import { Card, PageShell } from '@/components/ui';
import { requireRole } from '@/lib/auth';
import { listImportRuns } from '@/lib/data';

export default async function ImportsPage() {
  await requireRole('internal');
  const imports = await listImportRuns();

  return (
    <>
      <AppNav mode="internal" />
      <PageShell title="Import campaigns" description="Upload the RosterUpcoming Digital Campaigns workbook. The importer reads the Campaigns worksheet and only updates imported fields.">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <form action="/api/imports" method="post" encType="multipart/form-data" className="space-y-4">
              <input className="block w-full rounded-lg border border-slate-300 px-3 py-2" name="file" type="file" accept=".xlsx,.xls" required />
              <button className="rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white" type="submit">Upload and import</button>
              <p className="text-sm text-slate-500">Invalid rows are logged in campaign_import_errors. Manual campaign fields are never touched.</p>
            </form>
          </Card>
          <Card>
            <h2 className="text-lg font-semibold text-slate-950">Import history</h2>
            <div className="mt-4 space-y-3">
              {imports.length ? imports.map((run) => (
                <div key={run.id} className="rounded-xl border border-slate-200 p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-slate-900">{run.filename}</p>
                    <p className="text-slate-500">{run.status}</p>
                  </div>
                  <p className="mt-2 text-slate-600">Processed {run.rows_processed} · Inserted {run.rows_inserted} · Updated {run.rows_updated} · Failed {run.rows_failed}</p>
                </div>
              )) : <p className="text-sm text-slate-500">No imports have been run yet.</p>}
            </div>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
