import { useContextProvider } from "@/context/context"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import Image from "next/image";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { useEffect, useState } from "react";
import { useFetch } from "@/hook/useFetch";
import Loading from "../loading";

export default ({currentProject,setCurrentProject})=>{
    const [tempMembers,setTempMembers]=useState(null);
    const {orgMembers}=useContextProvider();
    const {post}=useFetch();
    const [loading,setLoading]=useState(false);
    const [open,SetOpen]=useState(false);
    const membersData=orgMembers.filter((om)=>currentProject.members.includes(om.id))

    const updateMembers=async()=>{
        try{
            setLoading(true)
            const membersId=tempMembers.map((m)=>m.id);
            const updatedResp=await post('/api/project/update',"POST",{
                ...currentProject,members:membersId
            })
            if(updatedResp){
                setCurrentProject(updatedResp.project);
                SetOpen(false)
            }
        }
        catch(e){}
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
        setTempMembers(membersData)
    },[])
    return <div className="w-full h-full p-4  border-2  bg-muted/20 rounded-lg shadow-md flex flex-col gap-y-3">
        <div className=" grid grid-cols-6 ">
            {membersData.map((member) => {
              return <HoverCard>
                <HoverCardTrigger>
                  <div >
                    <Image
                      key={member.id}
                      src={member.imgUrl}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1>{member.name}</h1>
                  <h1>{member.email}</h1>
                </HoverCardContent>
              </HoverCard>
            })}
          </div>
          {tempMembers&&<Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger>
                <Button variant="outline" className="w-full">Edit Member</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader ><DialogTitle>Add Members</DialogTitle></DialogHeader>
                <h1>project memebrs</h1>
                <div className="flex flex-col px-2 gap-y-2">
                    {tempMembers.map((m)=>{
                        return <div className=" flex justify-between border p-2 rounded-lg">
                            <Image
                      key={m.id}
                      src={m.imgUrl}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                     <div className="text-[10px] sm:text-lg">{m.email}<Button 
                        onClick={()=>setTempMembers((prev)=>prev.filter((pm)=>pm.id!=m.id))}>remove</Button></div>
                        </div>
                    })}
                </div>
                {
                    orgMembers.length>0&&(
                        <div>
                            <h1>organization members</h1>
                        {orgMembers.map((m)=>{
                            if(!tempMembers.every((cm)=>cm.id!=m.id))return null;
                        return <div className=" flex justify-between border p-2 rounded-lg">
                            <Image
                      key={m.id}
                      src={m.imgUrl}
                      alt="avatar"
                      width={32}
                      height={32}
                      className="rounded-full border-2 border-white"
                    />
                     <div className="text-[10px] sm:text-lg">{m.email}<Button 
                     onClick={()=>setTempMembers((prev)=>([...prev,m]))}>add</Button></div>
                        </div>
                    })}
                    </div>
                    )
                }
                <Button onClick={updateMembers}>{loading?<Loading/>:"save"}</Button>
                <DialogClose asChild>
                    <Button>close</Button>
                </DialogClose>
            </DialogContent>
          </Dialog>}
    </div>
}