import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { format, differenceInCalendarDays } from "date-fns";
import { useContextProvider } from "@/context/context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useFetch } from "@/hook/useFetch";
import Loading from "@/components/loading";

type Task = {
  id: string;
  aim: string;
  description?: string;
  deadline: string;
  createdAt: string;
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


export default function TaskCard({
  task,
  tasks,
  setTasks,
}: {
  task: Task;
  tasks: Task[];
  setTasks: any;
}) {
  const [inputData, setInputData] = useState(task)
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false)
  const { orgMembers } = useContextProvider();
  const {post}=useFetch();

  const getMemberData = (id: string) => {
    return orgMembers?.find((m: any) => m.id === id);
  };
  const calculateDeadlineProgress = () => {
    const totalDays = differenceInCalendarDays(new Date(task.deadline), new Date(task.createdAt)) || 1;
    const passedDays = differenceInCalendarDays(new Date(Date.now()), task.createdAt);
    const percent = Math.min(100, Math.max(0, (passedDays / totalDays) * 100));
    console.log(totalDays,"  ",passedDays)
    return Math.floor(percent);
  };

  const deadlinePercent = calculateDeadlineProgress();

  const updateTaskHandeler=async()=>{
      try{
        setLoading(true)
        const updatedResp=await post('/api/task/update',"POST",{
          ...inputData
        })
        if(updatedResp){
          const updated_task=updatedResp.task;
          setTasks((prev)=>prev.map((t)=>{
            
            if(t.id===updated_task.id){
              return updated_task;
            }
            else return t;
          }))
          setOpen(false)
        }
      }
      catch(e){}
      finally{
        setLoading(false)
      }
  }

  return (
    <Card className="h-fit shadow-md border hover:shadow-lg transition-all duration-200 rounded-xl">
      <CardHeader>
        <div className="flex justify-end">
          <Badge className={`${priorityColorMap[task.priority]} text-white`}>
            {task.priority}
          </Badge>
        </div>
        <div className="">
          <div>
            <CardTitle className="text-lg font-semibold">{task.aim}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
          </div>

        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Assigned Members */}
        <div className="mt-2">
          <p className="font-medium text-sm mb-1">Assigned To:</p>
          <div className="flex -space-x-2">
            {task.members.map((id) => {
              const member = getMemberData(id);
              return (
                <Avatar key={id} className="w-8 h-8 border-2 border-white">
                  <AvatarImage src={member?.imgUrl} />
                  <AvatarFallback>{member?.name}</AvatarFallback>
                </Avatar>
              );
            })}
          </div>
        </div>

        {/* Deadline */}
        <div className="mt-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-muted-foreground">Deadline</span>
            <span>{format(new Date(task.deadline), "dd MMM yyyy")}</span>
          </div>
          <Progress value={deadlinePercent} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground text-end mt-1">
            {deadlinePercent}% time passed
          </p>
        </div>

        {/* Update Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
              Update Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogTitle className="text-lg font-semibold">Update Task</DialogTitle>
            <div className="flex flex-col space-y-2">
              <div className="space-y-2">
                <Label>Aim</Label>
                <Input value={inputData.aim} onChange={(e) => setInputData((prev) => ({ ...prev, aim: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={inputData.description} onChange={(e) => setInputData((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select defaultValue={inputData.priority} onValueChange={(value: "LOW" | "MEDIUM" | "HIGH" | "URGENT") => setInputData(() => ({ ...inputData, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>status</Label>
                <Select defaultValue={inputData.status} onValueChange={(value: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE") => setInputData(() => ({ ...inputData, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>status</SelectLabel>
                      <SelectItem value="TODO">Low</SelectItem>
                      <SelectItem value="IN_PROGRESS">IN_PROGRESS</SelectItem>
                      <SelectItem value="REVIEW">REVIEW</SelectItem>
                      <SelectItem value="DONE">DONE</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <DialogClose><Button className="w-24">close</Button></DialogClose>
              <Button className="w-24" onClick={updateTaskHandeler}>{loading?<Loading></Loading>:"update"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
