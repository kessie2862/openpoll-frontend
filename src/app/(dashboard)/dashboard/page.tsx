'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { pollsApi } from '@/src/lib/api';
import { useExport } from '@/src/hooks/useExport';
import { PageShell } from '@/src/components/layout/PageShell';
import { Poll } from '@/src/types';
import { formatDistanceToNow } from 'date-fns';
import { BarChart2, Users, Copy, Download, X, Rocket } from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['my-polls'],
    queryFn: () => pollsApi.mine().then((r) => r.data),
  });

  const activateMutation = useMutation({
    mutationFn: (shortId: string) => pollsApi.activate(shortId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-polls'] }),
  });

  const closeMutation = useMutation({
    mutationFn: (shortId: string) => pollsApi.close(shortId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-polls'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (shortId: string) => pollsApi.delete(shortId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-polls'] }),
  });

  const polls = data?.results || [];

  return (
    <PageShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <p className="text-(--text-secondary) text-sm mt-1">
            {polls.length} poll{polls.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-glow p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-24 card-glow rounded-xl">
          <BarChart2 size={32} className="mx-auto text-(--text-muted) mb-4" />
          <p className="text-(--text-secondary) mb-4">No polls yet</p>
          <Link href="/polls/new">
            <button className="px-4 py-2 rounded-lg bg-(--accent) text-(--bg-base) font-bold text-sm">
              Create your first poll
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll, i) => (
            <PollRow
              key={poll.id}
              poll={poll}
              index={i}
              onActivate={() => activateMutation.mutate(poll.short_id)}
              onClose={() => closeMutation.mutate(poll.short_id)}
              onDelete={() => deleteMutation.mutate(poll.short_id)}
            />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function PollRow({
  poll,
  index,
  onActivate,
  onClose,
  onDelete,
}: {
  poll: Poll;
  index: number;
  onActivate: () => void;
  onClose: () => void;
  onDelete: () => void;
}) {
  const { exportCSV, exportPNG, isExporting } = useExport(poll.short_id);
  const [copied, setCopied] = useState(false);
  const pollUrl = `${window.location.origin}/polls/${poll.short_id}`;

  const copyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="card-glow p-5 flex items-center gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`pill ${poll.status === 'active' ? 'pill-active' : poll.status === 'draft' ? 'pill-draft' : 'pill-closed'}`}
          >
            {poll.status}
          </span>
          <Link
            href={`/polls/${poll.short_id}`}
            className="font-semibold hover:text-(--accent) transition-colors truncate"
          >
            {poll.title}
          </Link>
        </div>
        <div className="flex items-center gap-4 text-xs text-(--text-muted)">
          <span className="flex items-center gap-1">
            <Users size={11} />
            <span className="mono">{poll.unique_voters}</span> voters
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 size={11} />
            <span className="mono">{poll.total_votes}</span> votes
          </span>
          <span>
            {formatDistanceToNow(new Date(poll.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {poll.status === 'draft' && (
          <ActionBtn onClick={onActivate} title="Publish">
            <Rocket size={13} />
          </ActionBtn>
        )}
        {poll.status === 'active' && (
          <ActionBtn onClick={onClose} title="Close poll">
            <X size={13} />
          </ActionBtn>
        )}
        <ActionBtn onClick={copyLink} title={copied ? 'Copied!' : 'Copy link'}>
          <Copy size={13} />
        </ActionBtn>
        <ActionBtn
          onClick={exportCSV}
          title="Export CSV"
          disabled={isExporting}
        >
          <Download size={13} />
          <span className="text-xs">CSV</span>
        </ActionBtn>
        <ActionBtn
          onClick={exportPNG}
          title="Export PNG"
          disabled={isExporting}
        >
          <Download size={13} />
          <span className="text-xs">PNG</span>
        </ActionBtn>
        <ActionBtn onClick={onDelete} title="Delete" danger>
          <X size={13} />
        </ActionBtn>
      </div>
    </motion.div>
  );
}

function ActionBtn({
  onClick,
  title,
  children,
  disabled,
  danger,
}: {
  onClick: () => void;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs border transition-colors disabled:opacity-40 ${
        danger
          ? 'border-red-500/20 text-(--text-muted) hover:text-red-400 hover:border-red-500/40'
          : 'border-(--border) text-(--text-muted) hover:text-(--text-primary) hover:border-(--border-bright)'
      }`}
    >
      {children}
    </button>
  );
}
