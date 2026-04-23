'use client';

import { motion } from 'framer-motion';
import { BarChart2, Users, CheckCircle, Trophy } from 'lucide-react';
import { QuestionResult, PollResults } from '@/src/types';

interface Props {
  results: PollResults;
  isConnected: boolean;
}

export function LiveResults({ results, isConnected }: Props) {
  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="flex items-center gap-6 pb-4 border-b border-(--border)">
        <Stat
          icon={<Users size={14} />}
          label="Unique voters"
          value={results.unique_voters}
        />
        <Stat
          icon={<BarChart2 size={14} />}
          label="Total responses"
          value={results.total_votes}
        />
        <div className="ml-auto flex items-center gap-2">
          <div
            className={
              isConnected
                ? 'live-dot'
                : 'w-2 h-2 rounded-full bg-(--text-muted)'
            }
          />
          <span className="text-xs text-(--text-secondary)">
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Questions */}
      {results.questions.map((question, qi) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qi * 0.08 }}
          className="card-glow p-5"
        >
          <p className="font-semibold mb-1">{question.text}</p>
          <p className="text-xs text-(--text-muted) mb-4 mono">
            {question.total_responses} response
            {question.total_responses !== 1 ? 's' : ''}
          </p>

          {question.question_type === 'open_text' ? (
            <OpenTextResults responses={question.text_responses} />
          ) : question.question_type === 'ranked' &&
            question.ranked_choice_result ? (
            <RankedResults
              result={question.ranked_choice_result}
              choices={question.choices}
            />
          ) : (
            <BarResults question={question} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-(--text-muted)">{icon}</span>
      <div>
        <p className="mono text-lg font-bold leading-none">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-(--text-muted) mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function BarResults({ question }: { question: QuestionResult }) {
  const sorted = [...question.choices].sort(
    (a, b) => b.vote_count - a.vote_count,
  );

  return (
    <div className="space-y-3">
      {sorted.map((choice, i) => (
        <div key={choice.id}>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-sm flex items-center gap-2">
              {i === 0 && question.total_responses > 0 && (
                <CheckCircle size={13} className="text-(--accent)" />
              )}
              {choice.text}
            </span>
            <div className="flex items-center gap-2">
              <span className="mono text-xs text-(--text-secondary)">
                {choice.vote_percentage}%
              </span>
              <span className="mono text-xs text-(--text-muted)">
                ({choice.vote_count})
              </span>
            </div>
          </div>
          <div className="vote-bar-track">
            <motion.div
              className="vote-bar-fill"
              style={{
                background: choice.color
                  ? `linear-gradient(90deg, ${choice.color}99, ${choice.color})`
                  : undefined,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${choice.vote_percentage}%` }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function RankedResults({
  result,
}: {
  result: NonNullable<QuestionResult['ranked_choice_result']>;
  choices: QuestionResult['choices'];
}) {
  return (
    <div className="space-y-4">
      {result.winner && (
        <div className="flex items-center gap-2 bg-(--accent-glow) border border-(--accent-dim) rounded-lg px-4 py-3">
          <Trophy size={15} className="text-(--accent)" />
          <span className="text-sm font-semibold">
            Winner: <span className="text-(--accent)">{result.winner}</span>
          </span>
        </div>
      )}
      {result.rounds.map((round, ri) => (
        <div key={ri}>
          <p className="text-xs text-(--text-muted) mb-2 mono">
            Round {ri + 1}
          </p>
          <div className="space-y-2">
            {Object.entries(round.tally)
              .sort(([, a], [, b]) => b - a)
              .map(([name, count]) => {
                const pct = round.total_votes
                  ? (count / round.total_votes) * 100
                  : 0;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{name}</span>
                      <span className="mono text-xs text-(--text-secondary)">
                        {pct.toFixed(1)}% ({count})
                      </span>
                    </div>
                    <div className="vote-bar-track">
                      <motion.div
                        className="vote-bar-fill"
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
          {round.eliminated && (
            <p className="text-xs text-(--text-muted) mt-1.5">
              Eliminated: {round.eliminated.join(', ')}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function OpenTextResults({ responses }: { responses: string[] }) {
  if (!responses.length) {
    return <p className="text-sm text-(--text-muted)">No responses yet.</p>;
  }
  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {responses.map((r, i) => (
        <div
          key={i}
          className="bg-(--bg-elevated) rounded-lg px-3 py-2 text-sm text-(--text-secondary) border border-(--border)"
        >
          {r}
        </div>
      ))}
    </div>
  );
}
