export type JobName = 'refresh-search-index' | 'send-notification' | 'sync-analytics';

export async function enqueueJob(name: JobName, payload: Record<string, unknown>) {
  return {
    id: `${name}-${Date.now()}`,
    name,
    payload,
    status: 'queued',
  };
}
