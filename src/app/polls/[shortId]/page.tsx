'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { pollsApi } from '@/src/lib/api';
import { useVote } from '@/src/hooks/useVote';
import { useLiveResults } from '@/src/hooks/useLiveResults';
import { PageShell } from '@/src/components/layout/PageShell';
import { LiveResults } from '@/src/components/poll/LiveResults';
import { VoteResponse } from '@/src/types';
import { CheckCircle, Lock, Loader2 } from 'lucide-react';
import { RankedChoiceInput } from '@/src/components/poll/RankedChoiceInput';
import Link from 'next/link';
import { notify } from '@/src/lib/toast';

export default function VotePage() {
  const { shortId } = useParams<{ shortId: string }>();

  const { submit, isSubmitting, hasVoted, error } = useVote(shortId);

  const [responses, setResponses] = useState<Record<string, VoteResponse>>({});
  const [password, setPassword] = useState('');

  // Derive initial value from localStorage
  const [showResults, setShowResults] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const token = localStorage.getItem('access_token');
      const payload = token ? JSON.parse(atob(token.split('.')[1])) : null;
      const userId = payload?.user_id ?? payload?.id ?? payload?.sub ?? 'anon';
      return !!localStorage.getItem(`voted_${shortId}_${userId}`);
    } catch {
      return !!localStorage.getItem(`voted_${shortId}_anon`);
    }
  });

  const displayResults = showResults || hasVoted;

  const { data: poll, isLoading } = useQuery({
    queryKey: ['poll', shortId],
    queryFn: () => pollsApi.get(shortId).then((r) => r.data),
  });

  const { results, isConnected } = useLiveResults({
    shortId,
    enabled: displayResults,
  });

  const handleSingleChoice = (questionId: string, choiceId: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, choice_ids: [choiceId] },
    }));
  };

  const handleMultiChoice = (
    questionId: string,
    choiceId: string,
    max: number | null,
  ) => {
    const current = responses[questionId]?.choice_ids || [];
    const already = current.includes(choiceId);
    const updated = already
      ? current.filter((id) => id !== choiceId)
      : max && current.length >= max
        ? current
        : [...current, choiceId];
    setResponses((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, choice_ids: updated },
    }));
  };

  const handleText = (questionId: string, text: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: { question_id: questionId, text_response: text },
    }));
  };

  const handleSubmit = async () => {
    if (!poll || !poll.questions) return;

    // Validate all required questions have a response before submitting
    const unanswered = poll.questions.filter((q) => {
      if (!q.is_required) return false;
      const response = responses[q.id];

      if (q.question_type === 'open_text') {
        return !response?.text_response?.trim();
      }
      return !response?.choice_ids || response.choice_ids.length === 0;
    });

    if (unanswered.length > 0) {
      notify.error(
        'Please answer all required questions',
        `${unanswered.length} question${unanswered.length > 1 ? 's' : ''} still need${unanswered.length === 1 ? 's' : ''} an answer`,
      );
      return;
    }

    const payload = {
      password: password || undefined,
      responses: poll.questions.map(
        (q) => responses[q.id] ?? { question_id: q.id, choice_ids: [] },
      ),
    };
    await submit(payload);
  };

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-(--accent)" size={28} />
        </div>
      </PageShell>
    );
  }

  if (!poll) {
    return (
      <PageShell>
        <div className="text-center py-24 text-(--text-secondary)">
          Poll not found.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        {/* Poll header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`pill ${
                poll.status === 'active'
                  ? 'pill-active'
                  : poll.status === 'draft'
                    ? 'pill-draft'
                    : 'pill-closed'
              }`}
            >
              {poll.status}
            </span>
            {poll.password && (
              <Lock size={13} className="text-(--text-muted)" />
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2">{poll.title}</h1>
          {poll.description && (
            <p className="text-(--text-secondary) text-sm">
              {poll.description}
            </p>
          )}
          <p className="text-xs text-(--text-muted) mt-3 mono">
            {poll.unique_voters.toLocaleString()} voter
            {poll.unique_voters !== 1 ? 's' : ''}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {displayResults && results ? (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <>
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-3 mb-4 text-green-400 text-sm">
                  <CheckCircle size={15} />
                  Your vote has been recorded. Results update live.
                </div>
                <Link
                  href={`/polls/${shortId}/results`}
                  className="block text-center text-sm text-(--accent) hover:underline mb-6"
                >
                  View full results with charts →
                </Link>
              </>
              <LiveResults results={results} isConnected={isConnected} />
            </motion.div>
          ) : (
            <motion.div
              key="vote"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {!poll.is_accepting_votes ? (
                <div className="card-glow p-6 text-center">
                  <p className="text-(--text-secondary)">
                    This poll is {poll.is_expired ? 'expired' : poll.status} and
                    no longer accepting votes.
                  </p>
                  {poll.show_results_after_close && (
                    <button
                      onClick={() => setShowResults(true)}
                      className="mt-4 text-sm text-(--accent) hover:underline"
                    >
                      View results →
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {poll.questions?.map((question, qi) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: qi * 0.06 }}
                      className="card-glow p-5"
                    >
                      <p className="font-semibold mb-1">{question.text}</p>
                      <p className="text-xs text-(--text-muted) mb-4">
                        {question.question_type === 'single' && 'Choose one'}
                        {question.question_type === 'multi' &&
                          `Choose ${question.min_choices ?? 1}–${question.max_choices ?? 'any'}`}
                        {question.question_type === 'ranked' &&
                          'Select in order of preference'}
                        {question.question_type === 'open_text' &&
                          'Write your answer'}
                      </p>

                      {question.question_type === 'open_text' ? (
                        <textarea
                          rows={3}
                          maxLength={question.max_text_length}
                          placeholder="Your answer…"
                          onChange={(e) =>
                            handleText(question.id, e.target.value)
                          }
                          className="field resize-none text-sm"
                        />
                      ) : question.question_type === 'ranked' ? (
                        <RankedChoiceInput
                          choices={question.choices}
                          onChange={(orderedIds, ranks) =>
                            setResponses((prev) => ({
                              ...prev,
                              [question.id]: {
                                question_id: question.id,
                                choice_ids: orderedIds,
                                ranks,
                              },
                            }))
                          }
                        />
                      ) : (
                        <div className="space-y-2">
                          {question.choices.map((choice) => {
                            const selected = responses[
                              question.id
                            ]?.choice_ids?.includes(choice.id);
                            return (
                              <button
                                key={choice.id}
                                onClick={() =>
                                  question.question_type === 'single'
                                    ? handleSingleChoice(question.id, choice.id)
                                    : handleMultiChoice(
                                        question.id,
                                        choice.id,
                                        question.max_choices,
                                      )
                                }
                                className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                                  selected
                                    ? 'border-(--accent) bg-(--accent-glow) text-(--accent)'
                                    : 'border-(--border) hover:border-(--border-bright) text-(--text-secondary) hover:text-(--text-primary)'
                                }`}
                              >
                                <span
                                  className="inline-block w-2.5 h-2.5 rounded-full mr-3"
                                  style={{
                                    background:
                                      choice.color || 'var(--text-muted)',
                                  }}
                                />
                                {choice.text}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {poll.password && (
                    <div className="card-glow p-4">
                      <label className="block text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                        <Lock size={11} className="inline mr-1" /> Poll password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password to vote"
                        className="field text-sm"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    {poll.show_results_before_vote && (
                      <button
                        onClick={() => setShowResults(true)}
                        className="flex-1 py-2.5 rounded-lg border border-(--border) text-(--text-secondary) text-sm font-semibold hover:border-(--border-bright) transition-colors"
                      >
                        View results
                      </button>
                    )}
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 rounded-lg bg-(--accent) text-(--bg-base) font-bold text-sm hover:bg-(--accent-dim) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />{' '}
                          Submitting…
                        </>
                      ) : (
                        'Submit vote'
                      )}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
