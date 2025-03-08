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
import { useEffect, useMemo, useState } from "react";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { ClientOnly } from "remix-utils/client-only";
import { SortableItem } from "./SortableItem";
import { Task } from "@prisma/client";
import { cn } from "~/lib/utils";

interface IProps {
  type: string;
  tasks: Task[];
  onChangeSort: (item: Task[]) => void;
  onBlurDragging: () => void;
}

const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
  variants: {
    dragging: {
      default: "snap-x snap-mandatory",
      active: "snap-none",
    },
  },
});

export function DnDContainer({
  type,
  tasks,
  onChangeSort,
  onBlurDragging,
}: IProps) {
  const dndContext = useDndContext();

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
    console.log("DragOver");

    if (activeId === overId) return;
    console.log("🚀");

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveTask = activeData?.type === type;
    const isOverTask = overData?.type === type;

    console.log("🚀🚀");

    if (!isActiveTask) return;
    console.log("🚀🚀🚀");

    if (isActiveTask && isOverTask) {
      const prev = structuredClone(tasks);
      const oldIndex = prev.map((p) => p.id).indexOf(activeId as string);
      const newIndex = prev.map((n) => n.id).indexOf(overId as string);

      const newItems = arrayMove(prev, oldIndex, newIndex);
      console.log("🚀 ~ onDragOver ~ newItems:", newItems);
      onChangeSort(newItems);
    }
  }

  return (
    <ClientOnly>
      {() => (
        <DndContext onDragOver={onDragOver} sensors={sensors}>
          <div
            className={cn(
              "flex flex-col gap-2",
              variations({
                dragging: dndContext.active ? "active" : "default",
              })
            )}
          >
            <SortableContext items={itemIds}>
              {tasks.map((item) => (
                <SortableItem
                  key={item.id}
                  type={type}
                  item={item}
                  onBlurDragging={onBlurDragging}
                />
              ))}
            </SortableContext>
          </div>
        </DndContext>
      )}
    </ClientOnly>
  );
}
