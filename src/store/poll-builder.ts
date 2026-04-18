import { create } from 'zustand';
import { PollDraft, QuestionDraft, ChoiceDraft, QuestionType } from '../types';
import { nanoid } from 'nanoid';

const defaultChoice = (order: number): ChoiceDraft => ({
  id: nanoid(),
  text: '',
  color: '',
  order,
});

const defaultQuestion = (order: number): QuestionDraft => ({
  id: nanoid(),
  text: '',
  description: '',
  question_type: 'single',
  order,
  is_required: true,
  min_choices: null,
  max_choices: null,
  max_text_length: 500,
  choices: [defaultChoice(0), defaultChoice(1)],
});

const defaultDraft = (): PollDraft => ({
  title: '',
  description: '',
  status: 'draft',
  is_public: true,
  password: '',
  allow_anonymous: true,
  show_results_before_vote: false,
  show_results_after_close: true,
  voter_cap: null,
  expires_at: null,
  embed_enabled: true,
  embed_theme: 'light',
  tags: [],
  questions: [defaultQuestion(0)],
});

interface PollBuilderState {
  draft: PollDraft;
  isDirty: boolean;
  activeQuestionId: string | null;

  // Draft-level actions
  setField: <K extends keyof PollDraft>(key: K, value: PollDraft[K]) => void;
  resetDraft: () => void;

  // Question actions
  addQuestion: () => void;
  removeQuestion: (id: string) => void;
  updateQuestion: (id: string, updates: Partial<QuestionDraft>) => void;
  reorderQuestions: (from: number, to: number) => void;
  setActiveQuestion: (id: string | null) => void;
  setQuestionType: (id: string, type: QuestionType) => void;

  // Choice actions
  addChoice: (questionId: string) => void;
  removeChoice: (questionId: string, choiceId: string) => void;
  updateChoice: (
    questionId: string,
    choiceId: string,
    updates: Partial<ChoiceDraft>,
  ) => void;
  reorderChoices: (questionId: string, from: number, to: number) => void;
}

export const usePollBuilderStore = create<PollBuilderState>((set, get) => ({
  draft: defaultDraft(),
  isDirty: false,
  activeQuestionId: null,

  setField: (key, value) =>
    set((s) => ({ draft: { ...s.draft, [key]: value }, isDirty: true })),

  resetDraft: () =>
    set({ draft: defaultDraft(), isDirty: false, activeQuestionId: null }),

  addQuestion: () =>
    set((s) => {
      const newQ = defaultQuestion(s.draft.questions.length);
      return {
        draft: { ...s.draft, questions: [...s.draft.questions, newQ] },
        activeQuestionId: newQ.id,
        isDirty: true,
      };
    }),

  removeQuestion: (id) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions
          .filter((q) => q.id !== id)
          .map((q, i) => ({ ...q, order: i })),
      },
      isDirty: true,
    })),

  updateQuestion: (id, updates) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions.map((q) =>
          q.id === id ? { ...q, ...updates } : q,
        ),
      },
      isDirty: true,
    })),

  reorderQuestions: (from, to) =>
    set((s) => {
      const qs = [...s.draft.questions];
      const [moved] = qs.splice(from, 1);
      qs.splice(to, 0, moved);
      return {
        draft: {
          ...s.draft,
          questions: qs.map((q, i) => ({ ...q, order: i })),
        },
        isDirty: true,
      };
    }),

  setActiveQuestion: (id) => set({ activeQuestionId: id }),

  setQuestionType: (id, type) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions.map((q) => {
          if (q.id !== id) return q;
          // Open text questions don't need choices
          const choices =
            type === 'open_text'
              ? []
              : q.choices.length >= 2
                ? q.choices
                : [defaultChoice(0), defaultChoice(1)];
          return { ...q, question_type: type, choices };
        }),
      },
      isDirty: true,
    })),

  addChoice: (questionId) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                choices: [...q.choices, defaultChoice(q.choices.length)],
              }
            : q,
        ),
      },
      isDirty: true,
    })),

  removeChoice: (questionId, choiceId) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                choices: q.choices
                  .filter((c) => c.id !== choiceId)
                  .map((c, i) => ({ ...c, order: i })),
              }
            : q,
        ),
      },
      isDirty: true,
    })),

  updateChoice: (questionId, choiceId, updates) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                choices: q.choices.map((c) =>
                  c.id === choiceId ? { ...c, ...updates } : c,
                ),
              }
            : q,
        ),
      },
      isDirty: true,
    })),

  reorderChoices: (questionId, from, to) =>
    set((s) => ({
      draft: {
        ...s.draft,
        questions: s.draft.questions.map((q) => {
          if (q.id !== questionId) return q;
          const cs = [...q.choices];
          const [moved] = cs.splice(from, 1);
          cs.splice(to, 0, moved);
          return { ...q, choices: cs.map((c, i) => ({ ...c, order: i })) };
        }),
      },
      isDirty: true,
    })),
}));
