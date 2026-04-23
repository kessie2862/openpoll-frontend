'use client';

import { useState, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { pollsApi } from '@/src/lib/api';
import { PageShell } from '@/src/components/layout/PageShell';
import { Poll } from '@/src/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Search,
  BarChart2,
  Users,
  Clock,
  Tag,
  ChevronRight,
  Lock,
  TrendingUp,
} from 'lucide-react';

const TAGS = [
  'politics',
  'tech',
  'sports',
  'food',
  'music',
  'gaming',
  'science',
  'other',
];

export default function ExplorePage() {
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Use a ref to store the timer ID with proper typing
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search input
  const handleSearch = (val: string) => {
    setSearch(val);

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    searchTimerRef.current = setTimeout(() => setDebouncedSearch(val), 350);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['polls', debouncedSearch, activeTag],
    queryFn: () =>
      pollsApi
        .list({
          status: 'active',
          search: debouncedSearch || undefined,
          tag: activeTag || undefined,
        })
        .then((r) => r.data),
  });

  const polls = data?.results || [];

  return (
    <PageShell>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={18} className="text-(--accent)" />
          <span className="text-xs font-semibold text-(--accent) uppercase tracking-widest">
            Live polls
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Explore</h1>

        {/* Search */}
        <div className="relative max-w-md">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
          />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search polls…"
            className="field pl-10"
          />
        </div>

        {/* Tag filters */}
        <div className="flex gap-2 flex-wrap mt-4">
          <TagChip
            label="All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {TAGS.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card-glow h-36 animate-pulse" />
          ))}
        </div>
      ) : polls.length === 0 ? (
        <div className="text-center py-24 card-glow rounded-xl">
          <BarChart2 size={32} className="mx-auto text-(--text-muted) mb-4" />
          <p className="text-(--text-secondary) mb-1">No polls found</p>
          <p className="text-xs text-(--text-muted)">
            Try a different search or tag
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {polls.map((poll, i) => (
            <PollCard key={poll.id} poll={poll} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  );
}

function TagChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
        active
          ? 'bg-(--accent) text-(--bg-base) border-(--accent)'
          : 'border-(--border) text-(--text-secondary) hover:border-(--border-bright) hover:text-(--text-primary)'
      }`}
    >
      {label !== 'All' && <Tag size={10} />}
      {label}
    </button>
  );
}

function PollCard({ poll, index }: { poll: Poll; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link
        href={`/polls/${poll.short_id}`}
        className="block card-glow p-5 h-full group"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="pill pill-active">active</span>
            {poll.password && (
              <span className="flex items-center gap-1 text-xs text-(--text-muted)">
                <Lock size={10} /> Protected
              </span>
            )}
          </div>
          <ChevronRight
            size={15}
            className="text-(--text-muted) group-hover:text-(--accent) transition-colors shrink-0 mt-0.5"
          />
        </div>

        <h3 className="font-bold text-base mb-1 group-hover:text-(--accent) transition-colors line-clamp-2">
          {poll.title}
        </h3>

        {poll.description && (
          <p className="text-xs text-(--text-muted) mb-3 line-clamp-2">
            {poll.description}
          </p>
        )}

        {/* Tags */}
        {poll.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mb-3">
            {poll.tags.map((t) => (
              <span
                key={t.name}
                className="px-2 py-0.5 rounded text-xs bg-(--bg-overlay) text-(--text-muted)"
              >
                #{t.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center gap-4 text-xs text-(--text-muted) mt-auto pt-3 border-t border-(--border)">
          <span className="flex items-center gap-1">
            <Users size={11} />
            <span className="mono">{poll.unique_voters.toLocaleString()}</span>
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 size={11} />
            <span className="mono">{poll.question_count}</span>{' '}
            {poll.question_count === 1 ? 'question' : 'questions'}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Clock size={11} />
            {formatDistanceToNow(new Date(poll.created_at), {
              addSuffix: true,
            })}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
