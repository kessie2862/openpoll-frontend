'use client';

import { usePollBuilderStore } from '@/src/store/poll-builder';
import { QuestionDraft, QuestionType } from '@/src/types';
import { Trash2, Plus, GripVertical } from 'lucide-react';

const QUESTION_TYPES: { value: QuestionType; label: string; desc: string }[] = [
  { value: 'single', label: 'Single choice', desc: 'Pick one answer' },
  { value: 'multi', label: 'Multi choice', desc: 'Pick several answers' },
  { value: 'ranked', label: 'Ranked choice', desc: 'Drag to rank preferences' },
  { value: 'open_text', label: 'Open text', desc: 'Free-form text response' },
];

interface Props {
  question: QuestionDraft;
  index: number;
}

export function QuestionEditor({ question, index }: Props) {
  const {
    updateQuestion,
    removeQuestion,
    setQuestionType,
    addChoice,
    removeChoice,
    updateChoice,
    draft,
  } = usePollBuilderStore();

  const isOnly = draft.questions.length === 1;

  return (
    <div className="card-glow p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="mt-1 cursor-grab text-(--text-muted) hover:text-(--text-secondary)">
          <GripVertical size={16} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <span className="mono text-xs text-(--text-muted) w-5">
              Q{index + 1}
            </span>
            <input
              value={question.text}
              onChange={(e) =>
                updateQuestion(question.id, { text: e.target.value })
              }
              placeholder="Ask your question…"
              className="field flex-1"
            />
            {!isOnly && (
              <button
                onClick={() => removeQuestion(question.id)}
                className="p-2 rounded-lg text-(--text-muted) hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>

          {/* Type selector */}
          <div className="flex gap-2 flex-wrap">
            {QUESTION_TYPES.map((qt) => (
              <button
                key={qt.value}
                onClick={() => setQuestionType(question.id, qt.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  question.question_type === qt.value
                    ? 'bg-(--accent) text-(--bg-base) border-(--accent)'
                    : 'border-(--border) text-(--text-secondary) hover:border-(--border-bright)'
                }`}
              >
                {qt.label}
              </button>
            ))}
          </div>

          {/* Required toggle */}
          <label className="flex items-center gap-2 cursor-pointer w-fit">
            <div
              onClick={() =>
                updateQuestion(question.id, {
                  is_required: !question.is_required,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative ${
                question.is_required ? 'bg-(--accent)' : 'bg-(--bg-overlay)'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                  question.is_required ? 'translate-x-4' : ''
                }`}
              />
            </div>
            <span className="text-xs text-(--text-secondary)">Required</span>
          </label>
        </div>
      </div>

      {/* Choices (not for open text) */}
      {question.question_type !== 'open_text' && (
        <div className="ml-8 space-y-2">
          {question.choices.map((choice, ci) => (
            <div key={choice.id} className="flex items-center gap-2">
              <span className="mono text-xs text-(--text-muted) w-4">
                {ci + 1}
              </span>
              <input
                value={choice.text}
                onChange={(e) =>
                  updateChoice(question.id, choice.id, { text: e.target.value })
                }
                placeholder={`Option ${ci + 1}`}
                className="field flex-1 text-sm py-2"
              />
              {/* Color dot */}
              <input
                type="color"
                value={choice.color || '#f5a623'}
                onChange={(e) =>
                  updateChoice(question.id, choice.id, {
                    color: e.target.value,
                  })
                }
                className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                title="Choice color"
              />
              {question.choices.length > 2 && (
                <button
                  onClick={() => removeChoice(question.id, choice.id)}
                  className="text-(--text-muted) hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}

          {question.choices.length < 10 && (
            <button
              onClick={() => addChoice(question.id)}
              className="flex items-center gap-1.5 text-xs text-(--text-secondary) hover:text-(--accent) transition-colors ml-6 mt-1"
            >
              <Plus size={13} /> Add option
            </button>
          )}

          {/* Multi-choice constraints */}
          {question.question_type === 'multi' && (
            <div className="flex gap-3 mt-3 ml-6">
              <div>
                <label className="block text-xs text-(--text-muted) mb-1">
                  Min choices
                </label>
                <input
                  type="number"
                  min={1}
                  max={question.choices.length}
                  value={question.min_choices ?? ''}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      min_choices: e.target.value ? +e.target.value : null,
                    })
                  }
                  className="field w-20 text-sm py-1.5"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-xs text-(--text-muted) mb-1">
                  Max choices
                </label>
                <input
                  type="number"
                  min={1}
                  max={question.choices.length}
                  value={question.max_choices ?? ''}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      max_choices: e.target.value ? +e.target.value : null,
                    })
                  }
                  className="field w-20 text-sm py-1.5"
                  placeholder="—"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Open text note */}
      {question.question_type === 'open_text' && (
        <div className="ml-8 bg-(--bg-elevated) rounded-lg p-3 text-sm text-(--text-muted) border border-(--border)">
          Respondents will type a free-form answer. Max{' '}
          <input
            type="number"
            value={question.max_text_length}
            onChange={(e) =>
              updateQuestion(question.id, { max_text_length: +e.target.value })
            }
            className="inline-block w-16 bg-transparent border-b border-(--border) text-center text-(--text-secondary)"
          />{' '}
          characters.
        </div>
      )}
    </div>
  );
}
