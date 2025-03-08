import { DnDItem } from "./type";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { GripVertical } from "lucide-react";
import { Task } from "@prisma/client";

interface IProps {
  type: string;
  item: Task;
}

export function SortableItem({ item, type }: IProps) {
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
      type: type,
      item,
    },
    attributes: {
      roleDescription: type,
    },
    resizeObserverConfig: {},
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-row w-full items-center m-2 p-2 gap-3",
        variants({ dragging: isDragging ? "over" : undefined })
      )}
    >
      <Button
        variant={"ghost"}
        {...attributes}
        {...listeners}
        className="p-1 text-secendary-foreground/50 -ml-2 h-auth cursor-grab"
      >
        <span className="sr-only">MOVE</span>

        <p className="text-lg font-medium">{item.title}</p>
      </Button>
    </div>
  );
}
