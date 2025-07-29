'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { toast } from "sonner"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useFetch } from "@/hook/useFetch"
import { Checkbox } from "./ui/checkbox"
import { useContextProvider } from "@/context/context"

interface CreateTaskDialogProps {
    projectId: string
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [calenderOpen, setCalanderOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {projects,orgMembers}=useContextProvider()
    const { post } = useFetch();

    const [inputData, setInputData] = useState({
        aim: "",
        description: "",
        deadline: new Date(),
        priority: "MEDIUM",
        members: [] as string[],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setInputData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (id: string) => {
        setInputData((prev) => {
            const exists = prev.members.includes(id)
            const updatedMembers = exists
                ? prev.members.filter((m) => m !== id)
                : [...prev.members, id]
            return { ...prev, members: updatedMembers }
        })
    }

    const handleSubmit = async () => {
        if (!inputData.aim || !inputData.deadline || inputData.members.length === 0) {
            toast.error("Please fill in required fields: Aim, Deadline, and Members.")
            return
        }
        try {
            setLoading(true);
            const taskResp = await post("/api/task/create", "POST", {
                ...inputData, projectId
            })
            if (taskResp) {
                //setProjects(taskResp.task)
                setOpen(false)
            }
        }
        catch (e) { }
        finally {
            setLoading(false)
        }
    }
    const project=projects.find((p)=>p.id=projectId);
    const members=project.members.map((m)=>orgMembers.find((om)=>om.id===m))
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Task</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 ">
                    <div className="space-y-2">
                        <Label>Aim</Label>
                        <Input
                            name="aim"
                            value={inputData.aim}
                            onChange={handleChange}
                            placeholder="e.g. Implement Login"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            name="description"
                            value={inputData.description}
                            onChange={handleChange}
                            placeholder="Task description..."
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Deadline</Label>
                        <Popover open={calenderOpen} onOpenChange={setCalanderOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="outline">
                                    {inputData.deadline ? inputData.deadline.toLocaleDateString() : "Select date"}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <Calendar
                                    mode="single"
                                    selected={inputData.deadline}
                                    onSelect={(val) => {
                                        setInputData((prev) => ({ ...prev, deadline: val }))
                                        setCalanderOpen(false);
                                    }} />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="space-y-2">
                        <Label>Select priority</Label>
                        <Select onValueChange={(value) => setInputData({ ...inputData, priority: value })} defaultValue={inputData.priority}>
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
                    <div className=" space-y-2">
                        <Label>Assign Members</Label>
                        <div className="flex flex-col">
                            {members.map((member) => {
                                
                                return <Label className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950">
                                    <Checkbox
                                        checked={inputData.members.includes(member.id)}
                                        onCheckedChange={() => handleCheckboxChange(member.id)}
                                    />
                                    <img className="w-6 h-6 rounded-full" src={member.imgUrl} alt="" />
                                    <span>{member.email}</span>
                                </Label>
                            })}
                        </div>
                    </div>
                    <Button onClick={handleSubmit} className="w-full">
                        Create Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
