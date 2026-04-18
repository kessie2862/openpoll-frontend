'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { pollsApi } from '@/src/lib/api';
import { useLiveResults } from '@/src/hooks/useLiveResults';
import { LiveResults } from '@/src/components/poll/LiveResults';
import { BarChart2, Loader2 } from 'lucide-react';

// standalone iframe widget
export default function EmbedPage() {
  const { shortId } = useParams<{ shortId: string }>();

  const { data: poll } = useQuery({
    queryKey: ['poll-embed', shortId],
    queryFn: () => pollsApi.get(shortId).then((r) => r.data),
  });

  const { results, isConnected, isLoading } = useLiveResults({ shortId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 bg-(--bg-base)">
        <Loader2 className="animate-spin text-(--accent)" size={22} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg-base) p-5">
      {poll && <h2 className="text-lg font-bold mb-4">{poll.title}</h2>}
      {results ? (
        <LiveResults results={results} isConnected={isConnected} />
      ) : (
        <p className="text-(--text-muted) text-sm">No results yet.</p>
      )}

      {/* Branding */}
      <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-(--border)">
        <BarChart2 size={11} className="text-(--text-muted)" />
        <span className="text-xs text-(--text-muted)">
          Powered by <span className="text-(--accent)">OpenPoll</span>
        </span>
      </div>
    </div>
  );
}
