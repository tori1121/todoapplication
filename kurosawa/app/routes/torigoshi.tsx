import { addDay } from "@formkit/tempo";
import { Task } from "@prisma/client";
import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { CircleX, DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DnDContainer } from "~/components/dnd";
import { DnDItem } from "~/components/dnd/type";
import { TaskCard } from "~/components/TaskCard";
import { TaskList } from "~/components/TaskList";
import { Button } from "~/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { prisma } from "~/lib/prisma";

export async function loader() {
  const tasks = await prisma.task.findMany({
    orderBy: { orderNo: "asc" },
  });
  const user = await prisma.user.findUnique({
    where: { id: "1" },
  });

  return { tasks, user };
}

export default function TorigoshiPage() {
  const { tasks, user } = useLoaderData<typeof loader>();
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const submit = useSubmit();

  const handleAddTask = (title: string) => {
    const formData = new FormData();
    formData.append("intent", "create");
    formData.append("title", title);
    submit(formData, { method: "post" });
  };

  const handleDelete = (taskId: string) => {
    const formData = new FormData();
    formData.append("intent", "delete");
    formData.append("taskId", taskId);
    submit(formData, { method: "post" });
  };

  const handleSortTask = (tasks: Task[]) => {
    const sortData = tasks.map((task, index) => ({
      ...task,
      orderNo: String(index + 1),
    }));
    console.log("🚀 ~ sortData ~ sortData:", sortData);

    const formData = new FormData();
    formData.append("intent", "sort");
    formData.append("sortData", JSON.stringify(sortData));
    submit(formData, { method: "post" });
  };

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  return (
    <div className="h-screen w-full">
      <header className="bg-slate-600 h-10 flex justify-center items-center px-6">
        <h1 className="text-xl text-white">TODO Application</h1>
        <div className="flex-1" />
        <p className="text-white">{user?.name}</p>
      </header>

      <div className="h-[calc(100vh-40px)] bg-slate-100 p-10">
        <Card className="w-[350px]">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <CardTitle>Today</CardTitle>
            <Button type="submit" size="icon" variant="ghost">
              <CircleX className="text-red-600" />
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <DnDContainer
              type="today"
              tasks={tasks}
              onChangeSort={(sorted) => setTaskList(sorted)}
              onBlurDragging={() => handleSortTask(taskList)}
            />

            <Input
              name="name"
              placeholder="Add a task"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const value = (e.target as HTMLInputElement).value;
                  handleAddTask(value);
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const title = formData.get("title") as string;
  const taskId = formData.get("taskId") as string;
  const sortData = JSON.parse(formData.get("sortData") as string) as Task[];

  if (intent === "create") {
    await prisma.task.create({
      data: {
        title: title,
        userId: "1",
        orderNo: String(new Date().getTime()),
        endDate: addDay(new Date(), 7),
        status: "todo",
      },
    });
  }
  if (intent === "delete") {
    await prisma.task.delete({
      where: { id: taskId },
    });
  }

  if (intent === "sort") {
    for await (const task of sortData) {
      console.log("🚀 ~ forawait ~ task:", task.id, task.orderNo);
      await prisma.task.update({
        where: { id: task.id },
        data: { orderNo: task.orderNo },
      });
    }
  }

  return null;
}
