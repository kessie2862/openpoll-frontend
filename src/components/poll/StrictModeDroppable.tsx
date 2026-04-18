'use client';

import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

export function StrictModeDroppable({ children, ...props }: DroppableProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const anim = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(anim);
  }, []);

  if (!enabled) return null;

  return (
    <Droppable
      isDropDisabled={false}
      isCombineEnabled={false}
      ignoreContainerClipping={false}
      {...props}
    >
      {children}
    </Droppable>
  );
}
