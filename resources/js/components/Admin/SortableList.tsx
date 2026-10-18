import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Identifiable {
    id: string | number;
}

interface SortableListProps<T extends Identifiable> {
    items: T[];
    onReorder: (items: T[]) => void;
    renderItem: (
        item: T,
        dragHandleProps: React.HTMLAttributes<HTMLButtonElement>,
    ) => React.ReactNode;
    className?: string;
}

export function SortableList<T extends Identifiable>({
    items,
    onReorder,
    renderItem,
    className = 'space-y-2',
}: SortableListProps<T>) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        }),
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const reordered = arrayMove(items, oldIndex, newIndex);
                onReorder(reordered);
            }
        }
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className={className}>
                    {items.map((item) => (
                        <SortableListItem
                            key={item.id}
                            id={item.id}
                            render={(dragHandleProps) =>
                                renderItem(item, dragHandleProps)
                            }
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

interface SortableListItemProps {
    id: string | number;
    render: (
        dragHandleProps: React.HTMLAttributes<HTMLButtonElement>,
    ) => React.ReactNode;
}

function SortableListItem({ id, render }: SortableListItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 20 : 'auto',
        opacity: isDragging ? 0.7 : 1,
    };

    const dragHandleProps: React.HTMLAttributes<HTMLButtonElement> = {
        ...attributes,
        ...listeners,
    };

    return (
        <div ref={setNodeRef} style={style}>
            {render(dragHandleProps)}
        </div>
    );
}

export function DragHandle({
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className="flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface)] hover:text-[var(--text)] active:cursor-grabbing"
            title="Drag to reorder"
            {...props}
        >
            <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                />
            </svg>
        </button>
    );
}
