import { CalendarDays } from 'lucide-react';
import { type ReactNode } from 'react';

import { EmptyState } from '@/components/feedback';
import { Card } from '@/components/ui/Card';
import { type AdminRecord } from '@/types/dashboard';
import { formatDate } from '@/utils/formatDate';

type AdminRecordTableProps = {
  title: string;
  records: AdminRecord[];
  actions?: (record: AdminRecord) => ReactNode;
};

export function AdminRecordTable({ title, records, actions }: AdminRecordTableProps) {
  if (records.length === 0) {
    return (
      <EmptyState
        title="No records found"
        description="The backend returned an empty result for this admin table."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <h2 className="text-xl font-black text-white">{title}</h2>
      </div>

      <div className="divide-y divide-white/10">
        {records.map((record) => (
          <article key={record.id} className="p-5 transition hover:bg-white/[0.04]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-bold text-white">{record.title}</h3>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-text-muted">
                    {record.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-secondary">{record.meta}</p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:items-end">
                <span className="inline-flex items-center gap-2 text-xs text-text-muted">
                  <CalendarDays aria-hidden className="size-4 text-neon-cyan" />
                  {formatDate(record.updatedAt)}
                </span>
                {actions ? <div>{actions(record)}</div> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}
