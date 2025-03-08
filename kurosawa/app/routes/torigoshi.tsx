import { useLoaderData } from "@remix-run/react";
import { prisma } from "~/lib/prisma";

export async function loader() {
  const tasks = await prisma.task.findMany({});

  return { tasks };
}

export default function TorigoshiPage() {
  const { tasks } = useLoaderData<typeof loader>();
  return (
    <div className="h-screen w-full">
      <header className="bg-slate-600 h-10 flex justify-center items-center">
        <h1 className="text-xl text-white">TODO Application</h1>
      </header>

      <div className="h-[calc(100vh-40px)] bg-slate-100 p-10"></div>
    </div>
  );
}
