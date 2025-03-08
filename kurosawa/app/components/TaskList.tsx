import { Task } from "@prisma/client";
import { Label } from "@radix-ui/react-label";
import { Input } from "postcss";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { DeleteIcon } from "lucide-react";
import { TaskCard } from "./TaskCard";

interface IProps {
  tasks: Task[];
  onClickDelete: () => void;
}

export const TaskList = ({ tasks, onClickDelete }: IProps) => {
  return (
    <Card className="w-[500px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{"category.name"}</CardTitle>
        <Button size="icon">
          <DeleteIcon />
        </Button>
      </CardHeader>
      <CardContent>
        {tasks.map((task) => (
          <div key={task.id}>
            <TaskCard task={task} onClickDelete={onClickDelete} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
