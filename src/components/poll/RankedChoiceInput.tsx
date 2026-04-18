'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Draggable, DropResult } from 'react-beautiful-dnd';
import { StrictModeDroppable } from './StrictModeDroppable';
import { motion } from 'framer-motion';
import { GripVertical, Trophy, Medal } from 'lucide-react';
import { Choice } from '@/src/types';

interface RankedChoiceInputProps {
  choices: Choice[];
  onChange: (orderedChoiceIds: string[], ranks: number[]) => void;
}

function getRankIcon(rank: number) {
  if (rank === 1) return <Trophy size={13} className="text-(--accent)" />;
  if (rank === 2)
    return <Medal size={13} className="text-(--text-secondary)" />;
  if (rank === 3) return <Medal size={13} className="text-(--text-muted)" />;
  return null;
}

function getRankLabel(rank: number) {
  if (rank === 1) return '1st';
  if (rank === 2) return '2nd';
  if (rank === 3) return '3rd';
  return `${rank}th`;
}

export function RankedChoiceInput({
  choices,
  onChange,
}: RankedChoiceInputProps) {
  const [ordered, setOrdered] = useState<Choice[]>(() =>
    [...choices].sort((a, b) => a.order - b.order),
  );
  const [isDragging, setIsDragging] = useState(false);

  // Sync parent whenever order changes
  useEffect(() => {
    const ids = ordered.map((c) => c.id);
    const ranks = ordered.map((_, i) => i + 1);
    onChange(ids, ranks);
  }, [ordered]);

  const onDragStart = () => setIsDragging(true);

  const onDragEnd = (result: DropResult) => {
    setIsDragging(false);
    if (!result.destination) return;
    if (result.destination.index === result.source.index) return;

    const next = Array.from(ordered);
    const [moved] = next.splice(result.source.index, 1);
    next.splice(result.destination.index, 0, moved);
    setOrdered(next);
  };

  return (
    <div>
      <p className="text-xs text-(--text-muted) mb-3 flex items-center gap-1.5">
        <GripVertical size={12} />
        Drag to rank — top is your first preference
      </p>

      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <StrictModeDroppable droppableId="ranked-choices">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`space-y-2 rounded-xl transition-colors ${
                snapshot.isDraggingOver ? 'bg-(--accent-glow)' : ''
              }`}
            >
              {ordered.map((choice, index) => (
                <Draggable
                  key={choice.id}
                  draggableId={choice.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={provided.draggableProps.style}
                    >
                      <motion.div
                        animate={{
                          scale: snapshot.isDragging ? 1.02 : 1,
                          boxShadow: snapshot.isDragging
                            ? '0 8px 32px rgba(0,0,0,0.4)'
                            : '0 0 0 rgba(0,0,0,0)',
                        }}
                        transition={{ duration: 0.15 }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                          snapshot.isDragging
                            ? 'border-(--accent) bg-(--bg-elevated) text-(--text-primary)'
                            : index === 0
                              ? 'border-(--accent-dim) bg-(--accent-glow) text-(--text-primary)'
                              : 'border-(--border) bg-(--bg-elevated) text-(--text-secondary)'
                        }`}
                      >
                        {/* Drag handle */}
                        <div
                          {...provided.dragHandleProps}
                          className="text-(--text-muted) hover:text-(--text-secondary) cursor-grab active:cursor-grabbing shrink-0"
                        >
                          <GripVertical size={16} />
                        </div>

                        {/* Rank badge */}
                        <div className="flex items-center gap-1.5 w-10 shrink-0">
                          {getRankIcon(index + 1)}
                          <span className="mono text-xs text-(--text-muted)">
                            {getRankLabel(index + 1)}
                          </span>
                        </div>

                        {/* Color dot */}
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background: choice.color || 'var(--text-muted)',
                          }}
                        />

                        {/* Choice text */}
                        <span className="flex-1 truncate">{choice.text}</span>

                        {/* Rank number — right side */}
                        <span
                          className={`mono text-lg font-bold shrink-0 ${
                            index === 0
                              ? 'text-(--accent)'
                              : 'text-(--text-muted)'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </motion.div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
      </DragDropContext>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between text-xs text-(--text-muted)">
        <span className="flex items-center gap-1">
          <Trophy size={11} className="text-(--accent)" />
          Top = most preferred
        </span>
        <span className="mono">{ordered.length} choices ranked</span>
      </div>
    </div>
  );
}
