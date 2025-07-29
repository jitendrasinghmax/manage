"use client";

import { useEffect, useState } from "react";
import { useFetch } from "@/hook/useFetch";
import { useContextProvider } from "@/context/context";

import Filter from "@/components/filter";
import Card from "./card";
import { Button } from "@/components/ui/button";
import { CreateTaskDialog } from "@/components/createTask";
import { Skeleton } from "@/components/ui/skeleton";

type Task = {
  id: string;
  aim: string;
  description?: string;
  deadline: string;
  createdAt:string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  members: string[];
  projectId: string;
};

const priorityColorMap = {
  LOW: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-orange-500",
  URGENT: "bg-red-600",
};


export const CardContainer = ({ projectId }: { projectId: string }) => {
  const { post } = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [loading,setLoading]=useState(false)

  const fetchTasks = async () => {
    try{
      setLoading(true)
      const result = await post("/api/task/get", "POST", { id: projectId });
    if (result && result.tasks) {
      setTasks(result.tasks);
    }
    }
    catch(e){}
    finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const filteredTasks =
    filterStatus === "ALL"
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  if(loading){
    return <div className="w-full">
      <div className="w-full flex justify-evenly">
        {
          ["","","","",""].map(()=>(
            <Skeleton className="w-32 h-10"></Skeleton>
          ))
        }
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {
          ["","","","","","","","","",""].map(()=>(
            <Skeleton className="w-64 h-32 border"/>
          ))
        }
      </div>
    </div>
  }

  return (
    <div className="space-y-6">
      <div className="fixed bottom-10 left-10 z-20"><CreateTaskDialog projectId={projectId}/></div>
      <Filter filterStatus={filterStatus} setFilterStatus={setFilterStatus}/>
      {filteredTasks.length === 0 ? (
        <p className="text-muted-foreground text-sm">No tasks found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {filteredTasks.map((task) => (
           <Card task={task} tasks={tasks} setTasks={setTasks}/>
          ))}
        </div>
      )}
    </div>
  );
};
