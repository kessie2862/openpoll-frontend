'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { pollsApi } from '@/src/lib/api';
import { useLiveResults } from '@/src/hooks/useLiveResults';
import { useExport } from '@/src/hooks/useExport';
import { PageShell } from '@/src/components/layout/PageShell';
import { QuestionResult } from '@/src/types';
import { formatDistanceToNow, format } from 'date-fns';
import {
  ArrowLeft,
  Download,
  Users,
  BarChart2,
  Trophy,
  Wifi,
  WifiOff,
  RefreshCw,
} from 'lucide-react';

// Chart color palette
const CHART_COLORS = [
  '#f5a623',
  '#3b82f6',
  '#22c55e',
  '#a855f7',
  '#ef4444',
  '#06b6d4',
  '#f97316',
  '#84cc16',
];

export default function ResultsPage() {
  const { shortId } = useParams<{ shortId: string }>();
  const router = useRouter();
  const { exportCSV, exportPNG, isExporting } = useExport(shortId);

  const { data: poll } = useQuery({
    queryKey: ['poll', shortId],
    queryFn: () => pollsApi.get(shortId).then((r) => r.data),
  });

  const { results, isConnected, isLoading } = useLiveResults({ shortId });

  if (isLoading || !results) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-64 gap-3 text-(--text-muted)">
          <RefreshCw size={18} className="animate-spin" />
          Loading results…
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-(--text-muted) hover:text-(--text-primary) transition-colors mb-6"
      >
        <ArrowLeft size={14} /> Back
      </button>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`pill ${
                results.status === 'active'
                  ? 'pill-active'
                  : results.status === 'draft'
                    ? 'pill-draft'
                    : 'pill-closed'
              }`}
            >
              {results.status}
            </span>
            <div className="flex items-center gap-1.5">
              {isConnected ? (
                <Wifi size={12} className="text-(--green)" />
              ) : (
                <WifiOff size={12} className="text-(--text-muted)" />
              )}
              <span className="text-xs text-(--text-muted)">
                {isConnected ? 'Live' : 'Disconnected'}
              </span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-1">{results.title}</h1>
          <p className="text-xs text-(--text-muted)">
            by {results.creator?.display_name || results.creator?.username} ·{' '}
            {formatDistanceToNow(new Date(results.created_at), {
              addSuffix: true,
            })}
            {results.closed_at && (
              <>
                {' '}
                · closed {format(new Date(results.closed_at), 'MMM d, yyyy')}
              </>
            )}
          </p>
        </div>

        {/* Export */}
        <div className="flex gap-2">
          <ExportBtn onClick={exportCSV} disabled={isExporting} label="CSV" />
          <ExportBtn onClick={exportPNG} disabled={isExporting} label="PNG" />
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {[
          {
            label: 'Unique voters',
            value: results.unique_voters,
            icon: <Users size={14} />,
          },
          {
            label: 'Total responses',
            value: results.total_votes,
            icon: <BarChart2 size={14} />,
          },
          {
            label: 'Questions',
            value: results.questions.length,
            icon: <BarChart2 size={14} />,
          },
          {
            label: results.status === 'active' ? 'Still live' : 'Final',
            value: results.status === 'active' ? '●' : '✓',
            icon: null,
          },
        ].map((s) => (
          <div key={s.label} className="card-glow p-4">
            <div className="flex items-center gap-1.5 text-(--text-muted) mb-1">
              {s.icon}
              <span className="text-xs">{s.label}</span>
            </div>
            <p className="mono text-2xl font-bold">
              {typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {results.questions.map((question, qi) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.07 }}
            className="card-glow p-6"
          >
            {/* Question header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p className="text-xs text-(--text-muted) mono mb-1">
                  Q{qi + 1} · {question.question_type.replace('_', ' ')}
                </p>
                <h2 className="text-lg font-bold">{question.text}</h2>
              </div>
              <div className="text-right shrink-0">
                <p className="mono text-xl font-bold">
                  {question.total_responses.toLocaleString()}
                </p>
                <p className="text-xs text-(--text-muted)">responses</p>
              </div>
            </div>

            {/* Chart by type */}
            {question.question_type === 'open_text' ? (
              <OpenTextSection responses={question.text_responses} />
            ) : question.question_type === 'ranked' &&
              question.ranked_choice_result ? (
              <RankedSection question={question} />
            ) : question.total_responses > 0 && question.choices.length <= 5 ? (
              <DonutSection question={question} />
            ) : (
              <HorizontalBarSection question={question} />
            )}
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}

// Chart sections
function HorizontalBarSection({ question }: { question: QuestionResult }) {
  const data = [...question.choices]
    .sort((a, b) => b.vote_count - a.vote_count)
    .map((c, i) => ({
      name: c.text,
      votes: c.vote_count,
      pct: c.vote_percentage,
      fill: c.color || CHART_COLORS[i % CHART_COLORS.length],
    }));

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={Math.max(180, data.length * 48)}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 8, right: 48, top: 4, bottom: 4 }}
        >
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={160}
            tick={{
              fill: 'var(--text-secondary)',
              fontSize: 13,
              fontFamily: 'Syne',
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 12,
            }}
            // `item.payload` is optional per Recharts types — guard with nullish coalescing
            formatter={(val, _name, item) => {
              const pct = item?.payload?.pct ?? 0;
              return [`${val ?? 0} votes (${pct}%)`, ''];
            }}
            labelStyle={{ color: 'var(--text-primary)', marginBottom: 4 }}
          />
          <Bar dataKey="votes" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Percentage labels */}
      <div className="space-y-1.5 mt-4">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-xs">
            <span className="text-(--text-secondary) flex items-center gap-2">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: d.fill }}
              />
              {d.name}
            </span>
            <span className="mono text-(--text-muted)">
              {d.pct}% · {d.votes.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DonutSection({ question }: { question: QuestionResult }) {
  const data = question.choices
    .filter((c) => c.vote_count > 0)
    .map((c, i) => ({
      name: c.text,
      value: c.vote_count,
      pct: c.vote_percentage,
      fill: c.color || CHART_COLORS[i % CHART_COLORS.length],
    }));

  const winner = [...question.choices].sort(
    (a, b) => b.vote_count - a.vote_count,
  )[0];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative">
        <ResponsiveContainer width={220} height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={68}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.fill}
                  stroke="var(--bg-base)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
              }}
              formatter={(val, name) => [`${val ?? 0} votes`, name ?? '']}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="mono text-2xl font-bold">{question.total_responses}</p>
          <p className="text-xs text-(--text-muted)">votes</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3 w-full">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="flex items-center gap-2 text-(--text-secondary)">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ background: d.fill }}
                />
                {d.name}
                {winner?.text === d.name && question.total_responses > 0 && (
                  <Trophy size={12} className="text-(--accent)" />
                )}
              </span>
              <span className="mono text-xs text-(--text-muted)">{d.pct}%</span>
            </div>
            <div className="vote-bar-track">
              <motion.div
                className="vote-bar-fill"
                style={{ background: d.fill }}
                initial={{ width: 0 }}
                animate={{ width: `${d.pct}%` }}
                transition={{
                  duration: 0.7,
                  ease: [0.34, 1.56, 0.64, 1],
                  delay: i * 0.05,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RankedSection({ question }: { question: QuestionResult }) {
  const result = question.ranked_choice_result!;
  return (
    <div className="space-y-5">
      {result.winner && (
        <div className="flex items-center gap-3 bg-(--accent-glow) border border-(--accent-dim) rounded-xl px-5 py-4">
          <Trophy size={18} className="text-(--accent)" />
          <div>
            <p className="text-xs text-(--accent) font-semibold uppercase tracking-wider mb-0.5">
              Winner
            </p>
            <p className="font-bold text-lg">{result.winner}</p>
          </div>
        </div>
      )}

      {result.rounds.map((round, ri) => {
        const entries = Object.entries(round.tally).sort(
          ([, a], [, b]) => b - a,
        );
        return (
          <div key={ri} className="border border-(--border) rounded-xl p-4">
            <p className="text-xs font-semibold text-(--text-muted) mono mb-3">
              Round {ri + 1}
              {round.eliminated && (
                <span className="ml-2 text-red-400">
                  — eliminated: {round.eliminated.join(', ')}
                </span>
              )}
            </p>
            <div className="space-y-2">
              {entries.map(([name, count], i) => {
                const pct = round.total_votes
                  ? (count / round.total_votes) * 100
                  : 0;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-(--text-secondary)">{name}</span>
                      <span className="mono text-xs text-(--text-muted)">
                        {pct.toFixed(1)}% · {count}
                      </span>
                    </div>
                    <div className="vote-bar-track">
                      <motion.div
                        className="vote-bar-fill"
                        style={{
                          background: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.04 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {result.tie && (
        <p className="text-sm text-(--text-muted) text-center">
          Tie between: {result.tie.join(', ')}
        </p>
      )}
    </div>
  );
}

function OpenTextSection({ responses }: { responses: string[] }) {
  if (!responses.length) {
    return (
      <p className="text-sm text-(--text-muted) text-center py-8">
        No text responses yet.
      </p>
    );
  }
  return (
    <div className="grid gap-2 sm:grid-cols-2 max-h-96 overflow-y-auto pr-1">
      {responses.map((r, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.03 }}
          className="bg-(--bg-elevated) border border-(--border) rounded-lg px-4 py-3 text-sm text-(--text-secondary)"
        >
          {r}
        </motion.div>
      ))}
    </div>
  );
}

function ExportBtn({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-(--border) text-xs font-semibold text-(--text-secondary) hover:text-[var(--text-primary)] hover:border-[var(--border-bright)] transition-colors disabled:opacity-40"
    >
      <Download size={12} />
      {label}
    </button>
  );
}
