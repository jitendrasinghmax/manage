import React from "react"
import { Button } from "../ui/button"
import { Command, CommandList } from "../ui/command"
import { useContextProvider } from "@/context/context"
import { MemberData } from "./memberData"


export const AddMemberCommand=({members,setMembers}:{members:string[],setMembers:React.Dispatch<React.SetStateAction<string[]>>})=>{
    const {user,orgMembers}=useContextProvider();

    return <>{<Command>
               <CommandList className=" ">
                <div className="px-2 text-gray-400">Organizations members</div>
                 {orgMembers&&orgMembers.length>0===true&&orgMembers.map((om)=>{
                    if(members.includes(om.id)||om.id===user.id)return null
                    return <div key={om.id} className="flex justify-between px-3 my-2">
                         <MemberData id={om.id}/>
                        <div><Button onClick={()=>setMembers((prev)=>[...prev,om.id])}>Add</Button></div>
                    </div>
                })}
               </CommandList>
               <CommandList>
                {members.length>0&&<div className="px-2 text-gray-400">Project Members</div>}
                {members.length>0===true&&members.map((id)=>{
                    return <div key={id} className="flex justify-between px-3 my-2">
                        <MemberData id={id}/>
                        <div><Button onClick={()=>setMembers((prev)=>prev.filter((m)=>m!=id))}>remove</Button></div>
                    </div>
                })}
                </CommandList>
            </Command>
            }</>
        
}