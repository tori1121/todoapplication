import { cva } from "class-variance-authority";
import { DnDItem } from "./type";
import {
  defaultKeyboardCoordinateGetter,
  DndContext,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  useDndContext,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ClientOnly } from "remix-utils/client-only";
import { SortableItem } from "./SortableItem";
import { Task } from "@prisma/client";

interface IProps {
  type: string;
  defaultTask: Task[];
  onChangeSort: (item: Task[]) => void;
}

const variants = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
  variants: {
    dragging: {
      default: "snap-x snap-mandatory",
      active: "snap-none",
    },
  },
});

export function DnDContainer({ type, defaultTask, onChangeSort }: IProps) {
  const dndContext = useDndContext();

  const [tasks, setTasks] = useState<Task[]>(defaultTask);
  const itemIds = useMemo(() => {
    return tasks.map((item) => item.id);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveTask = activeData?.type === type;
    const isOverTask = overData?.type === type;

    if (!isActiveTask) return;

    if (!isActiveTask && isOverTask) {
      const prev = structuredClone(tasks);
      const oldIndex = prev.map((p) => p.id).indexOf(activeId as string);
      const newIndex = prev.map((n) => n.id).indexOf(overId as string);

      const newItems = arrayMove(prev, oldIndex, newIndex);
      setTasks(newItems);
      onChangeSort(newItems);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <DndContext onDragOver={onDragOver} sensors={sensors}>
          <SortableContext items={tasks}>
            {tasks.map((item) => (
              <SortableItem key={item.id} type={type} item={item} />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </ClientOnly>
  );
}
