import { Task } from "@prisma/client";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { DeleteIcon } from "lucide-react";

interface IProps {
  task: Task;
  onClickDelete: () => void;
}

export const TaskCard = ({ task, onClickDelete }: IProps) => {
  return (
    <Card className="w-[250px] p-3">
      <div className="flex flex-row justify-between items-center">
        <p className="text-lg font-semibold">{task.title}</p>
        <Button
          size="icon"
          type="button"
          variant="ghost"
          onClick={onClickDelete}
        >
          <DeleteIcon />
        </Button>
      </div>
    </Card>
  );
};
