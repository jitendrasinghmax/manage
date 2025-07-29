"use client"
import { Popover, PopoverTrigger } from "@radix-ui/react-popover"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { PopoverContent } from "./ui/popover"
import { Calendar } from "./ui/calendar"
import { AddMemberCommand } from "./createUI/addMemberCommand"
import { useFetch } from "@/hook/useFetch"
import { useContextProvider } from "@/context/context"

export const CreateProject = ({onSucess}:{onSucess:()=>void}) => {
    const {org,setProjects}=useContextProvider();
    const [openSwitch, setOpenSwitch] = useState(false);
    const [members,setMembers]=useState<string[]>([]);
    const [inputData,setInputData]=useState({
        name:"",
        desc:"",
        slug:"",
        deadline:new Date(),
        organization:org.id,
        members:[]
    })
    const {post}=useFetch();
    const handleCreateProject = async () => {
        const projectResp=await post("/api/project/create","POST",inputData)
        if(projectResp){
            setProjects((prev)=>([...(prev||[]),projectResp.project]))
            onSucess();
        }
    }
    useEffect(()=>{
        setInputData((prev)=>({...prev,members:members}))
    },[members])
    return <div className="flex flex-col gap-3 mt-2">
                <Input placeholder="name" onChange={(e)=>setInputData((prev)=>({...prev,name:e.target.value}))}></Input>
                <Input placeholder="desc" onChange={(e)=>setInputData((prev)=>({...prev,desc:e.target.value}))}></Input>
                <Input placeholder="slug" onChange={(e)=>setInputData((prev)=>({...prev,slug:e.target.value}))}></Input>
                <Popover open={openSwitch} onOpenChange={setOpenSwitch}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-48 justify-between font-normal"
                        >
                           select date
                        </Button>                                
                        </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={inputData.deadline} onSelect={(val)=>val && setInputData((prev)=>({...prev,deadline:val}))} />
                    </PopoverContent>
                </Popover>
                <AddMemberCommand members={members} setMembers={setMembers} />
                <Button className="w-full" onClick={handleCreateProject}>Create</Button>
    </div>
}