'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { usePollBuilderStore } from '@/src/store/poll-builder';
import { pollsApi, extractErrorMessage } from '@/src/lib/api';
import { QuestionEditor } from '@/src/components/poll/QuestionEditor';
import { PageShell } from '@/src/components/layout/PageShell';
import { PollDraft } from '@/src/types';
import {
  Plus,
  Rocket,
  Eye,
  EyeOff,
  Lock,
  Users,
  Calendar,
  X,
} from 'lucide-react';

export default function NewPollPage() {
  const router = useRouter();
  const store = usePollBuilderStore();
  const { draft, setField, addQuestion, resetDraft } = store;

  const [tab, setTab] = useState<'build' | 'settings'>('build');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // const handleCreate = async (status: 'draft' | 'active') => {
  //   if (!draft.title.trim()) {
  //     setError('Give your poll a title first.');
  //     return;
  //   }
  //   if (draft.questions.some((q) => !q.text.trim())) {
  //     setError('All questions need text.');
  //     return;
  //   }

  //   setIsSubmitting(true);
  //   setError('');
  //   try {
  //     const payload: PollDraft = {
  //       ...draft,
  //       status,
  //       questions: draft.questions.map((q) => ({
  //         ...q,
  //         choices: q.choices.filter((c) => c.text.trim()),
  //       })),
  //     };
  //     const { data: poll } = await pollsApi.create(payload);
  //     resetDraft();
  //     router.push(
  //       status === 'active' ? `/polls/${poll.short_id}` : '/dashboard',
  //     );
  //   } catch (err) {
  //     setError(extractErrorMessage(err));
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleCreate = async (status: 'draft' | 'active') => {
    if (!draft.title.trim()) {
      setError('Give your poll a title first.');
      return;
    }
    if (draft.questions.some((q) => !q.text.trim())) {
      setError('All questions need text.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const payload: PollDraft = {
        ...draft,
        status,
        questions: draft.questions.map((q) => ({
          ...q,
          choices: q.choices.filter((c) => c.text.trim()),
        })),
      };
      const response = await pollsApi.create(payload);
      const poll = response.data; // ← axios wraps in .data

      if (!poll?.short_id) {
        setError('Poll was created but could not redirect. Go to Dashboard.');
        return;
      }

      resetDraft();
      router.push(
        status === 'active' ? `/polls/${poll.short_id}` : '/dashboard',
      );
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Build a poll</h1>
          <p className="text-(--text-secondary) text-sm">
            Add questions, configure settings, then publish.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-(--bg-elevated) p-1 rounded-lg mb-6 w-fit">
          {[
            { id: 'build', label: 'Questions' },
            { id: 'settings', label: 'Settings' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as 'build' | 'settings')}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                tab === t.id
                  ? 'bg-(--bg-surface) text-(--text-primary) shadow-sm'
                  : 'text-(--text-secondary)'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {tab === 'build' ? (
            <motion.div
              key="build"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-4"
            >
              {/* Poll title */}
              <input
                value={draft.title}
                onChange={(e) => setField('title', e.target.value)}
                placeholder="Poll title…"
                className="field text-xl font-bold py-4 placeholder:font-normal"
              />
              <textarea
                value={draft.description}
                onChange={(e) => setField('description', e.target.value)}
                placeholder="Optional description"
                rows={2}
                className="field resize-none text-sm"
              />

              {/* Questions */}
              <div className="space-y-3">
                {draft.questions.map((q, i) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <QuestionEditor question={q} index={i} />
                  </motion.div>
                ))}
              </div>
              {/* Tags */}
              <div className="card-glow p-5">
                <label className="block text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-3">
                  Tags
                  <span className="ml-2 text-(--text-muted) normal-case font-normal">
                    — helps people discover your poll
                  </span>
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {draft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-(--accent-glow) border border-(--accent-dim) text-(--accent)"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() =>
                          setField(
                            'tags',
                            draft.tags.filter((t) => t !== tag),
                          )
                        }
                        className="hover:text-red-400 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'politics',
                    'tech',
                    'sports',
                    'food',
                    'music',
                    'gaming',
                    'science',
                    'other',
                  ]
                    .filter((t) => !draft.tags.includes(t))
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setField('tags', [...draft.tags, tag])}
                        className="px-3 py-1 rounded-full text-xs font-semibold border border-(--border) text-(--text-secondary) hover:border-(--accent-dim) hover:text-(--accent) hover:bg-(--accent-glow) transition-all"
                      >
                        + {tag}
                      </button>
                    ))}
                </div>
              </div>
              <button
                onClick={addQuestion}
                className="w-full py-3 rounded-lg border border-dashed border-(--border-bright) text-(--text-secondary) hover:text-(--accent) hover:border-(--accent) transition-all flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus size={15} /> Add question
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="card-glow p-6 space-y-6"
            >
              <SettingToggle
                icon={<Eye size={15} />}
                label="Public poll"
                desc="Anyone can find and vote on this poll"
                checked={draft.is_public}
                onChange={(v) => setField('is_public', v)}
              />
              <SettingToggle
                icon={<Users size={15} />}
                label="Allow anonymous votes"
                desc="Voters don't need to be logged in"
                checked={draft.allow_anonymous}
                onChange={(v) => setField('allow_anonymous', v)}
              />
              <SettingToggle
                icon={<EyeOff size={15} />}
                label="Hide results before voting"
                desc="Results only visible after casting a vote"
                checked={draft.show_results_before_vote}
                onChange={(v) => setField('show_results_before_vote', v)}
              />
              <SettingToggle
                icon={<Eye size={15} />}
                label="Show results after close"
                desc="Keep results visible when poll closes"
                checked={draft.show_results_after_close}
                onChange={(v) => setField('show_results_after_close', v)}
              />

              <div className="border-t border-(--border) pt-5 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                    <Lock size={12} /> Password protect
                  </label>
                  <input
                    type="password"
                    value={draft.password}
                    onChange={(e) => setField('password', e.target.value)}
                    placeholder="Leave blank for no password"
                    className="field text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                    <Users size={12} /> Voter cap
                  </label>
                  <input
                    type="number"
                    value={draft.voter_cap ?? ''}
                    onChange={(e) =>
                      setField(
                        'voter_cap',
                        e.target.value ? +e.target.value : null,
                      )
                    }
                    placeholder="Unlimited"
                    className="field text-sm"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-2">
                    <Calendar size={12} /> Expires at
                  </label>
                  <input
                    type="datetime-local"
                    value={draft.expires_at ?? ''}
                    onChange={(e) =>
                      setField('expires_at', e.target.value || null)
                    }
                    className="field text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleCreate('draft')}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg border border-(--border) text-(--text-secondary) font-semibold text-sm hover:border-(--border-bright) transition-colors disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            onClick={() => handleCreate('active')}
            disabled={isSubmitting}
            className="flex-1 py-2.5 rounded-lg bg-(--accent) text-(--bg-base) font-bold text-sm hover:bg-(--accent-dim) transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Rocket size={15} />
            {isSubmitting ? 'Publishing…' : 'Publish poll'}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function SettingToggle({
  icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 text-(--text-muted)">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-(--text-muted) mt-0.5">{desc}</p>
        </div>
      </div>
      <div
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 rounded-full transition-colors cursor-pointer relative shrink-0 ${
          checked ? 'bg-(--accent)' : 'bg-(--bg-overlay)'
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-4' : ''
          }`}
        />
      </div>
    </div>
  );
}
