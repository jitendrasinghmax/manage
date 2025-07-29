import { Badge } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import React, { SetStateAction, useState } from "react";
import { useFetch } from "@/hook/useFetch";
import Loading from "../loading";

const status=["TODO","IN_PROGRESS","DONE","BLOCKED",]

export default ({currentProject,setCurrentProject}:{currentProject:any,setCurrentProject:React.Dispatch<React.SetStateAction<any>>})=>{
    const [loading,setLoading]=useState(false);
    const {post}=useFetch();
    const update=async(s)=>{
        try{
            setLoading(true);
            const projectResp=await post('/api/project/update',"POST",{
                ...currentProject,
                status:s
            })
            if(projectResp){
                setCurrentProject(projectResp.project);
            }
        }
        catch(e){

        }
        finally{
            setLoading(false);
        }
    }
    return  <div>
          <DropdownMenu>
            <DropdownMenuTrigger>
                    <Button variant="outline" className="w-36 h-12">{loading?<Loading/>:currentProject.status}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {status.map((s)=>{
                    if(s===currentProject.status)return null;
                    return <DropdownMenuItem><div className="pointer-coarse"
                                                    onClick={()=>update(s)}>{s.replace("_"," ")}</div></DropdownMenuItem>
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
}