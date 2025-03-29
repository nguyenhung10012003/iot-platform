'use client';

import { cn } from '@repo/ui/lib/utils';
import { GripVertical } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';

// Define the item type for drag and drop
const ITEM_TYPE = 'WIDGET';

// Props for the Widget component
interface WidgetProps {
  children: ReactNode;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
}

// Interface for the drag item
interface DragItem {
  index: number;
  type: string;
}

export default function DragDropItem({
  children,
  index,
  moveWidget,
}: WidgetProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Set up the drop functionality
  const [{ handlerId }, drop] = useDrop<any, any, any>({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveWidget(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  // Set up the drag functionality
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Initialize drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      data-handler-id={handlerId}
      className={cn(
        'relative cursor-move transition-opacity',
        isDragging ? 'opacity-50' : 'opacity-100',
      )}
    >
      <div className="absolute bottom-2 right-2 z-10 bg-white/80 rounded-full p-1 shadow-sm">
        <GripVertical className="h-5 w-5 text-gray-500" />
      </div>
      {children}
    </div>
  );
}
