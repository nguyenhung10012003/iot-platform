'use client';

import { cn } from '@repo/ui/lib/utils';
import update from 'immutability-helper';
import { Children, useCallback, useState, type ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DragDropItem from './DragDropItem';

interface WidgetContainerProps {
  children: ReactNode;
  className?: string;
}

export default function DragDropContainer({
  children,
  className,
}: WidgetContainerProps) {
  // Convert children to an array
  const childrenArray = Children.toArray(children);

  // Create a state to track the order of children
  const [order, setOrder] = useState<number[]>(
    Array.from({ length: childrenArray.length }, (_, i) => i),
  );

  // Function to move a widget from one position to another
  const moveWidget = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Update the order array using immutability-helper
      setOrder(
        update(order, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, order[dragIndex]],
          ] as Array<[number, number] | [number, number, number]>,
        }),
      );
    },
    [order],
  );

  // Reorder the children based on the current order state
  const orderedChildren = order.map((index) => childrenArray[index]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={cn('grid', className)}>
        {orderedChildren.map((child, index) => (
          <DragDropItem key={index} index={index} moveWidget={moveWidget}>
            {child}
          </DragDropItem>
        ))}
      </div>
    </DndProvider>
  );
}
