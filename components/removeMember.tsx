import { useFetch } from "@/hook/useFetch"
import React from "react";
import { Button } from "./ui/button";
import { useContextProvider } from "@/context/context";

const RemoveMember=({id}:{id:string})=>{
    const {post}=useFetch();
    const {org,setOrg,orgMembers}=useContextProvider();

    if(!org||!orgMembers)return <></>;

    const user=orgMembers.find((m)=>m.id==id);

    const deteteMemberHandeler=async()=>{
        const orgResp=await post("/api/organization/upate/remove","POST",{orgId:org.id,memberId:id});
        if(orgResp){
            setOrg(orgResp.org);
        }
    }

    return <div>
        {user&&<div className="flex justify-between  px-2 py-1 rounded-md  hover:bg-slate-800">
                <div className="flex gap-x-3">
                    <img className="h-6 w-6 rounded-full" src={user.imgUrl}></img>
                    <p className="text-sm">{user.email}</p>
                </div>
                <div>
            
                    <Button className="text-sm" size="sm" onClick={deteteMemberHandeler}>remove</Button>
                </div>
            </div>}
    </div>
}

export default React.memo(RemoveMember);