import type { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';

import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  Active,
  Announcements,
  DataRef,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  Over,
  TouchSensor,
  useDndContext,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';

type DraggableData = ColumnDragData | ItemDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined,
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === 'Column' || data?.type === 'Item') {
    return true;
  }

  return false;
}

export interface Item {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string | React.ReactNode;
  index?: number;
}

interface KanbanItemProps {
  item: Item;
  isOverlay?: boolean;
}

export type ItemType = 'Item';

export interface ItemDragData {
  type: ItemType;
  item: Item;
}

export function KanbanItem({ item, isOverlay }: KanbanItemProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'Item',
      item,
    } satisfies ItemDragData,
    attributes: {
      roleDescription: 'Item',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('px-0 py-0', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary',
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        variants({
          dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
        }),
        isDragging && 'cursor-grabbing',
        'relative',
      )}
    >
      <div className="absolute p-3 right-0 top-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 "
          {...attributes}
          {...listeners}
        >
          <span className="sr-only">Move item</span>
          <GripVertical />
        </Button>
      </div>
      {item.content}
      {item.index}
    </Card>
  );
}

export interface Column {
  id: UniqueIdentifier;
  title: string;
  header?: React.ReactNode;
  items: Item[];
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface KanbanColumnProps {
  column: Column;
  isOverlay?: boolean;
  isDraggable?: boolean;
  className?: string;
}

export function KanbanColumn({
  column,
  isOverlay,
  isDraggable = false,
  className,
}: KanbanColumnProps) {
  const itemsIds = useMemo(() => {
    return column.items.map((item) => item.id);
  }, [column.items]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: !isDraggable,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    'h-auto flex-1 flex-shrink-0 max-w-[350px] min-w-[250px] pb-2 bg-none flex flex-col snap-center',
    {
      variants: {
        dragging: {
          default: 'border-2 border-transparent',
          over: 'ring-2 opacity-30',
          overlay: 'ring-2 ring-primary',
        },
      },
    },
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        variants({
          dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
        }),
      )}
    >
      <div className={cn('flex flex-col gap-2', className)}>
        {column.header}
        <SortableContext items={itemsIds}>
          {column.items.map((item) => (
            <KanbanItem key={item.id} item={item} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function BoardContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const dndContext = useDndContext();

  const variations = cva('flex lg:justify-center pb-2 w-full', {
    variants: {
      dragging: {
        default: 'snap-x snap-mandatory',
        active: 'snap-none',
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className={cn('flex gap-4 flex-row', className)}>{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export type ColumnId = string | number;

export type KanbanBoardProps = {
  columns: Column[];
  setColumns: (columns: Column[] | ((columns: Column[]) => Column[])) => void;
  handleDragEnd?: (event: {
    itemId: UniqueIdentifier;
    newPosition: number;
    newColumnId: ColumnId;
    oldColumnId: ColumnId;
  }) => void;
};

export function KanbanBoard({
  columns,
  setColumns,
  handleDragEnd,
}: KanbanBoardProps) {
  const pickedUpItemColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeItem, setActiveItem] = useState<Item | null>(null);
  const dragState = useRef<{
    activeId: UniqueIdentifier | null;
    overId: UniqueIdentifier | null;
    activeColumnId: ColumnId | null;
    overColumnId: ColumnId | null;
    lastPosition: {
      activeId: UniqueIdentifier | null;
      overId: UniqueIdentifier | null;
    };
  }>({
    activeId: null,
    overId: null,
    activeColumnId: null,
    overColumnId: null,
    lastPosition: { activeId: null, overId: null },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor),
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  function getDraggingItemData(itemId: UniqueIdentifier, columnId: ColumnId) {
    const column = columns.find((col) => col.id === columnId);
    if (!column) return { itemsInColumn: [], itemPosition: -1, column: null };

    const itemPosition = column.items.findIndex((item) => item.id === itemId);
    return {
      itemsInColumn: column.items,
      itemPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Item') {
        pickedUpItemColumn.current = active.data.current.item.columnId;
        const { itemsInColumn, itemPosition, column } = getDraggingItemData(
          active.id,
          pickedUpItemColumn.current,
        );
        return `Picked up Item ${
          active.data.current.item.content
        } at position: ${itemPosition + 1} of ${itemsInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over?.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Item' &&
        over?.data.current?.type === 'Item'
      ) {
        const { itemsInColumn, itemPosition, column } = getDraggingItemData(
          over.id,
          over.data.current.item.columnId,
        );
        if (over.data.current.item.columnId !== pickedUpItemColumn.current) {
          return `Item ${
            active.data.current.item.content
          } was moved over column ${column?.title} in position ${
            itemPosition + 1
          } of ${itemsInColumn.length}`;
        }
        return `Item was moved over position ${itemPosition + 1} of ${
          itemsInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpItemColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over?.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Item' &&
        over?.data.current?.type === 'Item'
      ) {
        const { itemsInColumn, itemPosition, column } = getDraggingItemData(
          over.id,
          over.data.current.item.columnId,
        );
        if (over.data.current.item.columnId !== pickedUpItemColumn.current) {
          return `Item was dropped into column ${column?.title} in position ${
            itemPosition + 1
          } of ${itemsInColumn.length}`;
        }
        return `Item was dropped into position ${itemPosition + 1} of ${
          itemsInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpItemColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpItemColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <KanbanColumn key={col.id} column={col} />
          ))}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && <KanbanColumn isOverlay column={activeColumn} />}
            {activeItem && <KanbanItem item={activeItem} isOverlay />}
          </DragOverlay>,
          document.body,
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Item') {
      setActiveItem(data.item);
      dragState.current = {
        activeId: event.active.id,
        overId: null,
        activeColumnId: data.item.columnId,
        overColumnId: null,
        lastPosition: { activeId: null, overId: null },
      };
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveItem(null);

    const { active, over } = event;
    if (!over) return;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeData?.type === 'Column') {
      setColumns((columns) => {
        const activeColumnIndex = columns.findIndex(
          (col) => col.id === active.id,
        );
        const overColumnIndex = columns.findIndex((col) => col.id === over.id);
        return arrayMove(columns, activeColumnIndex, overColumnIndex);
      });
      return;
    }

    if (activeData?.type === 'Item') {
      const { activeId, overId, activeColumnId, overColumnId } =
        dragState.current;

      if (activeId && overId && overColumnId) {
        setColumns((columns) => {
          // Find source and target columns
          const sourceColumnIndex = columns.findIndex(
            (col) => col.id === activeColumnId,
          );
          const targetColumnIndex = columns.findIndex(
            (col) => col.id === overColumnId,
          );

          if (sourceColumnIndex === -1 || targetColumnIndex === -1)
            return columns;

          const sourceColumn = columns[sourceColumnIndex];
          const targetColumn = columns[targetColumnIndex];

          if (!sourceColumn || !targetColumn) return columns;

          // Find the item in the source column
          const sourceItemIndex = sourceColumn.items.findIndex(
            (item) => item.id === activeId,
          );
          if (sourceItemIndex === -1) return columns;

          const item = sourceColumn.items[sourceItemIndex];
          if (!item) return columns;

          // Find the target position in the target column
          const targetItemIndex = targetColumn.items.findIndex(
            (item) => item.id === overId,
          );
          const newPosition =
            targetItemIndex === -1
              ? targetColumn.items.length
              : targetItemIndex;

          // Create new columns array with the moved item
          const newColumns = [...columns];

          if (activeColumnId === overColumnId) {
            // Moving within the same column
            newColumns[sourceColumnIndex] = {
              ...sourceColumn,
              items: arrayMove(
                sourceColumn.items,
                sourceItemIndex,
                newPosition,
              ),
            };
          } else {
            // Moving between different columns
            // Remove item from source column
            newColumns[sourceColumnIndex] = {
              ...sourceColumn,
              items: sourceColumn.items.filter(
                (_, index) => index !== sourceItemIndex,
              ),
            };

            // Add item to target column at the correct position
            newColumns[targetColumnIndex] = {
              ...targetColumn,
              items: [
                ...targetColumn.items.slice(0, newPosition),
                { ...item, columnId: targetColumn.id },
                ...targetColumn.items.slice(newPosition),
              ],
            };
          }

          return newColumns;
        });

        if (activeColumnId && overColumnId) {
          const targetColumn = columns.find((col) => col.id === overColumnId);
          const targetItemIndex = targetColumn?.items.findIndex(
            (item) => item.id === overId,
          );
          const newPosition =
            targetItemIndex === -1 || targetItemIndex === undefined
              ? (targetColumn?.items.length ?? 0)
              : targetItemIndex;

          handleDragEnd?.({
            itemId: activeId,
            newColumnId: overColumnId,
            oldColumnId: activeColumnId,
            newPosition,
          });
        }
      }
    }

    // Reset drag state
    dragState.current = {
      activeId: null,
      overId: null,
      activeColumnId: null,
      overColumnId: null,
      lastPosition: { activeId: null, overId: null },
    };
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Skip if we're still over the same item
    if (
      dragState.current.lastPosition.activeId === activeId &&
      dragState.current.lastPosition.overId === overId
    ) {
      return;
    }

    // Update last position
    dragState.current.lastPosition = { activeId, overId };

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveAItem = activeData?.type === 'Item';
    const isOverAItem = overData?.type === 'Item';

    if (!isActiveAItem) return;

    // Store the current drag state without updating the items
    dragState.current = {
      ...dragState.current,
      activeId,
      overId,
      activeColumnId: isActiveAItem ? activeData.item.columnId : null,
      overColumnId: isOverAItem ? overData.item.columnId : (overId as ColumnId),
    };
  }
}

import {
  closestCorners,
  DroppableContainer,
  getFirstCollision,
  KeyboardCode,
  KeyboardCoordinateGetter,
} from '@dnd-kit/core';
import { Button } from '@repo/ui/components/ui/button';
import { Card } from '@repo/ui/components/ui/card';
import { ScrollArea, ScrollBar } from '@repo/ui/components/ui/scroll-area';
import { cn } from '@repo/ui/lib/utils';
import { GripVertical } from 'lucide-react';

const directions: string[] = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left,
];

export const coordinateGetter: KeyboardCoordinateGetter = (
  event,
  { context: { active, droppableRects, droppableContainers, collisionRect } },
) => {
  if (directions.includes(event.code)) {
    event.preventDefault();

    if (!active || !collisionRect) {
      return;
    }

    const filteredContainers: DroppableContainer[] = [];

    droppableContainers.getEnabled().forEach((entry) => {
      if (!entry || entry?.disabled) {
        return;
      }

      const rect = droppableRects.get(entry.id);

      if (!rect) {
        return;
      }

      const data = entry.data.current;

      if (data) {
        const { type, children } = data;

        if (type === 'Column' && children?.length > 0) {
          if (active.data.current?.type !== 'Column') {
            return;
          }
        }
      }

      switch (event.code) {
        case KeyboardCode.Down:
          if (active.data.current?.type === 'Column') {
            return;
          }
          if (collisionRect.top < rect.top) {
            // find all droppable areas below
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Up:
          if (active.data.current?.type === 'Column') {
            return;
          }
          if (collisionRect.top > rect.top) {
            // find all droppable areas above
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Left:
          if (collisionRect.left >= rect.left + rect.width) {
            // find all droppable areas to left
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Right:
          // find all droppable areas to right
          if (collisionRect.left + collisionRect.width <= rect.left) {
            filteredContainers.push(entry);
          }
          break;
      }
    });
    const collisions = closestCorners({
      active,
      collisionRect: collisionRect,
      droppableRects,
      droppableContainers: filteredContainers,
      pointerCoordinates: null,
    });
    const closestId = getFirstCollision(collisions, 'id');

    if (closestId != null) {
      const newDroppable = droppableContainers.get(closestId);
      const newNode = newDroppable?.node.current;
      const newRect = newDroppable?.rect.current;

      if (newNode && newRect) {
        return {
          x: newRect.left,
          y: newRect.top,
        };
      }
    }
  }

  return undefined;
};
