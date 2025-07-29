import { useFetch } from "@/hook/useFetch"
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

const RemoveMember=({id}:{id:string})=>{
    const [user,setUser]=useState(null);
    const {post}=useFetch();
    const getUserHandeler=async()=>{
        const userResp=await post('/api/user/getUserById',"POST",{id});
        setUser(userResp.user)
    }
    useEffect(()=>{
        getUserHandeler();
    },[])
    return <div>
        {user&&<div className="flex justify-between  px-2 py-1 rounded-md  hover:bg-slate-800">
                <div className="flex gap-x-3">
                    <img className="h-6 w-6 rounded-full" src={user.imgUrl}></img>
                    <p className="text-sm">{user.email}</p>
                </div>
                <div>
                    {}
                    <Button className="text-sm text-red-500" size="sm">Admin</Button>
                </div>
            </div>}
    </div>
}

export default React.memo(RemoveMember);